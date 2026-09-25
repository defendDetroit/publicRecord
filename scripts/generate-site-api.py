#!/usr/bin/env python3
"""Generate /api/site.json — the static site API for bots and agents.

Run after every content change:
    python3 scripts/generate-site-api.py

Outputs: site/static/api/site.json
"""
import os, re, json
from datetime import datetime, timezone
from pathlib import Path

SITE_DIR = Path(__file__).resolve().parent.parent / 'site'
CONTENT_DIR = SITE_DIR / 'content'
OUTPUT = SITE_DIR / 'static' / 'api' / 'site.json'
BASE_URL = 'https://detroit.primals.eco'


def parse_frontmatter(path: Path):
    content = path.read_text()
    parts = content.split('+++', 2)
    if len(parts) < 3:
        return {}, '', 0
    front_str, body = parts[1], parts[2].strip()

    meta = {}
    current_section = None
    for line in front_str.strip().split('\n'):
        line = line.strip()
        if not line or line.startswith('#'):
            continue
        sec = re.match(r'\[(\w+(?:\.\w+)*)\]', line)
        if sec:
            current_section = sec.group(1)
            continue
        kv = re.match(r'(\w+)\s*=\s*(.*)', line)
        if not kv:
            continue
        key, val = kv.group(1), kv.group(2).strip()
        if val.startswith('"') and val.endswith('"'):
            val = val[1:-1]
        elif val.startswith('['):
            val = re.findall(r'"([^"]*)"', val)
        elif val == 'true':
            val = True
        elif val == 'false':
            val = False
        elif re.match(r'^\d+$', val):
            val = int(val)
        full_key = f'{current_section}.{key}' if current_section else key
        meta[full_key] = val

    clean = re.sub(r'\{[{%].*?[%}]\}', '', body)
    clean = re.sub(r'<[^>]+>', '', clean)
    clean = re.sub(r'\[([^\]]*)\]\([^)]*\)', r'\1', clean)
    clean = re.sub(r'[#*`~|>-]', '', clean)
    return meta, body, len(clean.split())


def url_for(rel_path: str, is_section: bool) -> str:
    if is_section:
        url = '/' + rel_path.replace('_index.md', '')
        return url if url.endswith('/') else url + '/'
    return '/' + rel_path.replace('.md', '') + '/'


def main():
    sections = {}   # url_path -> data
    pages = []      # flat list

    for md in sorted(CONTENT_DIR.rglob('*.md')):
        rel = str(md.relative_to(CONTENT_DIR))
        meta, body, wc = parse_frontmatter(md)
        is_section = md.name == '_index.md'
        url_path = url_for(rel, is_section)

        if is_section:
            sections[url_path] = {
                'type': 'section',
                'path': url_path,
                'url': BASE_URL + url_path,
                'title': meta.get('title', ''),
                'description': meta.get('description', ''),
                'word_count': wc,
                'pages': [],
                'subsections': [],
            }
        else:
            page = {
                'type': 'page',
                'path': url_path,
                'url': BASE_URL + url_path,
                'title': meta.get('title', ''),
                'description': meta.get('description', ''),
                'date': meta.get('date'),
                'updated': meta.get('updated'),
                'word_count': wc,
            }
            if meta.get('weight'):
                page['weight'] = meta['weight']

            taxonomies = {}
            for k, v in meta.items():
                if k.startswith('taxonomies.'):
                    name = k.split('.', 1)[1]
                    taxonomies[name] = v if isinstance(v, list) else [v]
            if taxonomies:
                page['taxonomies'] = taxonomies

            extra = {}
            for k, v in meta.items():
                if k.startswith('extra.'):
                    extra[k.split('.', 1)[1]] = v
            if extra.get('keywords'):
                page['keywords'] = extra['keywords']

            # Parent section
            parts = url_path.strip('/').split('/')
            parent = '/' + '/'.join(parts[:-1]) + '/' if len(parts) > 1 else '/'
            page['section'] = parent
            pages.append(page)

    # Link pages to sections
    for p in pages:
        sec_path = p['section']
        if sec_path in sections:
            sections[sec_path]['pages'].append(p['path'])

    # Link subsections
    for path in sorted(sections):
        if path == '/':
            continue
        parts = path.strip('/').split('/')
        parent = '/' + '/'.join(parts[:-1]) + '/' if len(parts) > 1 else '/'
        if parent in sections:
            sections[parent]['subsections'].append(path)

    # Taxonomy index
    tax_index = {}
    for p in pages:
        for tax, terms in p.get('taxonomies', {}).items():
            tax_index.setdefault(tax, {})
            for t in terms:
                tax_index[tax].setdefault(t, []).append(p['path'])

    now = datetime.now(timezone.utc).strftime('%Y-%m-%dT%H:%M:%SZ')

    api = {
        '_comment': 'Static site API for bots and agents. Auto-generated — do not edit.',
        'meta': {
            'generator': 'detroit-site-api/1.0',
            'generated': now,
            'base_url': BASE_URL,
            'title': 'Cash for Kids 2: A Public Record',
            'total_sections': len(sections),
            'total_pages': len(pages),
            'total_words': sum(p['word_count'] for p in pages)
                          + sum(s['word_count'] for s in sections.values()),
            'total_taxonomy_terms': sum(len(t) for t in tax_index.values()),
        },
        'endpoints': {
            'human': {
                'homepage': f'{BASE_URL}/',
                'search': 'Built-in elasticlunr full-text search in nav bar',
                'atom_feed': f'{BASE_URL}/atom.xml',
            },
            'machine': {
                'site_api': f'{BASE_URL}/api/site.json',
                'network_graph_json': f'{BASE_URL}/graph.json',
                'network_graph_csv': f'{BASE_URL}/graph.csv',
                'sitemap_xml': f'{BASE_URL}/sitemap.xml',
                'llms_index': f'{BASE_URL}/llms.txt',
                'llms_full_content': f'{BASE_URL}/llms-full.txt',
                'content_manifest': f'{BASE_URL}/content-manifest.toml',
                'robots_txt': f'{BASE_URL}/robots.txt',
            },
        },
        'epistemic_grammar': {
            'claim_levels': {
                'record': 'Verifiable public fact from a government database or official document.',
                'corroborated': 'Independently confirmed by 2+ sources.',
                'inference': 'Analytical conclusion drawn from records. Not adjudicated.',
                'allegation': 'Formally alleged in complaint. Awaiting determination.',
                'filed': 'Submitted to agency or court. Pending.',
                'adjudicated': 'Determined by court or agency.',
                'corrected': 'Previously published claim corrected.',
            },
            'principle': 'Record → Corroborated → Inference → Allegation → Filed → Adjudicated',
        },
        'sections': {k: sections[k] for k in sorted(sections)},
        'pages': sorted(pages, key=lambda p: p['path']),
        'taxonomies': {
            name: {
                term: {'pages': paths, 'count': len(paths)}
                for term, paths in sorted(terms.items())
            }
            for name, terms in sorted(tax_index.items())
        },
    }

    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT.write_text(json.dumps(api, indent=2, default=str))
    print(f'{OUTPUT}: {OUTPUT.stat().st_size:,} bytes')
    print(f'  {len(sections)} sections, {len(pages)} pages, '
          f'{api["meta"]["total_words"]:,} words')
    print(f'  {len(tax_index)} taxonomies, '
          f'{api["meta"]["total_taxonomy_terms"]} terms')


if __name__ == '__main__':
    main()
