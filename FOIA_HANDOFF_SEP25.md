# FOIA Data Handoff — detroit.primals.eco Publishing Team
## Date: September 25, 2026
## Priority: HIGH — First FOIA response received and fully parsed

---

## WHAT ARRIVED TODAY

Michigan Department of Education responded to Kevin Mok's FOIA request (filed Sep 21, received Sep 22, responded Sep 25). **20 files, fully parsed and committed.**

This is Layer 2 evidence. It confirms and deepens everything we built from OSINT (Layer 1). Key revelation: MDE investigated Banks for having no credential in Feb 2022, gave the school a loophole to avoid penalties, and the school exploited it — then made Banks the sole manager 4 months later.

---

## FILES TO HOST / PUBLISH

All source files are in `bluegate-tenancy/02-evidence/mde-foia-sep25/`. Here's what needs to go live:

### Tier 1 — Publish immediately (smoking guns)

| File | What It Is | Why It Matters |
|------|-----------|---------------|
| `MSG_PARSED_EMAILS_SEP25.md` | Parsed email chain — the 2hr 24min cover-up | Entire investigation opened and closed on a single morning |
| `investigation/Investigation Letter for Banks.pdf` | Formal MDE letter to Board President | Government proof Banks had no credential Feb 2022 |
| `investigation/MOECS Admin Permit Hold for Banks.png` | Screenshot — App #590606, Status: HOLD | His permit was never approved |
| `investigation/REP for Banks.png` | Screenshot — Credential column BLANK | No permits on record |
| `investigation/EEM for Banks.png` | Entity contact record — Wells-Stallworth as Board Pres | Confirms who received the investigation |
| `MDE_FOIA_RESPONSE_SEP25.pdf` | Official MDE response letter | Provenance — shows this is government-released |

### Tier 2 — Publish with analysis (financial)

| File | What It Is | Notes |
|------|-----------|-------|
| `audits/82747fs - 2025.pdf` | Most recent audit — FY2025 | $968K loss, $667K school admin, $719K balloon |
| `audits/82747fs - 2024.pdf` | FY2024 audit | Includes federal awards supplement, budget violations |
| `audits/82747 FS - 2023.pdf` | FY2023 audit | O&M $1.7M on $587K budget — the building purchase year |
| `audits/82747 FS - 2022.pdf` | FY2022 audit | Last year before "self-managed" |
| `audits/82747 FS - 2017.pdf` through `2021.pdf` | FY2017–2021 audits | Full 9-year comparison baseline |

### Tier 3 — Publish with context

| File | What It Is | Notes |
|------|-----------|-------|
| `Purpose_Group_ManagementAgreement.pdf` | Original scanned PDF (17 pages) | PCA ↔ Purpose Group contract |
| `Purpose_Group_ManagementAgreement_OCR.txt` | Full OCR text extraction | Searchable version for reporters |
| `MDE_FOIA_ANALYSIS_SEP25.md` | Kevin's braided analysis document | OSINT ↔ FOIA cross-reference |
| `Denial_Section_10.pdf` | FOIA statute excerpt | Standard — included for completeness |
| `investigation/Educator Report Form for Banks.pdf` | Blank educator compliance form | Template MDE uses |
| `investigation/Investigation Letter for Banks.docx` | Word version of investigation letter | Editable source |
| `cleared/` directory (.msg files) | Raw Outlook emails | Parsed content in MSG_PARSED_EMAILS_SEP25.md |

---

## UPDATED SITE CONTENT (already committed to publicRecord-detroit)

These files were updated with FOIA-confirmed data — pull from `main`:

| File | What Changed |
|------|-------------|
| `actors/banks-brian/PROFILE.md` | PIC 287338, SSN partial, MOECS HOLD, full investigation timeline, MDE personnel |
| `entities/macdowell-prep/PROFILE.md` | Entity #82747, 9yr financials, charter dates, budget violations, self-management note, cover-up sequence |
| `entities/purpose-charter-academy/PROFILE.md` | Full management agreement analysis — 10% fee + cost reimbursement, "No Related Parties" violation |
| `actors/NETWORK_MAP.md` | +8 FOIA-revealed actors (Tier 7), institutional tier updated, 25+ total actors |
| `site/static/js/network-graph.js` | +4 nodes (Wells-Stallworth, MDE, Schmiedeknecht, Alan Young), +7 links, institutional color |

---

## NEW ACTORS FOR SITE PROFILES (need pages created)

| Actor | Role | Priority |
|-------|------|----------|
| **Nicole Wells-Stallworth** | MacDowell Board President since 2014 | HIGH — central to cover-up |
| **Gregory M. Meihn** | Partner, Foley & Mansfield PLLP, Ferndale MI | HIGH — retained within 14 min of investigation |
| **Katie Schmiedeknecht** | MDE Analyst, OEE | MEDIUM — gave the loophole |
| **Leah Breen** | MDE official | MEDIUM — first to flag non-compliance |
| **Reginald B. Scott II** | Unknown prior role — removed from MOECS | LOW — needs more research |
| **Alexandria Daniels** | MacDowell staff | LOW — CC'd on emails |
| **Alan C. Young & Associates** | Auditor, 9 consecutive years | MEDIUM — institutional enabler question |

---

## GRAPH / VISUALIZATION PRIORITIES

1. **Credential fraud timeline** — visual timeline from Feb 2022 investigation → Sep 2022 certificate. The 2hr 24min morning and the 7-month gap are the story.

2. **Financial dashboard** — 9-year revenue/expenditure trend, fund balance trajectory, admin overhead pie chart. Data is in the audits and `MDE_FOIA_ANALYSIS_SEP25.md`.

3. **Network graph update** — the JS graph has the new nodes but the site page content needs the FOIA layer toggle. Existing graph at `site/static/js/network-graph.js`.

4. **Email chain as narrative** — the morning of Feb 28, 2022 reads like a screenplay. Consider a timestamped visual.

---

## HOSTING NOTES

The raw FOIA PDFs, investigation images, and parsed analysis should be hosted as **primary source documents** — this is the "be your own Google Drive" concept. Reporters, attorneys, and the court can reference these directly at stable URLs rather than depending on third-party hosting.

Suggested URL structure:
```
detroit.primals.eco/evidence/mde-foia-sep25/
  ├── response-letter.pdf
  ├── investigation-letter.pdf
  ├── moecs-hold.png
  ├── rep-blank.png
  ├── eem-entity.png
  ├── email-chain.html (formatted from MSG_PARSED)
  ├── audits/
  │   ├── fy2017.pdf through fy2025.pdf
  ├── management-agreement.pdf
  ├── management-agreement-ocr.txt
  └── analysis.html (from MDE_FOIA_ANALYSIS)
```

---

## NEXT FOIA WAVES (drafts in bluegate-tenancy)

See `bluegate-tenancy/01-case/filing-ready/FOIA_WAVE2_PROFILES_SEP25.md` for full draft requests targeting:
- CEPI/DTMB (academic data — file now)
- MacDowell direct (board minutes, employment contracts — file now)
- PCA direct (board minutes, management agreement, background checks — file now)
- MDE Round 2 (FY2026 audit — after Nov 1)
- Michigan AG, Wayne County Prosecutor (as capacity allows)

---

*Handoff prepared Sep 25, 2026. All files committed and pushed to GitHub.*
*bluegate-tenancy: `6dae747` | publicRecord-detroit: `af74438`*
