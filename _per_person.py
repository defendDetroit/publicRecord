import json, os, time

gpath = os.path.join('site', 'static', 'graph.json')
with open(gpath, 'r', encoding='utf-8') as f:
    G = json.load(f)
nodes = G['nodes']
edges = G['edges']
existing_ids = {n['id'] for n in nodes}

POP = 335_000_000

new_nodes = [
    # === HUB ===
    {"id":"per_person_hub",
     "label":"Per Person Math \u2014 335M Americans. Every dollar in, every dollar out. Where does YOUR share go?",
     "class":"per_person_hub",
     "tags":["per-person","tax","revenue","spending","debt","stock-market","pension","math"],
     "tier":1,
     "description":"335 million Americans. $4.9 trillion federal revenue. $6.7 trillion federal spending. $35 trillion national debt. Per person: you earn, you pay, you expect services. The math shows where every dollar goes. Spoiler: it doesn't go where you think. The stock market eats the meat. The pension is an IOU. Social Security is a depleting tank. And you're paying for the spam."},

    # === FEDERAL BUDGET PER PERSON ===
    {"id":"pp_federal_revenue",
     "label":"Federal Revenue: ~$4.9T/yr = $14,627 per person. That is what you FUND.",
     "class":"per_person_tax",
     "tags":["per-person","federal","revenue","tax","income","payroll"],
     "tier":1,
     "description":"Total federal revenue ~$4.9 trillion/yr. Per person (335M): $14,627. Sources: Individual income tax: ~$2.6T ($7,761/person). Payroll tax (SS + Medicare): ~$1.7T ($5,075/person). Corporate tax: ~$500B ($1,493/person). Excise/customs/other: ~$100B ($299/person). You pay $14,627 per year into the federal system. Every man, woman, child. Including the baby born today. Including the 90-year-old. $14,627 average. That is the input."},

    {"id":"pp_federal_spending",
     "label":"Federal Spending: ~$6.7T/yr = $20,000 per person. That is MORE than you paid. The deficit is $5,373/person.",
     "class":"per_person_spend",
     "tags":["per-person","federal","spending","deficit","debt","per-year"],
     "tier":1,
     "description":"Total federal spending ~$6.7 trillion/yr. Per person: $20,000. You paid $14,627. The government spent $20,000 IN YOUR NAME. Deficit: $1.8T/yr = $5,373 per person per year. Added to debt. Every year. Where does $20,000/person go? Social Security: $4,179. Medicare/Medicaid: $4,776. Defense: $2,687. Interest on debt: $2,687. Other discretionary: $5,672. You paid $14,627. They spent $20,000. The missing $5,373 is borrowed. In your name. Every year."},

    {"id":"pp_national_debt",
     "label":"National Debt: ~$35T = $104,478 per person. Every baby born owes $104K. Before their first breath.",
     "class":"per_person_debt",
     "tags":["per-person","national-debt","35-trillion","baby","born","owe"],
     "tier":1,
     "description":"National debt: ~$35 trillion. Per person: $104,478. Per household (~131M): $267,176. Every baby born in the United States inherits $104,478 in debt before their first breath. The debt grows by ~$5,373 per person per year (the deficit). At current trajectory: the debt is mathematically unpayable. The interest alone: ~$900B/yr = $2,687 per person per year. You pay $2,687/yr just on INTEREST. Not reducing the principal. Just servicing the debt. Like a credit card minimum payment on $104K. Per person."},

    # === SOCIAL SECURITY: THE EMPTY TANK ===
    {"id":"pp_social_security",
     "label":"Social Security Trust Fund: ~$2.7T. But it's Treasury bonds = government IOUs to itself. The tank is paper.",
     "class":"per_person_ss",
     "tags":["social-security","trust-fund","iou","treasury","bonds","empty","depleting"],
     "tier":1,
     "description":"Social Security Trust Fund: ~$2.7 trillion. Sounds secure. But: the 'fund' is Treasury bonds. The government collected your payroll tax, spent it on other things, and gave the trust fund an IOU. The trust fund is a filing cabinet of IOUs from one part of the government to another. There is no pile of cash. No investments. No stocks. No bonds from other entities. Just: the government promising to pay itself back. With what? Future tax revenue. From whom? You. The tank is full of paper promises. Depletion projected: 2033\u20132035. After that: can only pay ~77\u201380% of benefits. Your grandpa's pension? The government already spent it and left a note."},

    {"id":"pp_ss_per_person",
     "label":"SS payroll tax: $5,075/person/yr. Average SS benefit: $22,884/yr. The math: 1.5 workers per retiree by 2035.",
     "class":"per_person_ss",
     "tags":["social-security","payroll","benefit","ratio","workers","retirees","math"],
     "tier":1,
     "description":"You pay: 6.2% of income as SS payroll tax (employer matches 6.2% = 12.4% total). Average worker contribution: ~$5,075/yr. Average SS retirement benefit: $1,907/month = $22,884/yr. Current ratio: ~2.7 workers per retiree. By 2035: ~2.3 workers per retiree. By 2050: ~2.0. The math: if 2 workers each pay $5,075 ($10,150 total) to fund one retiree getting $22,884, the system runs a deficit of $12,734 per retiree per year. That deficit comes from the 'trust fund' (IOUs). When the IOUs run out: benefits cut ~20\u201323%. Your grandpa's $1,907/month becomes ~$1,500/month. The tank empties."},

    # === STOCK MARKET: EATS ALL THE MEAT ===
    {"id":"pp_stock_market",
     "label":"US stock market: ~$55T. Top 10% own 90%. Top 1% own 54%. Bottom 50% own 1%. The meat is eaten.",
     "class":"per_person_market",
     "tags":["stock-market","wealth","inequality","top-1-percent","top-10","bottom-50","ownership"],
     "tier":1,
     "description":"US stock market capitalization: ~$55 trillion. GDP: ~$28.5 trillion. Market cap / GDP = 193% (Buffett Indicator \u2014 anything above 100% is historically overvalued). WHO OWNS IT: Top 1% own ~54% of all stocks ($29.7T). Top 10% own ~90% ($49.5T). Bottom 50% of Americans own ~1% ($550B). Per person in the bottom 50% (167.5M people): $3,284 in stock market wealth. Per person in the top 1% (3.35M people): $8,865,672 in stock market wealth. Ratio: 2,700:1. The stock market is not 'the economy.' The stock market is where the top 10% store wealth while calling it 'the economy.'"},

    {"id":"pp_ceo_ratio",
     "label":"CEO pay: ~$16.7M/yr. Worker pay: ~$63K/yr. Ratio: 265:1. Was 21:1 in 1965. The gap ate the middle.",
     "class":"per_person_market",
     "tags":["ceo","worker","pay","ratio","265-to-1","inequality","gap","1965"],
     "tier":1,
     "description":"Average CEO compensation (S&P 500): ~$16.7 million/yr (2023). Average worker pay: ~$63,000/yr. Ratio: 265:1. Historical: 1965: 21:1. 1978: 31:1. 1989: 61:1. 2000: 366:1 (peak). 2023: 265:1. A CEO makes in ONE DAY what a worker makes in 9 MONTHS. The ratio was 21:1 within living memory. Your grandfather's generation: the CEO made 21x the worker. Now: 265x. Where did the difference go? Into the stock market. Which the top 10% own 90% of. The meat was eaten. The bones were left."},

    # === MUTUAL FUNDS / 401(k): THE ILLUSION ===
    {"id":"pp_retirement_illusion",
     "label":"Total US retirement: ~$37T. Median 401(k): $35K. Mean: $134K. The mean is a lie told by the rich to the poor.",
     "class":"per_person_retire",
     "tags":["retirement","401k","ira","pension","median","mean","illusion","inequality"],
     "tier":1,
     "description":"Total US retirement assets: ~$37 trillion. Sounds like enough. But: 401(k) plans: ~$7.7T. IRAs: ~$13.9T. Pensions: ~$8.5T. MEDIAN 401(k) balance: ~$35,000. MEAN 401(k) balance: ~$134,000. The mean is 4x the median. Why? Because a few accounts with millions pull the average up while the typical worker has $35K. At 4% withdrawal: $35K = $1,400/yr = $117/month. Your grandpa thinks he has a pension. The median says: $117/month from the 401(k). That is not retirement. That is a monthly phone bill."},

    {"id":"pp_pension_underfunding",
     "label":"State/local pension gap: ~$1.3T underfunded. The promise was made. The money was not saved. Your teacher's retirement: short.",
     "class":"per_person_retire",
     "tags":["pension","underfunding","state","local","teacher","gap","promise","empty"],
     "tier":1,
     "description":"State and local government pensions: ~$1.3 trillion underfunded. The government promised teachers, firefighters, police, municipal workers: retire after 30 years, receive a pension. Then the government did not fully fund the pension. The money was spent on other things (or never collected). The promise exists. The money does not. When the wave of Baby Boomer retirements meets the $1.3T gap: benefits will be cut, taxes raised, or services slashed. Your teacher's retirement is an IOU from a state that already spent the money. Same pattern as Social Security. Same empty tank."},

    # === YOU PAY FOR THE SPAM ===
    {"id":"pp_you_pay_spam",
     "label":"You pay for the spam. ~200 pieces of junk mail/person/yr. USPS delivers at a loss. Your stamp subsidizes their ad.",
     "class":"per_person_spam",
     "tags":["per-person","spam","junk-mail","usps","subsidy","stamp","cost"],
     "tier":1,
     "description":"67 billion pieces of junk mail / 335M people = ~200 pieces per person per year. USPS delivers marketing mail at below-cost rates (~$0.20-0.50/piece). The loss is covered by: (1) higher first-class stamp prices ($0.73 and rising), (2) service cuts, (3) accumulating debt. Your stamp price subsidizes their junk mail rate. Total estimated cost to recipients (time + disposal): ~$320/person/year. You pay $320/yr to receive garbage you never asked for. Plus: your federal taxes fund USPS infrastructure ($0 direct subsidy, but USPS has $200B+ in unfunded liabilities that Congress created with PAEA 2006). You fund the roads. You fund the routes. You fund the mailbox. They fill it with garbage."},

    {"id":"pp_robocall_cost",
     "label":"Robocalls cost Americans ~$30B/yr in scam losses + wasted time. ~$90/person/yr. TCPA $500/call unenforced.",
     "class":"per_person_spam",
     "tags":["per-person","robocalls","scam","cost","time","wasted","tcpa"],
     "tier":1,
     "description":"Robocall scam losses: ~$10B/yr (reported; actual likely higher). Time wasted: Americans spend ~20 min/week dealing with unwanted calls = 17 hrs/yr per person. At average wage: ~$1,071/yr in time cost. Total economic cost: ~$30B+/yr = ~$90/person/yr. Plus emotional cost: anxiety, interrupted meals, woken from sleep, elderly scam targets. The TCPA says $500/call. 50 billion calls/yr. If enforced: $25 trillion in penalties. Enforcement: functionally zero. You pay $90/yr in real cost. The penalty system exists but does not function. Same pattern: the law exists, the enforcement does not."},

    # === THE EXTRACTION SUMMARY ===
    {"id":"pp_extraction_total",
     "label":"Per Person: pay $14,627 tax. Owe $104,478 debt. Retirement median $35K. Junk costs $410/yr. CEO makes 265x you.",
     "class":"per_person_summary",
     "tags":["per-person","summary","extraction","total","tax","debt","retirement","spam","ceo"],
     "tier":1,
     "description":"THE PER PERSON MATH: You pay: $14,627/yr federal tax. Government spends: $20,000/yr in your name. You owe: $104,478 national debt share. You pay: $2,687/yr just in interest on that debt. Social Security: depletes 2033-35, benefits cut 20-23%. Your 401(k) median: $35,000 ($117/month in retirement). Junk mail + robocall cost: ~$410/yr. Stock market: top 1% own 54%, you own approximately nothing. CEO makes 265x your salary (was 21x when your grandfather worked). The system extracts from the bottom and concentrates at the top. The spam is paid for by you. The pension is empty. The debt is yours. The stock market is theirs."},

    {"id":"pp_same_pattern",
     "label":"Banks takes 72.67% from schools. The system takes 72.67% from everyone. Same extraction. Different scale.",
     "class":"per_person_parallel",
     "tags":["per-person","parallel","extraction","banks","system","scale","pattern"],
     "tier":1,
     "description":"Banks extracts 72.67% from DPSCD contract. The federal system: you pay $14,627 in tax, the government spends $20,000 (137% of what you paid \u2014 the extra is debt). The stock market: top 10% extract 90% of the gains. CEO pay: extracts 265x the worker share. Social Security: extracted the payroll tax, left IOUs. Pensions: extracted the promise, left a $1.3T gap. USPS: extracted your infrastructure, filled it with spam. The PATTERN is the same at every scale. Banks is the local instance. The federal budget is the national instance. The stock market is the global instance. Same extraction. Different altitude. The tree sorts at every level."},
]

