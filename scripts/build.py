#!/usr/bin/env python3
"""Unified build — one command, all layers derive from the same truth.

Usage:
    python3 scripts/build.py          # full build
    python3 scripts/build.py --check  # verify consistency only (no write)

Source of truth:
    site/config.toml      → actor registry, entity registry, source registry
    site/content/**/*.md  → page text, descriptions, dates, taxonomies
    data/edges.toml       → graph edge definitions
    data/llms-editorial.md → hand-curated llms.txt editorial sections

Derived layers (all auto-generated):
    public/               → HTML, sitemap, atom feed, search index (zola)
    static/api/site.json  → site structure API for bots
    static/graph.json     → network graph (nodes from config, edges from data)
    static/graph.csv      → edge list (derived from graph.json)
    static/llms.txt       → agent index (template + auto-generated listings)
    static/llms-full.txt  → complete content dump
    content-manifest.toml → BLAKE3 integrity hashes
"""
import os, re, sys, json, csv, io, subprocess, tempfile, shutil
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SITE = ROOT / 'site'
CONTENT = SITE / 'content'
CONFIG = SITE / 'config.toml'
STATIC = SITE / 'static'
DATA = ROOT / 'data'
BASE_URL = 'https://detroit.primals.eco'

CHECK_ONLY = '--check' in sys.argv
ERRORS = []
WARNINGS = []


def log(msg):
    print(f'  {msg}')

def err(msg):
    ERRORS.append(msg)
    print(f'  ❌ {msg}')

def warn(msg):
    WARNINGS.append(msg)
    print(f'  ⚠️  {msg}')

def ok(msg):
    print(f'  ✅ {msg}')


# ── Parse config.toml ────────────────────────────────────────────────────

def parse_config():
    """Extract registries from config.toml (simple TOML subset)."""
    text = CONFIG.read_text()
    actors = {}
    entities = {}
    sources = {}
    bmf = {}

    current_table = None
    current_dict = None
    for line in text.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue

        table_match = re.match(r'\[extra\.actors\.(\w+)\]', line)
        if table_match:
            key = table_match.group(1)
            actors[key] = {}
            current_table = 'actor'
            current_dict = actors[key]
            continue

        table_match = re.match(r'\[extra\.entities\.(\w+)\]', line)
        if table_match:
            key = table_match.group(1)
            entities[key] = {}
            current_table = 'entity'
            current_dict = entities[key]
            continue

        table_match = re.match(r'\[extra\.sources\.(\w+)\]', line)
        if table_match:
            key = table_match.group(1)
            sources[key] = {}
            current_table = 'source'
            current_dict = sources[key]
            continue

        table_match = re.match(r'\[extra\.bmf\]', line)
        if table_match:
            current_table = 'bmf'
            current_dict = bmf
            continue

        if re.match(r'\[', line):
            current_table = None
            current_dict = None
            continue

        if current_dict is not None:
            kv = re.match(r'(\w+)\s*=\s*(.*)', line)
            if kv:
                k, v = kv.group(1), kv.group(2).strip()
                if v.startswith('"') and v.endswith('"'):
                    v = v[1:-1]
                elif v.startswith('['):
                    v = re.findall(r'"([^"]*)"', v)
                elif re.match(r'^\d+$', v):
                    v = int(v)
                current_dict[k] = v

    return actors, entities, sources, bmf


# ── Parse edges.toml ─────────────────────────────────────────────────────

def parse_edges():
    """Parse data/edges.toml into edge list."""
    text = (DATA / 'edges.toml').read_text()
    edges = []
    current = None

    for line in text.split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        if line == '[[edge]]':
            if current is not None:
                edges.append(current)
            current = {}
            continue
        if current is not None:
            kv = re.match(r'(\w+)\s*=\s*(.*)', line)
            if kv:
                k, v = kv.group(1), kv.group(2).strip()
                if v.startswith('"') and v.endswith('"'):
                    v = v[1:-1]
                elif re.match(r'^\d+$', v):
                    v = int(v)
                current[k] = v

    if current is not None:
        edges.append(current)
    return edges


