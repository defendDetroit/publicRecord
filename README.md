# Cash for Kids 2: Operation Detroit Plantation
## Public Record — Detroit Charter School Racketeering & Institutional Capture

**This repository contains litigation documents, evidence, correspondence, and FOIA responses documenting a multi-decade racketeering enterprise operating through Detroit's charter school system, courts, and political offices.**

Everything here is public record. Clone freely. Verify everything.

```bash
git clone https://git.primals.eco/publicRecord/detroit.git
```

---

## What This Is

A single civilian — pro se, pro bono — identified and documented a RICO-pattern enterprise that spans:

- **Charter schools** receiving $4.9M+ in annual public funds, run by convicted felons
- **Captured courts** where network-connected judges preside over network-connected cases
- **Political offices** held by individuals with fabricated credentials (claimed J.D. — never bar-admitted)
- **Nonprofit shells** controlled by two convicted felons holding all officer positions
- **Financial extraction** funneling 72.67% of school revenue through a private management company

This repository is the public-facing evidence archive. Every document carries a git commit hash (SHA-256) and timestamp. The full history is immutable.

## Structure

```
filings/          Court filings, complaints, motions, federal packets
correspondence/   Letters, emails, service proof
evidence/         Documentary evidence, financial records
damages/          Damages analysis and judgment frameworks
foia/             FOIA requests and responses
timeline/         Chronological event summaries
```

## Key Documents

| Document | Description | Date |
|----------|-------------|------|
| `filings/2026-09-22_federal_master_packet.pdf` | **Unified Federal Intelligence Packet** — 79 pages, 8 agencies | Sep 2026 |
| `filings/2026-09-22_journalist_briefing_packet.pdf` | Journalist briefing — 7 investigative story angles | Sep 2026 |
| `filings/2026-09-16_complaint_chain_master.md` | Master complaint chain — all filed complaints | Sep 2026 |
| `damages/DAMAGES_ANALYSIS.md` | Per-defendant damages analysis with compounding | Sep 2026 |
| `evidence/2026-09-17_oig_supplement_proof_package.pdf` | OIG supplement — mail fraud evidence | Sep 2026 |

## Source Verification

All claims in the federal packet can be verified through public sources:

| Source | How to Access |
|--------|--------------|
| **LARA** (MI entity records) | [cofs.lara.state.mi.us](https://cofs.lara.state.mi.us) — Search entity IDs: 803294855, 803295082, 802070120 |
| **Wayne County ROD** | [waynecountylandrecords.com](https://waynecountylandrecords.com) — Doc# 2025200597, 2025201292 |
| **PACER** (federal court) | [pacer.uscourts.gov](https://pacer.uscourts.gov) — Cases: 09-46072, 14-46410, 26-47542 |
| **MI ICHAT** | [apps.michigan.gov/ichat](https://apps.michigan.gov/ichat) — SID 2029469K (Banks), 2321035P (Holland) |
| **IRS TEOS** | [apps.irs.gov/app/eos](https://apps.irs.gov/app/eos) — EIN: 33-3537910, 87-2342269, 47-2441160 |
| **TransparencyUSA** | [transparencyusa.org](https://transparencyusa.org) — Candidate: Brian Banks |
| **State Bar of Michigan** | [zeekbeek.com/SBM](https://zeekbeek.com/SBM) — Search: Brian Banks (zero results) |
| **MDOC OTIS** | [mdocweb.state.mi.us/OTIS2](https://mdocweb.state.mi.us/OTIS2) — #443789 (Holland) |

## Integrity

Every document committed carries a git commit hash and UTC timestamp. The full history is immutable — any alteration is detectable by anyone who has cloned.

```bash
git log --oneline --all    # full timeline
git diff HEAD~1            # what changed in the last commit
```

## Mirrors

| Tier | Location | Purpose |
|------|----------|---------|
| **Primary** | `git.primals.eco/publicRecord/detroit` | Self-hosted Forgejo — sovereign, no takedown vector |
| **Mirror** | GitHub (TBD) | Public visibility, issue tracking, collaboration |
| **Local** | Developer machines | Full evidence archive with heavy media |

## For Journalists and Attorneys

- Clone the entire repo to preserve the evidence chain
- Every file has a verifiable timestamp via git history
- The hosting infrastructure (`git.primals.eco`) is sovereign — self-hosted, not on any platform that can receive a takedown
- If this Forgejo instance goes down, anyone with a clone has the full record
- **All sources are public** — everything can be independently verified using the table above

## For Other Harmed Parties

If you have been affected by any individual or entity documented in this repository:
- Clone the repo for your own records
- File your own complaints using the same public sources
- Your experience is evidence — document everything

## License

All original analysis and writing: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
Court filings and public records: Public domain where applicable.
