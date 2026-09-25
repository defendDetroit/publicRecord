+++
title = "The Network"
description = "The Banks Network — documented connections spanning charter schools, courts, political offices, and nonprofit entities in Detroit."
sort_by = "weight"

[extra]
keywords = "Brian Banks network map, Detroit charter school racketeering network, Wayne County judges Brian Banks, Purpose Charter Academy connections, MacDowell Preparatory Academy board, Banks enterprise diagram"
+++

This is not one bad actor. It is a **network** — convicted felons, judges, attorneys, and institutions connected through boards, campaigns, property, and family ties.

Federal agencies are scheduled to receive the complete map on September 22, 2026.

{% mermaid(title="Network Overview — Self-Dealing & Cross-Protection") %}
graph TB
    subgraph TIER1["🔴 Tier 1 — Enterprise Principals"]
        BANKS["<b>Brian Banks</b><br/>9 convictions · fake J.D.<br/>Superintendent of both schools"]
        HOLLAND["<b>Joseph Holland Jr</b><br/>Drug conviction · MDOC #443789<br/>Co-resident · all financial roles"]
    end

    subgraph REVENUE["💰 Revenue Streams"]
        PCA["Purpose Charter Academy<br/>K-8 · DPSCD authorized"]
        MAC["MacDowell Prep Academy<br/>K-8 · $4.9M state aid"]
        STATE(("Michigan<br/>Per-Pupil<br/>Funding"))
    end

    subgraph EXTRACTION["🏦 Extraction Layer"]
        LLC["Purpose Group LLC<br/>Takes 72.67% of revenue"]
        FOUNDATION["Purpose Foundation<br/>501c3 · 2 felons all positions"]
        BSC["Banks Strategy LLC<br/>Judge campaign payments"]
    end

    subgraph JUDICIAL["⚖️ Tier 2 — Judicial Cover (9 Judges)"]
        MILLER["<b>Judge Miller</b><br/>3rd Circuit · Board Chair"]
        YANCEY["<b>Judge Yancey</b><br/>36th Dist · Board Chair"]
        A_SABREE["<b>Judge A. Sabree</b><br/>36th Dist · Metro Property"]
        AL_SABREE["<b>Judge Al. Sabree</b><br/>3rd Circuit Family"]
        S_PERKINS["<b>Judge S. Perkins</b><br/>36th Dist"]
        RAMSEY["<b>Judge Ramsey</b><br/>3rd Circuit Criminal"]
        EVANS_J["<b>Judge Evans</b><br/>Retired · 21yr mentor"]
        MORRIS["<b>Judge Morris</b><br/>Retired · book foreword"]
        D_PERKINS["<b>Judge D. Perkins</b><br/>Probate"]
    end

    subgraph POLITICAL["🏛️ Tier 3 — Political Cover"]
        GAY["Sherry Gay-Dagnogo<br/>Authorized charters · Ombudsman"]
        E_SABREE["Eric Sabree<br/>County Treasurer · FBI-probed"]
        MCKINNEY["Billy McKinney<br/>Campaign payments"]
    end

    subgraph PROFESSIONAL["📋 Tier 4 — Professional"]
        TODD["Todd Perkins<br/>Banks' attorney"]
    end

    STATE -->|"per-pupil funding"| PCA
    STATE -->|"per-pupil funding"| MAC
    PCA -->|"management fee"| LLC
    MAC -->|"72.67%"| LLC
    LLC -->|"salary + control"| BANKS
    BANKS -->|"superintendent"| PCA
    BANKS -->|"superintendent"| MAC
    BANKS -->|"president + director"| FOUNDATION
    HOLLAND -->|"secretary + treasurer"| FOUNDATION
    HOLLAND -->|"PAC treasurer"| BSC
    BSC -.->|"$383.82"| YANCEY
    MILLER -.->|"Board Chair"| PCA
    YANCEY -.->|"Board Chair"| MAC
    MILLER -.->|"Baker College colleague"| BANKS
    AL_SABREE -.->|"MSU Law 2010"| BANKS
    TODD -->|"attorney"| BANKS
    TODD -.->|"brother"| S_PERKINS
    E_SABREE -.->|"father"| A_SABREE
    E_SABREE -.->|"father"| AL_SABREE
    E_SABREE -.->|"endorser"| MILLER
    GAY -.->|"authorized charters"| PCA
    GAY -.->|"CBC honoree"| BANKS

    classDef tier1 fill:#991b1b,stroke:#ef4444,color:#fecaca
    classDef revenue fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe
    classDef extraction fill:#713f12,stroke:#f59e0b,color:#fef3c7
    classDef judicial fill:#312e81,stroke:#818cf8,color:#c7d2fe
    classDef political fill:#14532d,stroke:#4ade80,color:#bbf7d0
    classDef professional fill:#44403c,stroke:#a8a29e,color:#e7e5e4
    classDef state fill:#0f766e,stroke:#2dd4bf,color:#ccfbf1

    class BANKS,HOLLAND tier1
    class PCA,MAC revenue
    class STATE state
    class LLC,FOUNDATION,BSC extraction
    class MILLER,YANCEY,A_SABREE,AL_SABREE,S_PERKINS,RAMSEY,EVANS_J,MORRIS,D_PERKINS judicial
    class GAY,E_SABREE,MCKINNEY political
    class TODD professional
{% end %}

## Self-Dealing Feedback Loop

{% mermaid(title="Self-Dealing Loop — How Public Money Becomes Private Power") %}
graph LR
    A(("🏫 State of Michigan<br/>Per-Pupil Funding")) -->|"$4.9M+/yr"| B["PCA + MacDowell<br/>(charter schools)"]
    B -->|"72.67%"| C["Purpose Group LLC<br/>(Banks = sole member)"]
    C -->|"salary + expenses"| D["Brian Banks<br/>(9 convictions)"]
    D -->|"consulting payments"| E["Banks Strategy LLC"]
    E -->|"$383.82 to Yancey<br/>$8K+ Inner Link"| F["Judges &<br/>Campaign Vendors"]
    F -->|"board seats +<br/>favorable rulings"| B
    D -->|"CBC events +<br/>campaign donations"| G["Political<br/>Allies"]
    G -->|"charter<br/>authorization"| B

    style A fill:#0f766e,stroke:#2dd4bf,color:#ccfbf1
    style B fill:#1e3a5f,stroke:#60a5fa,color:#bfdbfe
    style C fill:#713f12,stroke:#f59e0b,color:#fef3c7
    style D fill:#991b1b,stroke:#ef4444,color:#fecaca
    style E fill:#713f12,stroke:#f59e0b,color:#fef3c7
    style F fill:#312e81,stroke:#818cf8,color:#c7d2fe
    style G fill:#14532d,stroke:#4ade80,color:#bbf7d0
{% end %}

The loop closes: public dollars → school → LLC → Banks → campaign payments → judges + politicians → charter authorization → more public dollars. No external oversight breaks the circle because each regulator sees only one segment.

## Tiers

- **[Enterprise Principals](/network/actors/)** — Banks and Holland
- **[Judicial Cover](/network/judges/)** — 9 judges across 4 courts
- **[Political Enablers](/network/political/)** — Gay-Dagnogo, Eric Sabree, McKinney
- **[Entities](/network/entities/)** — 9+ LLCs, nonprofits, PACs, and schools
- **[Professional Enablers](/network/professional-enablers/)** — Attorneys who organized the shell structure
- **[Pattern Analysis](/analysis/)** — RICO pattern, institutional capture, allied cases, CBC events

---

*Every connection in this network is documented from public records. See [Verify Everything](/validate/) for source links.*