# ── Parse content pages ──────────────────────────────────────────────────

def parse_frontmatter(path):
    content = path.read_text()
    parts = content.split('+++', 2)
    if len(parts) < 3:
        return {}, ''
    front_str, body = parts[1], parts[2].strip()

    meta = {}
    section = None
    for line in front_str.strip().split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        sec = re.match(r'\[(\w+(?:\.\w+)*)\]', line)
        if sec:
            section = sec.group(1)
            continue
        kv = re.match(r'(\w+)\s*=\s*(.*)', line)
        if not kv:
            continue
        k, v = kv.group(1), kv.group(2).strip()
        if v.startswith('"') and v.endswith('"'):
            v = v[1:-1]
        elif v.startswith('['):
            v = re.findall(r'"([^"]*)"', v)
        elif v == 'true':
            v = True
        elif v == 'false':
            v = False
        elif re.match(r'^\d+$', v):
            v = int(v)
        full_key = f'{section}.{k}' if section else k
        meta[full_key] = v

    return meta, body


def scan_content():
    """Scan content dir for all pages and sections."""
    sections = {}
    pages = []
    for md in sorted(CONTENT.rglob('*.md')):
        rel = str(md.relative_to(CONTENT))
        meta, body = parse_frontmatter(md)
        is_section = md.name == '_index.md'

        if is_section:
            url = '/' + rel.replace('_index.md', '')
            if not url.endswith('/'):
                url += '/'
            sections[url] = {
                'title': meta.get('title', ''),
                'description': meta.get('description', ''),
                'file': str(md.relative_to(ROOT)),
            }
        else:
            url = '/' + rel.replace('.md', '') + '/'
            taxonomies = {}
            for k, v in meta.items():
                if k.startswith('taxonomies.'):
                    name = k.split('.', 1)[1]
                    taxonomies[name] = v if isinstance(v, list) else [v]

            pages.append({
                'url': url,
                'title': meta.get('title', ''),
                'description': meta.get('description', ''),
                'date': meta.get('date'),
                'updated': meta.get('updated'),
                'file': str(md.relative_to(ROOT)),
                'taxonomies': taxonomies,
                'body': body,
            })

    return sections, pages


# ── Layer 1: Zola Build ──────────────────────────────────────────────────

def build_zola():
    print('\n[1/7] Zola build → HTML, sitemap, atom, search')
    result = subprocess.run(
        ['zola', 'build'],
        cwd=SITE,
        capture_output=True, text=True
    )
    if result.returncode != 0:
        err(f'zola build failed:\n{result.stderr}')
        return False
    m = re.search(r'Creating (\d+) pages.*?(\d+) sections', result.stdout)
    if m:
        ok(f'{m.group(1)} pages, {m.group(2)} sections')
    return True


# ── Layer 2: Graph (from config.toml + edges.toml) ───────────────────────

