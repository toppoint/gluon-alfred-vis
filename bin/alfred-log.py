#!/usr/bin/env python
# -*- coding: UTF-8 -*-

"""
This script splits all nodes in single files under logs/nodes and creates an alfred_offline.json file

Syntax: python alfred-log.py < alfred.json
"""

import json, sys, os, datetime, time

# timestamp to be added in alfred_offline.json
timestamp = time.time()
h_datetime = datetime.datetime.fromtimestamp(timestamp).strftime('%d.%m %H:%M:%S')

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
    if not 'distribution' in on:
      try:
        ons.append('"%s":%s' % (on["network"]["mac"], on_json))
      except:
        print on
        sys.exit('ERROR: ["network"]["mac"] not in JSON object')


# offline nodes (on):
offline=open('alfred_offline.json', 'w')
offline.write('{"additional_data": {"datetime": "%s", "timestamp": "%s"}, %s}' % (h_datetime, timestamp, ",".join(ons)))
offline.close()
