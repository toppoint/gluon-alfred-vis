#!/usr/bin/env python
# -*- coding: UTF-8 -*-

"""
Syntax: python alfred-log.py < alfred.json
"""

import json, sys, os

try:
  nodes=json.load(sys.stdin)
except:
  sys.exit('No JSON object could be decoded')

folder='logs/nodes/'
hostnames=[]
# write all nodes in separate files under logs/nodes/
for i in nodes:
  with open(folder+nodes[i]['hostname'], 'w') as fp:
    json.dump(nodes[i], fp)
    fp.close()
    hostnames.append(nodes[i]['hostname'])

ons=[]

# look for files not in the nodes array
for on_hostname in os.listdir('logs/nodes'):
  if not (on_hostname in hostnames):
    on_fp=open(folder+on_hostname,'r')
    on_json=on_fp.read()
    on=json.loads(on_json)
    ons.append('"%s":%s' % (on["network"]["mac"], on_json))

# offline nodes (on):
offline=open('alfred_offline.json', 'w')
offline.write('{%s}' % ",".join(ons))
offline.close()