def build_graph(actors, entities, edges):
    print('\n[2/7] Graph → graph.json + graph.csv')

    # Build nodes from registries
    nodes = []
    node_ids = set()

    for key, actor in actors.items():
        node = {
            'id': key,
            'label': actor.get('display', key),
            'type': 'actor',
            'tier': actor.get('tier', 0),
            'role': actor.get('role', ''),
            'page': actor.get('page', ''),
        }
        nodes.append(node)
        node_ids.add(key)

    for key, entity in entities.items():
        node = {
            'id': key,
            'label': entity.get('display', key),
            'type': 'entity',
            'entity_type': entity.get('type', ''),
            'lara_id': entity.get('lara_id', ''),
            'page': entity.get('page', ''),
        }
        nodes.append(node)
        node_ids.add(key)

    # Add institutional nodes referenced in edges but not in registries
    institutional = set()
    for e in edges:
        for side in ['source', 'target']:
            nid = e[side]
            if nid not in node_ids:
                institutional.add(nid)

    for nid in sorted(institutional):
        nodes.append({
            'id': nid,
            'label': nid.replace('_', ' ').title(),
            'type': 'institution',
        })
        node_ids.add(nid)

    # Validate edges
    valid_edges = []
    for e in edges:
        if e['source'] not in node_ids:
            warn(f'Edge source "{e["source"]}" not in any registry')
        if e['target'] not in node_ids:
            warn(f'Edge target "{e["target"]}" not in any registry')
        valid_edges.append(e)

    # Build graph.json
    node_labels = {n['id']: n['label'] for n in nodes}
    graph = {
        '_generated': datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ'),
        '_source': 'Built by scripts/build.py from config.toml + data/edges.toml',
        'nodes': nodes,
        'edges': valid_edges,
        'epistemic_grammar': {
            'description': 'Every edge carries an epistemic status classifying the nature of the claim.',
            'statuses': {
                'record': 'Verifiable public record.',
                'corroborated': 'Independently confirmed by 2+ sources.',
                'inference': 'Analytical conclusion drawn from records.',
                'allegation': 'Formally alleged in complaint.',
                'filed': 'Submitted to agency/court.',
                'adjudicated': 'Determined by court or agency.',
                'corrected': 'Previously published claim corrected.',
            },
        },
    }

    if not CHECK_ONLY:
        (STATIC / 'graph.json').write_text(json.dumps(graph, indent=2, default=str))

        # Build graph.csv
        out = io.StringIO()
        w = csv.writer(out)
        w.writerow(['source_id', 'source_label', 'target_id', 'target_label',
                     'edge_type', 'epistemic_status', 'role', 'amount_usd',
                     'note', 'weight', 'source_doc'])
        for e in valid_edges:
            w.writerow([
                e['source'], node_labels.get(e['source'], e['source']),
                e['target'], node_labels.get(e['target'], e['target']),
                e['type'], e.get('epistemic_status', ''),
                e.get('role', ''), e.get('amount', ''),
                e.get('note', ''), e.get('weight', ''),
                e.get('source_doc', ''),
            ])
        (STATIC / 'graph.csv').write_text(out.getvalue())

    ok(f'{len(nodes)} nodes, {len(valid_edges)} edges → graph.json + graph.csv')
    return nodes, valid_edges


# ── Layer 3: Site API ────────────────────────────────────────────────────

def build_site_api(sections, pages):
    print('\n[3/7] Site API → api/site.json')
    # Reuse the generate-site-api script logic inline
    result = subprocess.run(
        [sys.executable, str(ROOT / 'scripts' / 'generate-site-api.py')],
        capture_output=True, text=True
    )
    if result.returncode != 0:
        err(f'generate-site-api.py failed:\n{result.stderr}')
        return
    ok(result.stdout.strip().split('\n')[0])


# ── Layer 4: llms.txt (template + auto-generated) ────────────────────────

