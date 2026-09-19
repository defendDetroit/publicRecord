# Detroit Charter School Racketeering — Public Record

**This repository contains litigation documents, evidence, correspondence, and FOIA responses related to racketeering and institutional capture in Detroit's charter school system.**

Everything here is public record. Clone freely. Verify everything.

```bash
git clone https://git.primals.eco/publicRecord/detroit.git
```

## Structure

```
filings/          Court filings, complaints, motions
correspondence/   Letters, emails, agent communications
evidence/         Documentary evidence, financial records, organizational charts
foia/             FOIA requests and responses
timeline/         Chronological event summaries
```

## Integrity

Every document committed to this repository carries a git commit hash (SHA-256) and timestamp. The full history is immutable — any attempt to alter past entries is detectable by anyone who has cloned the repo.

To verify integrity after cloning:
```bash
git log --oneline --all    # full timeline
git verify-commit HEAD     # signature verification (when signed)
```

## License

All original analysis and writing: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
Court filings and public records: Public domain where applicable.

## For Journalists and Attorneys

- Clone the entire repo to preserve the evidence chain
- Every file has a verifiable timestamp via git history
- The hosting infrastructure (`git.primals.eco`) is sovereign — self-hosted, not on any platform that can receive a takedown
- If this Forgejo instance goes down, anyone with a clone has the full record

## Contact

See correspondence/ for contact methods.