for n in new_nodes:
    if n['id'] not in existing_ids:
        nodes.append(n)
        existing_ids.add(n['id'])

new_edges = [
    # Hub
    {"source":"per_person_hub","target":"all_searches_converge","label":"feeds","weight":0.9},
    {"source":"per_person_hub","target":"junkflood_hub","label":"extends","weight":0.9,
     "description":"Per-person math extends the junk flood: you pay for the spam"},
    {"source":"per_person_hub","target":"validator_hub","label":"validated_by","weight":0.9},

    # Federal budget
    {"source":"pp_federal_revenue","target":"per_person_hub","label":"part_of","weight":1.0},
    {"source":"pp_federal_spending","target":"per_person_hub","label":"part_of","weight":1.0},
    {"source":"pp_federal_spending","target":"pp_federal_revenue","label":"exceeds","weight":1.0,
     "description":"Spending $20K > Revenue $14,627. Deficit $5,373/person/yr."},
    {"source":"pp_national_debt","target":"pp_federal_spending","label":"accumulated_from","weight":1.0},
    {"source":"pp_national_debt","target":"val_us_census","label":"validated_by","weight":0.8,
     "description":"Census: 335M people. Treasury: $35T debt. Math: $104K/person."},

    # Social Security
    {"source":"pp_social_security","target":"per_person_hub","label":"part_of","weight":1.0},
    {"source":"pp_ss_per_person","target":"pp_social_security","label":"math_of","weight":1.0},
    {"source":"pp_social_security","target":"pp_pension_underfunding","label":"same_pattern","weight":0.9,
     "description":"Both: promise made, money spent, IOU left."},
    {"source":"pp_social_security","target":"junk_usps_privatization","label":"same_pattern","weight":0.7,
     "description":"PAEA crippled USPS. Congress crippled SS. Same playbook: break it, point at the broken."},

    # Stock market
    {"source":"pp_stock_market","target":"per_person_hub","label":"part_of","weight":1.0},
    {"source":"pp_ceo_ratio","target":"pp_stock_market","label":"explains","weight":0.9,
     "description":"CEO 265:1 ratio = where the stock market gains go"},
    {"source":"pp_stock_market","target":"val_world_bank","label":"validated_by","weight":0.7},

    # Retirement illusion
    {"source":"pp_retirement_illusion","target":"per_person_hub","label":"part_of","weight":1.0},
    {"source":"pp_pension_underfunding","target":"pp_retirement_illusion","label":"compounds","weight":1.0},
    {"source":"pp_retirement_illusion","target":"pp_social_security","label":"same_pattern","weight":0.9,
     "description":"401(k) median $35K + SS depleting = retirement crisis in both columns"},

    # You pay for spam
    {"source":"pp_you_pay_spam","target":"per_person_hub","label":"part_of","weight":1.0},
    {"source":"pp_you_pay_spam","target":"junk_the_steal","label":"per_person_of","weight":1.0,
     "description":"$320/person/yr in junk mail cost. You pay for the spam."},
    {"source":"pp_robocall_cost","target":"per_person_hub","label":"part_of","weight":1.0},
    {"source":"pp_robocall_cost","target":"junk_robocalls","label":"per_person_of","weight":1.0},
    {"source":"pp_robocall_cost","target":"junk_tcpa_math","label":"unenforced","weight":0.9},

    # Summary
    {"source":"pp_extraction_total","target":"per_person_hub","label":"summarizes","weight":1.0},
    {"source":"pp_same_pattern","target":"pp_extraction_total","label":"reveals","weight":1.0},
    {"source":"pp_same_pattern","target":"stats_exception_proves_rule","label":"scales","weight":1.0,
     "description":"Banks is the local exception. The federal budget is the national exception. Same test."},
    {"source":"pp_same_pattern","target":"junk_parallel","label":"extends","weight":0.9,
     "description":"52% of USPS = junk. 54% of stocks = top 1%. Same extraction at different scales."},

    # Validator connections
    {"source":"pp_federal_revenue","target":"val_irs_990","label":"validated_by","weight":0.8},
    {"source":"pp_ss_per_person","target":"val_bjs","label":"context","weight":0.5},
    {"source":"pp_ceo_ratio","target":"val_world_bank","label":"global_context","weight":0.6},
]