def build_llms_txt(actors, entities, sources, sections, pages, nodes, edges):
    print('\n[4/7] llms.txt → agent index (template + auto-generated)')

    template = (DATA / 'llms-editorial.md').read_text()
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    # Count taxonomies
    all_tax = {}
    for p in pages:
        for tax, terms in p['taxonomies'].items():
            all_tax.setdefault(tax, set()).update(terms)
    tax_count = sum(len(t) for t in all_tax.values())
    tax_stats = f'{tax_count} term assignments across {len(pages)} pages'

    # ── HEADER ──
    header = f"""# detroit.primals.eco — Public Evidence Library
# Canonical URL: https://detroit.primals.eco/llms.txt
# Last updated: {today}
#
# CONTEXT DOCUMENT for AI agents acting on behalf of users.
# This is the site's glossary, index, and topology map — not a page.
# Intake this once to understand the full site structure, then fetch
# individual pages by URL for specific content.
#
# Every page links here via <link rel="describedby"> — that means
# "this resource describes the site context," NOT "this is the page
# content in text format." The page you want is at the URL you requested.
#
# Static site API: {BASE_URL}/api/site.json (structure, pages, taxonomies)
# Full content dump: {BASE_URL}/llms-full.txt
# Content manifest: {BASE_URL}/content-manifest.toml
# Network graph (JSON): {BASE_URL}/graph.json ({len(nodes)} nodes, {len(edges)} edges)
# Network graph (CSV): {BASE_URL}/graph.csv (edge list for Gephi/pandas/R)"""

    # ── WHAT'S NEW ──
    whats_new = f"""## What's New ({today})

- Federal master packet delivered to 8 federal agencies (Sep 22)
- PCA Board of Directors roster documented: Assistant AG Lamar Moreland
  (Vice Chair), City Council Member Latisha Johnson (Secretary) serve
  alongside Judge Cylenthia Miller (Chair) on a felon's school board
- Clutch Justice elevated to primary analytical reference (3-tier hierarchy)
- Epistemic grammar system: every claim carries machine-readable status
  (record / corroborated / inference / allegation / filed / adjudicated)
- Static site API at /api/site.json — full site structure in one fetch
- {len(pages)} content pages, {len(sections)} sections, {len(nodes)} graph nodes, {len(edges)} graph edges"""

    # ── CASE STATUS ──
    case_status = """## Active Case Status

| Case | Status | Court/Agency |
|------|--------|-------------|
| Federal packet (8 agencies) | Delivered Sep 22 | DOJ, FBI, IRS, ED-OIG, FTC, SEC, USED, FinCEN |
| Ingham County 2026-4349-CZ | Filed Sep 1 | Ingham County Circuit |
| PPO (Banks) | Hearing Sep 29 | Wayne County |
| DPSCD complaint | Filed Aug 31 | Detroit Public Schools |
| State Bar UPL complaint | Filed Aug 31 | State Bar of Michigan |
| JTC complaint | Filed Aug 31 | Judicial Tenure Commission |
| Michigan Court of Claims | Planned Oct 2026 | State of Michigan |
| Federal § 1983 + RICO | Planned Oct 2026 | E.D. Michigan |"""

    # ── SITE STRUCTURE (auto-generated from content) ──
    sitemap_lines = [f'## Site Structure ({len(pages) + len(sections)} content files)\n']

    # Group pages by section
    section_pages = {}
    for p in pages:
        parts = p['url'].strip('/').split('/')
        sec = '/' + '/'.join(parts[:-1]) + '/' if len(parts) > 1 else '/'
        section_pages.setdefault(sec, []).append(p)

    for sec_path in sorted(sections):
        sec = sections[sec_path]
        if sec_path == '/':
            sitemap_lines.append(f'### Root')
            sitemap_lines.append(f'- [Home]({BASE_URL}/) — {sec.get("description", "")[:80]}')
            continue

        depth = sec_path.strip('/').count('/') + 1
        prefix = '#' * min(depth + 2, 4)
        sitemap_lines.append(f'\n{prefix} {sec["title"]} ({sec_path})')

        for p in sorted(section_pages.get(sec_path, []), key=lambda x: x.get('weight', 99) if isinstance(x.get('weight'), int) else 99):
            short_title = p['title'].split(' — ')[0] if ' — ' in p['title'] else p['title']
            desc = p.get('description', '')[:100]
            sitemap_lines.append(f'- [{short_title}]({BASE_URL}{p["url"]}) — {desc}')

    # ── KEY ENTITIES (auto-generated from registries) ──
    entity_lines = ['## Key Entities Quick Reference\n',
        '| Entity | Role | Key Fact |',
        '|--------|------|----------|']
    for key, a in sorted(actors.items(), key=lambda x: x[1].get('tier', 99)):
        name = a.get('display', key)
        role = a.get('role', '')
        conn = a.get('connection', a.get('convictions', ''))[:60]
        entity_lines.append(f'| {name} | {role} | {conn} |')

    # ── Assemble ──
    output = template
    output = output.replace('{{HEADER}}', header)
    output = output.replace('{{WHATS_NEW}}', whats_new)
    output = output.replace('{{CASE_STATUS}}', case_status)
    output = output.replace('{{TAXONOMY_STATS}}', tax_stats)
    output = output.replace('{{SOURCE_COUNT}}', str(len(sources)))
    output = output.replace('{{ACTOR_COUNT}}', str(len(actors)))
    output = output.replace('{{ENTITY_COUNT}}', str(len(entities)))
    output = output.replace('{{NODE_COUNT}}', str(len(nodes)))
    output = output.replace('{{EDGE_COUNT}}', str(len(edges)))
    output = output.replace('{{SITE_STRUCTURE}}', '\n'.join(sitemap_lines))
    output = output.replace('{{KEY_ENTITIES}}', '\n'.join(entity_lines))

    if not CHECK_ONLY:
        (STATIC / 'llms.txt').write_text(output)

    ok(f'llms.txt: {len(output):,} chars, {len(actors)} actors, {len(entities)} entities, {len(sources)} sources')


