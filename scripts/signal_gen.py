#!/usr/bin/env python3
"""
Signal receptor — classifies site traffic into four categories.

GUIDE:      Known crawlers (Googlebot, Bingbot, ClaudeBot...) — welcome, indexed
CATALOG:    Bots & scrapers (SEO tools, link checkers) — tracked, not human
NEUTRALIZE: Scanners & intruders (probe paths, empty UA, old OS spoof) — blocked
SIGNAL:     Humans — the actual readers we measure

Input: Caddy JSON access logs on stdin
Output: JavaScript window.SIGNAL_EXPLORATION with classified data

Privacy: No IP addresses. No cookies. No tracking. Aggregated patterns only.
"""

import json, sys, datetime, re
from collections import Counter

# ── Classification rules ──

# Known crawlers — welcome, guide via robots.txt/sitemap
CRAWLERS = [
    "googlebot", "bingbot", "yandexbot", "baiduspider", "sogou",
    "duckduckbot", "seznambot", "ia_archiver",
]

# AI crawlers — welcome, guide via llms.txt
AI_CRAWLERS = [
    "claudebot", "gptbot", "chatgpt-user", "oai-searchbot",
    "amazonbot", "google-extended", "ccbot", "applebot-extended",
    "meta-externalagent", "cohere-ai", "bytespider", "diffbot",
    "ai2bot", "perplexitybot", "reflectionbot", "youbot",
]

# SEO / analytics crawlers — catalog, not human
SEO_BOTS = [
    "semrush", "ahref", "mj12bot", "dotbot", "petalbot",
    "dataforseo", "barkrowler", "censysinspect", "link_checker",
    "screaming frog", "rogerbot", "blexbot",
]

# Link preview bots — sharing signal (someone shared the URL)
LINK_PREVIEW = [
    "facebookexternalhit", "twitterbot", "linkedinbot",
    "skypeuripreview", "slackbot", "discordbot", "telegrambot",
    "whatsapp", "viber",
]

# Scanner signatures — in UA string
SCANNER_UA = [
    "python", "curl", "wget", "go-http", "java/", "php/",
    "headless", "powershell", "aiohttp", "httpx", "requests",
    "scrapy", "mechanize", "libwww", "lwp-trivial",
    "nikto", "nessus", "nmap", "masscan", "zgrab", "nuclei",
    "wpscan", "sqlmap", "dirbuster", "gobuster", "ffuf",
]

# iOS link preview (NetworkingExtension) — sharing signal
IOS_PREVIEW_RE = re.compile(r"networkingextension", re.I)

# Old/spoofed OS signatures that are almost always scanners
SPOOFED_OS = [
    "android 4.", "android 5.", "android 6.",
    "windows nt 5.", "windows nt 6.0", "windows nt 6.1",
    "iphone os 13_2_3",
]

# Probe paths — these are NEVER real humans
PROBE_SIGS = [
    ".env", ".git/", ".svn/", ".hg/",
    "wp-admin", "wp-login", "wp-content", "wp-includes", "xmlrpc.php",
    ".php",
    "phpmyadmin", "pma/", "adminer",
    "/admin/", "/administrator/",
    "/.aws", "/.s3", "/secrets", "/.ssh", "/.docker",
    "/debug/", "/debug.", "/trace",
    "/config.js", "/config.json", "/config.yml",
    "cgi-bin", "/shell", "/cmd", "eval-stdin",
    "/backup", "/db.", "/database",
    "/api/.env", "/backend/.env",
]

# Asset extensions — not page views
ASSET_EXT = [
    ".css", ".js", ".svg", ".png", ".jpg", ".jpeg", ".gif", ".webp",
    ".woff", ".woff2", ".ttf", ".eot",
    ".ico", ".xml", ".json", ".txt", ".atom", ".rss",
    ".map", ".br", ".gz",
]


def classify_ua(ua_raw):
    """Classify a User-Agent string. Returns (category, detail)."""
    ua = ua_raw.lower().strip()

    if not ua or len(ua) < 5:
        return ("scanner", "empty-ua")

    for sig in CRAWLERS:
        if sig in ua:
            return ("crawler", sig)
    for sig in AI_CRAWLERS:
        if sig in ua:
            return ("ai-crawler", sig)
    for sig in SEO_BOTS:
        if sig in ua:
            return ("seo-bot", sig)
    for sig in LINK_PREVIEW:
        if sig in ua:
            return ("link-preview", sig)

    if IOS_PREVIEW_RE.search(ua):
        return ("link-preview", "ios-preview")

    for sig in SCANNER_UA:
        if sig in ua:
            return ("scanner", sig)

    # UA that IS a URL = scanner
    if ua.startswith("http://") or ua.startswith("https://"):
        return ("scanner", "url-as-ua")

    for sig in SPOOFED_OS:
        if sig in ua:
            return ("scanner", "spoofed-os")

    return ("human", "browser")


