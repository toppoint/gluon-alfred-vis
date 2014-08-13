#!/usr/bin/env python
# -*- coding: UTF-8 -*-

"""
This script splits all nodes in single files under logs/nodes and creates an nodes_offline.json file

Syntax: python nodes-log.py < nodes.json
"""

import json, sys, os, datetime, time

# timestamp to be added in nodes_offline.json
timestamp = time.time()
h_datetime = datetime.datetime.fromtimestamp(timestamp).strftime('%d.%m %H:%M:%S')

try:
  nodes_data=json.load(sys.stdin)
except:
  sys.exit('No JSON object could be decoded')

nodes=nodes_data['nodes']

folder='logs/nodes_legacy/'
hostnames=[]
# write all online nodes in separate files under logs/nodes_legacy/
for i in range(0, len(nodes)):
  if nodes[i]['flags']['online'] and 'flags' in nodes[i] and 'legacy' in nodes[i]['flags'] and nodes[i]['flags']['legacy']:
    if nodes[i]['name']=='':
      nodes[i]['name']=nodes[i]['id']
    nodes[i]['last_seen_h']=h_datetime
    nodes[i]['last_seen']=timestamp
    with open(folder+nodes[i]['name'], 'w') as fp:
      json.dump(nodes[i], fp)
      fp.close()
      hostnames.append(nodes[i]['name'])
  
ons=[]