# ── Layer 5: llms-full.txt (complete content dump) ───────────────────────

def build_llms_full(pages, sections, nodes, edges):
    print('\n[5/7] llms-full.txt → complete content dump')
    today = datetime.now(timezone.utc).strftime('%Y-%m-%d')

    output = [
        f'# detroit.primals.eco — Complete Content Dump',
        f'# Generated: {today}',
        f'# Static site API: {BASE_URL}/api/site.json',
        f'# Epistemic grammar: record → corroborated → inference → allegation → filed → adjudicated',
        f'# Network graph: /graph.json ({len(nodes)} nodes, {len(edges)} edges)',
        f'# For the structured index, see llms.txt',
        f'# For the site, see {BASE_URL}',
        '',
    ]

    all_files = sorted(CONTENT.rglob('*.md'))
    for fpath in all_files:
        rel = str(fpath.relative_to(CONTENT))
        url = '/' + rel.replace('/_index.md', '/').replace('_index.md', '/').replace('.md', '/')
        content = fpath.read_text()
        parts = content.split('+++', 2)
        body = parts[2].strip() if len(parts) >= 3 else content.strip()
        output.extend([
            '=' * 72,
            f'URL: {BASE_URL}{url}',
            f'File: {fpath.relative_to(ROOT)}',
            '=' * 72,
            body, '',
        ])

    if not CHECK_ONLY:
        (STATIC / 'llms-full.txt').write_text('\n'.join(output))

    ok(f'{len(all_files)} pages, {len(output):,} lines')


# ── Layer 6: Content Manifest (BLAKE3) ───────────────────────────────────

def build_manifest():
    print('\n[6/7] content-manifest.toml → BLAKE3 hashes')

    all_files = sorted(CONTENT.rglob('*.md'))
    hashes = []
    for fpath in all_files:
        result = subprocess.run(
            ['b3sum', '--no-names', str(fpath)],
            capture_output=True, text=True
        )
        hashes.append((str(fpath.relative_to(ROOT)), result.stdout.strip()))

    with tempfile.NamedTemporaryFile(mode='w', suffix='.txt', delete=False) as tmp:
        for _, h in hashes:
            tmp.write(h + '\n')
        tmp_path = tmp.name

    root_result = subprocess.run(
        ['b3sum', '--no-names', tmp_path],
        capture_output=True, text=True
    )
    root_hash = root_result.stdout.strip()
    os.unlink(tmp_path)

    now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')
    lines = [
        '# BLAKE3 Content Manifest',
        f'# Generated: {now}',
        f'# Pages: {len(hashes)}',
        f'root_hash = "{root_hash}"',
        '', '[pages]',
    ]
    for path, h in hashes:
        lines.append(f'"{path}" = "{h}"')

    manifest = '\n'.join(lines) + '\n'

    if not CHECK_ONLY:
        (ROOT / 'content-manifest.toml').write_text(manifest)
        shutil.copy(ROOT / 'content-manifest.toml', STATIC / 'content-manifest.toml')

    ok(f'{len(hashes)} files, root_hash={root_hash[:16]}...')


# ── Layer 7: Consistency Verification ────────────────────────────────────