def is_probe_path(uri):
    """Check if a URI is a vulnerability probe."""
    uri_lower = uri.lower()
    for sig in PROBE_SIGS:
        if sig in uri_lower:
            return True
    # Hidden files (but not the homepage)
    if uri_lower.startswith("/.") and uri_lower != "/":
        return True
    return False


def is_asset(uri):
    """Check if a URI is a static asset."""
    uri_lower = uri.lower().split("?")[0]
    if any(uri_lower.endswith(ext) for ext in ASSET_EXT):
        return True
    if "/elasticlunr" in uri_lower or "/search_index" in uri_lower:
        return True
    return False


def short(path):
    """Create a short display label from a URL path."""
    parts = path.strip("/").split("/")
    if len(parts) == 0 or path == "/":
        return "Home"
    if len(parts) == 1:
        return parts[0].replace("-", " ").title()
    last = parts[-1].replace("-", " ").title()
    return last if len(last) < 30 else last[:27] + "..."


def main():
    # Accumulators
    human_pages = {}
    human_entries = {}
    human_hops = {}
    human_hourly = {}
    human_daily = {}
    external_refs = {}

    # Ecosystem counters
    eco_crawlers = Counter()
    eco_ai = Counter()
    eco_seo = Counter()
    eco_preview = Counter()
    eco_scanners = Counter()
    eco_probes = Counter()
    eco_human_ua = Counter()

    total_lines = 0
    total_detroit = 0

    for line in sys.stdin:
        if "detroit.primals.eco" not in line:
            continue
        total_lines += 1
        try:
            obj = json.loads(line)
        except:
            continue

        host = obj.get("request", {}).get("host", "")
        if "detroit" not in host:
            continue
        total_detroit += 1

        hdrs = obj.get("request", {}).get("headers", {})
        uah = hdrs.get("User-Agent", hdrs.get("user-agent", [""]))
        ua_raw = uah[0] if isinstance(uah, list) and uah else str(uah)
        uri = obj.get("request", {}).get("uri", "").split("?")[0].rstrip("/") or "/"
        status = obj.get("status", 0)
        ts = obj.get("ts", 0)
        refs = hdrs.get("Referer", hdrs.get("referer", [""]))
        referer = refs[0] if isinstance(refs, list) and refs else str(refs)

        # Classify
        category, detail = classify_ua(ua_raw)

        # Probe path overrides — even "human" UA hitting .env is a scanner
        if is_probe_path(uri):
            eco_probes[uri] += 1
            if category == "human":
                category = "scanner"
                detail = "probe-path"

        # Count into ecosystem
        if category == "crawler":
            eco_crawlers[detail] += 1
        elif category == "ai-crawler":
            eco_ai[detail] += 1
        elif category == "seo-bot":
            eco_seo[detail] += 1
        elif category == "link-preview":
            eco_preview[detail] += 1
        elif category == "scanner":
            eco_scanners[detail] += 1
        elif category == "human":
            eco_human_ua[ua_raw[:80]] += 1

        # Only count humans for signal data
        if category != "human":
            continue

        # Skip assets
        if is_asset(uri):
            continue

        # Skip non-success
        if status < 200 or status >= 400:
            continue

        # Count page hit
        human_pages[uri] = human_pages.get(uri, 0) + 1

        # Time bucketing
        try:
            dt = datetime.datetime.utcfromtimestamp(ts)
            day = dt.strftime("%Y-%m-%d")
            hour = dt.strftime("%Y-%m-%d %H")
            human_daily[day] = human_daily.get(day, 0) + 1
            human_hourly[hour] = human_hourly.get(hour, 0) + 1
        except:
            pass

        # Hop tracking via Referer
        if referer and "detroit.primals.eco" in referer:
            ref_path = "/" + "/".join(referer.split("detroit.primals.eco/")[1:])
            ref_path = ref_path.split("?")[0].rstrip("/") or "/"
            if ref_path != uri:
                key = ref_path + "|||" + uri
                human_hops[key] = human_hops.get(key, 0) + 1
        elif referer and referer.startswith("http"):
            try:
                domain = referer.split("/")[2]
                external_refs[domain] = external_refs.get(domain, 0) + 1
            except:
                pass
            human_entries[uri] = human_entries.get(uri, 0) + 1
        else:
            human_entries[uri] = human_entries.get(uri, 0) + 1

    # ── Output JavaScript ──
    now_str = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    out = []
    out.append("// Signal exploration data — auto-generated from receptor logs")
    out.append("// Generated: " + now_str)
    out.append("// Classification: human/crawler/ai-crawler/seo-bot/link-preview/scanner")
    out.append("// No IP addresses. No identifying data. Aggregated patterns only.")
    out.append("")
    out.append("(function() {")
    out.append("  window.SIGNAL_EXPLORATION = {")
    out.append('    generated: "' + now_str + '",')

    # Human pages
    out.append("    pages: [")
    for p, c in sorted(human_pages.items(), key=lambda x: -x[1])[:40]:
        label = short(p).replace('"', "'")
        entry_count = human_entries.get(p, 0)
        out.append('      { path: "' + p + '", label: "' + label + '", hits: ' + str(c) + ', entries: ' + str(entry_count) + ' },')
    out.append("    ],")

    # Human hops
    out.append("    hops: [")
    for key, c in sorted(human_hops.items(), key=lambda x: -x[1])[:50]:
        f, t = key.split("|||")
        out.append('      { from: "' + f + '", to: "' + t + '", count: ' + str(c) + ' },')
    out.append("    ],")

    # Daily
    out.append("    daily: [")
    for d in sorted(human_daily.keys()):
        out.append('      { date: "' + d + '", hits: ' + str(human_daily[d]) + ' },')
    out.append("    ],")

    # Hourly
    out.append("    hourly: [")
    for h in sorted(human_hourly.keys())[-48:]:
        out.append('      { hour: "' + h + '", hits: ' + str(human_hourly[h]) + ' },')
    out.append("    ],")

    # External referrers
    out.append("    referrers: [")
    for r, c in sorted(external_refs.items(), key=lambda x: -x[1])[:10]:
        out.append('      { domain: "' + r.replace('"', "'") + '", count: ' + str(c) + ' },')
    out.append("    ],")

    # Bot ecosystem
    out.append("    ecosystem: {")

    out.append("      crawlers: [")
    for name, c in eco_crawlers.most_common(10):
        out.append('        { name: "' + name + '", hits: ' + str(c) + ' },')
    out.append("      ],")

    out.append("      aiCrawlers: [")
    for name, c in eco_ai.most_common(10):
        out.append('        { name: "' + name + '", hits: ' + str(c) + ' },')
    out.append("      ],")

    out.append("      seoBots: [")
    for name, c in eco_seo.most_common(10):
        out.append('        { name: "' + name + '", hits: ' + str(c) + ' },')
    out.append("      ],")

    out.append("      linkPreviews: [")
    for name, c in eco_preview.most_common(10):
        out.append('        { name: "' + name + '", hits: ' + str(c) + ' },')
    out.append("      ],")

    out.append("      scanners: [")
    for name, c in eco_scanners.most_common(15):
        out.append('        { name: "' + name.replace('"', "'") + '", hits: ' + str(c) + ' },')
    out.append("      ],")

    out.append("      probes: [")
    for path, c in eco_probes.most_common(15):
        out.append('        { path: "' + path.replace('"', "'") + '", hits: ' + str(c) + ' },')
    out.append("      ],")

    out.append("    },")

    # Summary
    total_human = sum(human_pages.values())
    total_hops = sum(human_hops.values())
    total_entries = sum(human_entries.values())
    total_crawl = sum(eco_crawlers.values()) + sum(eco_ai.values())
    total_scan = sum(eco_scanners.values())
    total_preview = sum(eco_preview.values())
    total_seo = sum(eco_seo.values())
    total_probes = sum(eco_probes.values())

    out.append("    summary: {")
    out.append("      humanHits: " + str(total_human) + ",")
    out.append("      totalHops: " + str(total_hops) + ",")
    out.append("      totalEntries: " + str(total_entries) + ",")
    out.append("      uniquePages: " + str(len(human_pages)) + ",")
    out.append("      days: " + str(len(human_daily)) + ",")
    out.append("      crawlerHits: " + str(total_crawl) + ",")
    out.append("      seoHits: " + str(total_seo) + ",")
    out.append("      previewHits: " + str(total_preview) + ",")
    out.append("      scannerHits: " + str(total_scan) + ",")
    out.append("      probeHits: " + str(total_probes) + ",")
    out.append("      totalRequests: " + str(total_detroit) + "")
    out.append("    }")
    out.append("  };")
    out.append("})();")
    print("\n".join(out))


if __name__ == "__main__":
    main()
