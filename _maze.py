#!/usr/bin/env python3
"""Bingo maze: trace ALL paths from AGC roster to enterprise nodes."""
import json
from collections import deque

with open('site/static/graph.json', 'r', encoding='utf-8') as f:
    g = json.load(f)

nodes = g['nodes']
edges = g['edges']

# Build adjacency with edge types
adj = {}
for e in edges:
    s, t = e['source'], e['target']
    typ = e.get('type', e.get('label', ''))
    adj.setdefault(s, []).append((t, typ))
    adj.setdefault(t, []).append((s, typ))

node_map = {n['id']: n.get('label', n['id']) for n in nodes}

# AGC roster
agc_roster = [
    'cynthia_c_bullington', 'michael_v_goetz', 'kathleen_hickey',
    'kimberly_uhuru', 'alexander_pahany', 'sarah_lindsey',
    'kendrah_robinson'
]

# Enterprise nodes
enterprise = [
    'brian_banks', 'joseph_holland', 'cylenthia_miller',
    'todd_perkins', 'lamar_moreland', 'renae_moore',
    'purpose_charter_academy', 'macdowell_preparatory_academy',
    'purpose_foundation', 'banks_strategy_llc', 'dykema'
]

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

def shared_neighbors(a, b):
    """Find nodes connected to both a and b."""
    a_neighbors = {n for n, _ in adj.get(a, [])}
    b_neighbors = {n for n, _ in adj.get(b, [])}
    return a_neighbors & b_neighbors

print('=== BINGO MAZE: AGC ROSTER -> ENTERPRISE ===')
print()

connections_found = []

for agc_id in agc_roster:
    name = node_map.get(agc_id, agc_id)
    print(f'--- {name} ---')
    found_any = False
    for ent_id in enterprise:
        ent_name = node_map.get(ent_id, ent_id)
        path = bfs_path(agc_id, ent_id)
        if path and len(path) <= 5:
            path_str = ' -> '.join([node_map.get(p, p) for p in path])
            hops = len(path) - 1
            print(f'  -> {ent_name} [{hops} hops]: {path_str}')
            connections_found.append((name, ent_name, hops, path_str))
            found_any = True

        # Also check shared neighbors
        shared = shared_neighbors(agc_id, ent_id)
        if shared and len(shared) <= 10:
            for s in list(shared)[:5]:
                s_name = node_map.get(s, s)
                if s not in [agc_id, ent_id]:
                    print(f'     shared neighbor with {ent_name}: {s_name}')

    if not found_any:
        # Check direct neighbors
        neighbors = adj.get(agc_id, [])
        print(f'  (neighbors: {len(neighbors)})')
    print()

# Bullington deep dive - all neighbors
print('=== BULLINGTON: ALL DIRECT CONNECTIONS ===')
for neighbor, etype in adj.get('cynthia_c_bullington', []):
    print(f'  [{etype}] -> {node_map.get(neighbor, neighbor)}')

print()
print('=== GOETZ: ALL DIRECT CONNECTIONS ===')
for neighbor, etype in adj.get('michael_v_goetz', []):
    print(f'  [{etype}] -> {node_map.get(neighbor, neighbor)}')

print()
print('=== HICKEY: ALL DIRECT CONNECTIONS ===')
for neighbor, etype in adj.get('kathleen_hickey', []):
    print(f'  [{etype}] -> {node_map.get(neighbor, neighbor)}')

# Summary
print()
print(f'=== SUMMARY: {len(connections_found)} paths found ===')
for name, ent, hops, path in sorted(connections_found, key=lambda x: x[2]):
    print(f'  {name} -> {ent} ({hops} hops)')
