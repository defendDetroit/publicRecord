#!/usr/bin/env python3
import json, sys
sys.stdout.reconfigure(encoding='utf-8')
from collections import deque

with open('site/static/graph.json', 'r', encoding='utf-8') as f:
    g = json.load(f)

nodes = g['nodes']
edges = g['edges']
node_map = {n['id']: n.get('label', n['id']) for n in nodes}

adj = {}
for e in edges:
    s, t = e['source'], e['target']
    typ = e.get('type', e.get('label', ''))
    adj.setdefault(s, []).append((t, typ))
    adj.setdefault(t, []).append((s, typ))

# Holland
print('=== HOLLAND ===')
for n in nodes:
    nid = n.get('id', '')
    if 'holland' in nid.lower():
        conns = adj.get(nid, [])
        label = n.get('label', nid)
        print(f'{label} ({nid}): {len(conns)} edges')
        for n2, t in conns[:20]:
            print(f'  [{t}] {node_map.get(n2, n2)}')

# Elrick
print('\n=== ELRICK ===')
for n in nodes:
    nid = n.get('id', '')
    if 'elrick' in nid.lower():
        conns = adj.get(nid, [])
        label = n.get('label', nid)
        print(f'{label} ({nid}): {len(conns)} edges')
        for n2, t in conns[:15]:
            print(f'  [{t}] {node_map.get(n2, n2)}')

# Banks
print('\n=== BANKS (first 30) ===')
conns = adj.get('brian_banks', [])
print(f'brian_banks: {len(conns)} total edges')
for n2, t in sorted(conns, key=lambda x: x[1])[:30]:
    print(f'  [{t}] {node_map.get(n2, n2)}')
if len(conns) > 30:
    print(f'  ... and {len(conns) - 30} more')

# MSU nodes
print('\n=== MSU-RELATED NODES ===')
for n in nodes:
    nid = n.get('id', '')
    if 'msu' in nid.lower() or 'michigan-state' in nid.lower() or 'michigan_state' in nid.lower():
        conns = adj.get(nid, [])
        label = n.get('label', nid)
        print(f'{label} ({nid}): {len(conns)} edges')
        for n2, t in conns[:10]:
            print(f'  [{t}] {node_map.get(n2, n2)}')

# Shared neighbors
print('\n=== SHARED NEIGHBORS ===')
def get_neighbors(nid):
    return {n for n, _ in adj.get(nid, [])}

pairs = [
    ('cynthia_c_bullington', 'cylenthia_miller'),
    ('cynthia_c_bullington', 'brian_banks'),
    ('michael_v_goetz', 'lamar_moreland'),
    ('kathleen_hickey', 'brian_banks'),
]
for a, b in pairs:
    shared = get_neighbors(a) & get_neighbors(b)
    a_name = node_map.get(a, a)
    b_name = node_map.get(b, b)
    if shared:
        print(f'{a_name} <-> {b_name}: {len(shared)} shared')
        for s in list(shared)[:5]:
            print(f'  {node_map.get(s, s)}')
    else:
        print(f'{a_name} <-> {b_name}: NO shared neighbors')

# Coverage files mentioning Elrick
print('\n=== ELRICK COVERAGE FILES ===')
import glob
for f in glob.glob('site/content/coverage/*elrick*'):
    print(f'  {f}')
