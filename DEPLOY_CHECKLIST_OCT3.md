# DEPLOYMENT CHECKLIST — detroit.primals.eco
# Target: Live by weekend (Oct 3-4, 2026)
# "Holland and Banks deserve no cover — they run a public school"

---

## UPDATED PAGES (content changes ready)

### Actor Profiles
- [x] `/network/actors/brian-banks/` — UPDATED Sep 30
  - Credential chain table (MSU J.D. real, no bar, bar prep fraud, Walden no IRB)
  - Sep 29 email admissions (6 party admissions, "double doctor," "law degree")
  - Defamation of Dr. Charles Mok section
  - Updated date: 2026-09-30
- [x] `/network/actors/joseph-holland/` — UPDATED Sep 30
  - 20-year partnership timeline (2005-2026)
  - Bankruptcy concealment (18 U.S.C. § 152) with BK1 vs BK3 comparison
  - Trust successor role
  - Property chain (Newcastle + Severn)
  - Named defendant in 2026-4349-CZ
  - Updated date: 2026-09-30

### New Analysis Pages
- [x] `/analysis/banks-holland-partnership/` — NEW Sep 30
  - Full economic unit documentation
  - Property chain with Wayne ROD instrument numbers
  - BK concealment side-by-side
  - Trust structure diagram
  - Entity structure with roles
  - Section 5.2 management agreement violation
  - Verify links for every claim

### Existing Pages (already current)
- [x] `/analysis/credential-audit/` — Staff audit (Sep 26)
- [x] `/evidence/` — Evidence library with MDE FOIA (Sep 25)
- [x] All judge pages (9 judges documented)
- [x] All entity pages (13 entities documented)
- [x] Books section (BMF + It Had 2 Happen)

---

## EVIDENCE FILES TO HOST

These files need to be copied to `site/static/evidence/` for direct download:

### Proof Packet (proof-packet-sep30/)
```
static/evidence/proof-packet/
├── 01_MDOC_HOLLAND_443789.png
├── 02_LARA_PURPOSE_FOUNDATION_ARTICLES.pdf
├── 02b_LARA_PURPOSE_FOUNDATION_ENTITY.png
├── 02c_LARA_PURPOSE_FOUNDATION_ANNUAL_2026.pdf
├── 03_LARA_PURPOSE_GROUP_ARTICLES.pdf
├── 04_WAYNE_ROD_1968_SEVERN_PROPERTY.pdf
├── 05a_WAYNE_ROD_NEWCASTLE_QCD_2007402847.pdf
├── 05b_WAYNE_ROD_SEVERN_TRUST_QCD_2024.pdf
├── 05c_WAYNE_ROD_TRUST_CERTIFICATE_HOLLAND.pdf
├── 05d_WAYNE_ROD_TAX_LIEN_NEWCASTLE_BANKS.pdf
├── 06a_SOS_PAC_COMMITTEE.png
├── 06b_SOS_PAC_LATE_FEES.png
├── 06c_SOS_PAC_MEMBERS.png
├── 06d_SOS_PAC_FILINGS.png
├── 10_ICHAT_HOLLAND_FULL.pdf
├── 10b_ICHAT_HOLLAND_SEARCH.png
├── 10c_ICHAT_HOLLAND_RECORD.png
├── 11_REGAN_V_BANKS_SOS_COMPLAINT.pdf
```

### MDE FOIA (already partially hosted — verify)
```
static/evidence/mde-foia-sep25/
├── investigation/
│   ├── investigation-letter.pdf
│   ├── moecs-hold.png
│   ├── rep-blank.png
│   ├── eem-entity.png
│   └── educator-report-form.pdf
├── audits/
│   ├── fy2017.pdf through fy2025.pdf (9 files)
└── management-agreement.pdf
```

---

## WHAT NOT TO PUBLISH

- ❌ Kevin Mok's personal emails (content only, not forwarded)
- ❌ DaSean's custody case details (26-108221-DC is private family court)
- ❌ Smith family personal information
- ❌ Children's names or identifying information
- ❌ Rita Williams personal relationship (Clutch Justice articles ARE public)
- ❌ Banks ICHAT screenshot (not yet pulled — $10)

---

## BUILD & DEPLOY STEPS

```bash
# 1. Copy evidence files to static/
cp -r proof-packet-sep30/ publicRecord-detroit/site/static/evidence/proof-packet/

# 2. Build site
cd publicRecord-detroit/site
zola build

# 3. Verify locally
zola serve --port 1111

# 4. Push to git
cd ../..
git add publicRecord-detroit/
git commit -m "Sep 30: Banks-Holland partnership, credential chain, BK fraud, proof packet"
git push

# 5. Deploy
# (deployment method depends on hosting — Cloudflare Pages / Netlify / manual)
```

---

## EDITORIAL STANDARDS

Every statement on the site follows these rules:

1. **Public records only** — every fact cited from government databases, court filings, or FOIA responses
2. **Verify links** — every claim has a "Verify" section telling the reader exactly where to check
3. **No speculation** — "documented facts" vs "submitted for agency determination"
4. **Confidence levels** — `{{ confidence(level="verified") }}` for government records, `{{ confidence(level="documented") }}` for cross-referenced sources
5. **No personal relationships** — only professional and financial connections
6. **This is a public school** — Banks and Holland run institutions funded with public money, serving Detroit children. The public has a right to know.

---

## WEEKEND TARGETS

| Day | Action |
|-----|--------|
| **Wed Sep 30** | Content updates committed. Proof packet evidence staged. |
| **Thu Oct 1** | Copy evidence files to static/. Test build. Verify all links. |
| **Fri Oct 2** | Final review. Push to production. Banks retraction deadline same day. |
| **Sat Oct 3** | Site live with full Banks-Holland partnership documentation. |