for e in new_edges:
    edges.append(e)

G['nodes'] = nodes
G['edges'] = edges
with open(gpath, 'w', encoding='utf-8') as f:
    json.dump(G, f, separators=(',', ':'), ensure_ascii=False)

bpath = os.path.join('site', 'static', 'braids.json')
with open(bpath, 'r', encoding='utf-8') as f:
    braids = json.load(f)
now_ns = int(time.time() * 1e9)

braids.append({
    "data_hash": "blake3:per_person:tax_debt_market_pension_spam",
    "mime_type": "application/json",
    "size": 0,
    "was_generated_by": {
        "agent": "did:web:detroit.primals.eco",
        "plan": "Per person math: 335M Americans. Pay $14,627 tax. Govt spends $20,000. Owe $104,478 debt. $2,687/yr in interest alone. SS trust fund = IOUs, depletes 2033-35. Stock market: top 1% own 54%, bottom 50% own 1%. CEO:worker 265:1 (was 21:1 in 1965). Median 401(k): $35K = $117/month. Pensions $1.3T underfunded. Junk mail: $320/person/yr. Robocalls: $90/person/yr. Banks takes 72.67% from schools. System takes 72.67% from everyone. Same extraction, different scale.",
        "software": "detroit-build/0.1.0"
    },
    "was_derived_from": [
        {"id": "urn:us:revenue", "hash": "4.9T"},
        {"id": "urn:us:debt", "hash": "35T"},
        {"id": "urn:market:top1", "hash": "54pct"},
        {"id": "urn:ceo:ratio", "hash": "265:1"}
    ],
    "was_attributed_to": "did:web:detroit.primals.eco",
    "metadata": {
        "title": "per_person_extraction_math",
        "tags": ["per-person", "tax", "debt", "stock-market", "pension", "social-security", "spam", "extraction"],
        "custom": {"pop": 335000000, "tax_pp": 14627, "spend_pp": 20000, "debt_pp": 104478, "ceo_ratio": 265, "median_401k": 35000}
    },
    "witness": {
        "agent": "did:web:detroit.primals.eco",
        "kind": "hash",
        "evidence": "Per person: pay $14,627 tax, govt spends $20,000, owe $104,478 debt. SS depletes 2033-35. Top 1% own 54% of stocks. CEO 265:1. Median 401(k) $35K. Pensions $1.3T short. Junk costs $410/yr. Same extraction at every scale.",
        "witnessed_at": now_ns,
        "encoding": "none",
        "tier": "anchor",
        "context": "The stock market eats the meat. The pension is paper. Social Security is a collapsing tank. You pay for the spam. Same pattern. Different altitude."
    }
})

with open(bpath, 'w', encoding='utf-8') as f:
    json.dump(braids, f, separators=(',', ':'), ensure_ascii=False)

pc = sum(1 for n in nodes if 'per-person' in n.get('tags',[]))
print(f"Graph: {len(nodes)} nodes, {len(edges)} edges")
print(f"Braids: {len(braids)}")
print(f"Per-person nodes: {pc}")