def verify_consistency(actors, entities, sources, sections, pages, nodes, edges):
    print('\n[7/7] Consistency verification')

    # Every actor in config should have a page
    for key, actor in actors.items():
        page_url = actor.get('page', '')
        if page_url:
            matching = [p for p in pages if p['url'] == page_url]
            if not matching:
                warn(f'Actor "{key}" page {page_url} not found in content')
            else:
                ok_silent = True

    # Every entity in config should have a page
    for key, entity in entities.items():
        page_url = entity.get('page', '')
        if page_url:
            matching = [p for p in pages if p['url'] == page_url]
            if not matching:
                warn(f'Entity "{key}" page {page_url} not found in content')

    # Every graph node should exist in registries or be institutional
    registry_ids = set(actors.keys()) | set(entities.keys())
    for n in nodes:
        if n['id'] not in registry_ids and n['type'] != 'institution':
            warn(f'Graph node "{n["id"]}" not in config.toml registries')

    # Every edge source/target should be a valid node
    node_ids = {n['id'] for n in nodes}
    for e in edges:
        if e['source'] not in node_ids:
            err(f'Edge source "{e["source"]}" has no node')
        if e['target'] not in node_ids:
            err(f'Edge target "{e["target"]}" has no node')

    # Every page should have a description
    for p in pages:
        if not p.get('description'):
            warn(f'Page {p["url"]} has no description')

    # Count stats
    actor_pages = sum(1 for a in actors.values() if any(p['url'] == a.get('page', '') for p in pages))
    entity_pages = sum(1 for e in entities.values() if any(p['url'] == e.get('page', '') for p in pages))

    ok(f'Actors: {len(actors)} registered, {actor_pages} with pages')
    ok(f'Entities: {len(entities)} registered, {entity_pages} with pages')
    ok(f'Sources: {len(sources)} registered')
    ok(f'Graph: {len(nodes)} nodes, {len(edges)} edges')
    ok(f'Content: {len(sections)} sections, {len(pages)} pages')


# ── Main ─────────────────────────────────────────────────────────────────

def main():
    print(f'{"=" * 60}')
    print(f'detroit.primals.eco — unified build')
    print(f'{"=" * 60}')
    if CHECK_ONLY:
        print('MODE: consistency check only (no files written)')

    # Parse sources of truth
    print('\n[0/7] Parsing sources of truth')
    actors, entities, sources, bmf = parse_config()
    edges = parse_edges()
    sections, pages = scan_content()
    ok(f'config.toml: {len(actors)} actors, {len(entities)} entities, {len(sources)} sources')
    ok(f'edges.toml: {len(edges)} edges')
    ok(f'content/: {len(sections)} sections, {len(pages)} pages')

    # Build all layers
    if not CHECK_ONLY:
        if not build_zola():
            print('\n🛑 Zola build failed. Stopping.')
            sys.exit(1)

    nodes, valid_edges = build_graph(actors, entities, edges)
    if not CHECK_ONLY:
        build_site_api(sections, pages)
    build_llms_txt(actors, entities, sources, sections, pages, nodes, valid_edges)
    if not CHECK_ONLY:
        build_llms_full(pages, sections, nodes, valid_edges)
        build_manifest()

    verify_consistency(actors, entities, sources, sections, pages, nodes, valid_edges)

    # Summary
    print(f'\n{"=" * 60}')
    if ERRORS:
        print(f'🛑 {len(ERRORS)} errors, {len(WARNINGS)} warnings')
        for e in ERRORS:
            print(f'  ❌ {e}')
        sys.exit(1)
    elif WARNINGS:
        print(f'⚠️  0 errors, {len(WARNINGS)} warnings')
        for w in WARNINGS:
            print(f'  ⚠️  {w}')
    else:
        print('✅ All layers consistent. Zero errors, zero warnings.')

    if not CHECK_ONLY:
        print(f'\nDerived files:')
        for f in [
            'site/static/graph.json', 'site/static/graph.csv',
            'site/static/api/site.json', 'site/static/llms.txt',
            'site/static/llms-full.txt', 'content-manifest.toml',
            'site/static/content-manifest.toml',
        ]:
            path = ROOT / f
            if path.exists():
                print(f'  {f} ({path.stat().st_size:,} bytes)')


if __name__ == '__main__':
    main()
