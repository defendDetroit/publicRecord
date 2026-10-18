#!/usr/bin/env python3
"""Deep bingo maze: trace structural connections without meta nodes."""
import json
from collections import deque

with open('site/static/graph.json', 'r', encoding='utf-8') as f:
    g = json.load(f)

nodes = g['nodes']
edges = g['edges']
node_map = {n['id']: n.get('label', n['id']) for n in nodes}

# Build adjacency WITHOUT conceptual/meta nodes
skip_nodes = {'desilo_pattern', 'agc_file_26_2141', 'agc_referral_loop'}
adj = {}
for e in edges:
    s, t = e['source'], e['target']
    if s in skip_nodes or t in skip_nodes:
        continue
    typ = e.get('type', e.get('label', ''))
    adj.setdefault(s, []).append((t, typ))
    adj.setdefault(t, []).append((s, typ))

def neighborhood(start, max_depth=3):
    visited = {start: 0}
    queue = deque([(start, 0)])
    while queue:
        current, depth = queue.popleft()
        if depth >= max_depth:
            continue
        for neighbor, etype in adj.get(current, []):
            if neighbor not in visited:
                visited[neighbor] = depth + 1
                queue.append((neighbor, depth + 1))
    return visited

def bfs_path(start, end, max_hops=5):
    if start not in adj:
        return None
    visited = {start}
    queue = deque([(start, [start])])
    while queue:
        current, path = queue.popleft()
        if current == end:
            return path
        if len(path) > max_hops:
            continue
        for neighbor, etype in adj.get(current, []):
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append((neighbor, path + [neighbor]))
    return None

ent_targets = [
    'brian_banks', 'joseph_holland', 'cylenthia_miller',
    'todd_perkins', 'lamar_moreland', 'renae_moore',
    'purpose_charter_academy', 'macdowell_preparatory_academy',
    'purpose_foundation', 'banks_strategy_llc', 'dykema',
    'baker_college', 'purpose_group_llc'
]

# Bullington deep trace
print('=== BULLINGTON: Enterprise within 4 hops (structural only) ===')
bull_hood = neighborhood('cynthia_c_bullington', 4)
for eid in sorted(ent_targets):
    if eid in bull_hood:
        ename = node_map.get(eid, eid)
        path = bfs_path('cynthia_c_bullington', eid)
        if path:
            pstr = ' -> '.join([node_map.get(p, p) for p in path])
            print(f'  {ename} [{bull_hood[eid]} hops]: {pstr}')

# Goetz deep trace
print()
print('=== GOETZ: Enterprise within 4 hops (structural only) ===')
goetz_hood = neighborhood('michael_v_goetz', 4)
for eid in sorted(ent_targets):
    if eid in goetz_hood:
        ename = node_map.get(eid, eid)
        path = bfs_path('michael_v_goetz', eid)
        if path:
            pstr = ' -> '.join([node_map.get(p, p) for p in path])
            print(f'  {ename} [{goetz_hood[eid]} hops]: {pstr}')

# MSU Law - the nexus
print()
print('=== MSU COLLEGE OF LAW: ALL CONNECTIONS ===')
for n, t in adj.get('msu_college_of_law', []):
    print(f'  [{t}] {node_map.get(n, n)}')

# Michigan State University - broader
print()
print('=== MICHIGAN STATE UNIVERSITY: ALL CONNECTIONS ===')
msu_conns = adj.get('michigan_state_university', [])
if msu_conns:
    for n, t in sorted(msu_conns, key=lambda x: x[1])[:30]:
        print(f'  [{t}] {node_map.get(n, n)}')
    if len(msu_conns) > 30:
        print(f'  ... and {len(msu_conns) - 30} more')

# Check for Elrick
print()
print('=== ELRICK SEARCH ===')
for n in nodes:
    nid = n.get('id', '')
    label = n.get('label', '')
    if 'elrick' in nid.lower() or 'elrick' in label.lower():
        print(f'  Found: {nid} = {label} ({n.get("type", "")})')
        for neighbor, etype in adj.get(nid, []):
            print(f'    [{etype}] -> {node_map.get(neighbor, neighbor)}')

# Holland
print()
print('=== HOLLAND: ALL CONNECTIONS ===')
holland_ids = [n['id'] for n in nodes if 'holland' in n.get('id', '').lower()]
for hid in holland_ids:
    conns = adj.get(hid, [])
    print(f'  {node_map.get(hid, hid)} ({hid}): {len(conns)} edges')
    for neighbor, etype in sorted(conns, key=lambda x: x[1])[:20]:
        print(f'    [{etype}] -> {node_map.get(neighbor, neighbor)}')
    if len(conns) > 20:
        print(f'    ... and {len(conns) - 20} more')

# Banks financial
print()
print('=== BANKS: ALL DIRECT CONNECTIONS ===')
banks_conns = adj.get('brian_banks', [])
if banks_conns:
    print(f'  brian_banks: {len(banks_conns)} edges')
    for neighbor, etype in sorted(banks_conns, key=lambda x: x[1])[:30]:
        print(f'    [{etype}] -> {node_map.get(neighbor, neighbor)}')
    if len(banks_conns) > 30:
        print(f'    ... and {len(banks_conns) - 30} more')

# Shared neighbors between Bullington and Banks
print()
print('=== SHARED NEIGHBORS: Bullington <-> Banks ===')
bull_n = {n for n, _ in adj.get('cynthia_c_bullington', [])}
banks_n = {n for n, _ in adj.get('brian_banks', [])}
shared = bull_n & banks_n
for s in shared:
    print(f'  {node_map.get(s, s)}')

# Shared neighbors: Bullington <-> Miller
print()
print('=== SHARED NEIGHBORS: Bullington <-> Miller ===')
miller_n = {n for n, _ in adj.get('cylenthia_miller', [])}
shared_bm = bull_n & miller_n
for s in shared_bm:
    print(f'  {node_map.get(s, s)}')

# Shared neighbors: Goetz <-> Moreland
print()
print('=== SHARED NEIGHBORS: Goetz <-> Moreland ===')
goetz_n = {n for n, _ in adj.get('michael_v_goetz', [])}
moreland_n = {n for n, _ in adj.get('lamar_moreland', [])}
shared_gm = goetz_n & moreland_n
for s in shared_gm:
    print(f'  {node_map.get(s, s)}')
