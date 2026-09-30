"""
Stage evidence files from proof-packet-sep30 into the site static directory.
Run: python stage_evidence.py

Copies public-record evidence (no personal emails, no custody docs)
into site/static/evidence/proof-packet/ for web hosting.
"""
import shutil
import os

PROOF_PACKET = r"C:\Users\mokke\Documents\cases\evidence\proof-packet-sep30"
SITE_EVIDENCE = os.path.join(os.path.dirname(__file__), "site", "static", "evidence", "proof-packet")

SAFE_FILES = [
    "01_MDOC_HOLLAND_443789.png",
    "02_LARA_PURPOSE_FOUNDATION_ARTICLES.pdf",
    "02b_LARA_PURPOSE_FOUNDATION_ENTITY.png",
    "02c_LARA_PURPOSE_FOUNDATION_ANNUAL_2026.pdf",
    "03_LARA_PURPOSE_GROUP_ARTICLES.pdf",
    "04_WAYNE_ROD_1968_SEVERN_PROPERTY.pdf",
    "05a_WAYNE_ROD_NEWCASTLE_QCD_2007402847.pdf",
    "05b_WAYNE_ROD_SEVERN_TRUST_QCD_2024.pdf",
    "05c_WAYNE_ROD_TRUST_CERTIFICATE_HOLLAND.pdf",
    "05d_WAYNE_ROD_TAX_LIEN_NEWCASTLE_BANKS.pdf",
    "06a_SOS_PAC_COMMITTEE.png",
    "06b_SOS_PAC_LATE_FEES.png",
    "06c_SOS_PAC_MEMBERS.png",
    "06d_SOS_PAC_FILINGS.png",
    "10_ICHAT_HOLLAND_FULL.pdf",
    "10b_ICHAT_HOLLAND_SEARCH.png",
    "10c_ICHAT_HOLLAND_RECORD.png",
    "11_REGAN_V_BANKS_SOS_COMPLAINT.pdf",
]

EXCLUDE = [
    "08_BANKS_CRIMINAL_HISTORY_ICHAT_DATA.md",
    "09a_MDE_INVESTIGATION_LETTER.pdf",
    "09b_MDE_MOECS_PERMIT_HOLD.png",
    "09c_MDE_REP_BLANK_CREDENTIAL.png",
    "09d_MDE_EEM_BANKS.png",
    "09e_MDE_EDUCATOR_REPORT.pdf",
    "banksDeamndPCA.pdf",
    "mokBanksPPO.pdf",
    "parentageConfessions03.pdf",
]

def main():
    os.makedirs(SITE_EVIDENCE, exist_ok=True)

    copied = 0
    skipped = 0

    for fname in SAFE_FILES:
        src = os.path.join(PROOF_PACKET, fname)
        dst = os.path.join(SITE_EVIDENCE, fname)
        if os.path.exists(src):
            shutil.copy2(src, dst)
            size_kb = os.path.getsize(dst) / 1024
            print(f"  COPIED: {fname} ({size_kb:.0f} KB)")
            copied += 1
        else:
            print(f"  MISSING: {fname}")
            skipped += 1

    print(f"\n  Staged: {copied} files")
    if skipped:
        print(f"  Missing: {skipped} files")
    print(f"  Target: {SITE_EVIDENCE}")

    total_kb = sum(
        os.path.getsize(os.path.join(SITE_EVIDENCE, f))
        for f in os.listdir(SITE_EVIDENCE)
        if os.path.isfile(os.path.join(SITE_EVIDENCE, f))
    )
    print(f"  Total size: {total_kb/1024:.1f} MB")

if __name__ == "__main__":
    main()
