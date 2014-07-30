import json, sys, os

# call with 
# cat alfred.json | python alfred-log.py

try:
  nodes=json.load(sys.stdin)
except:
  sys.exit('No JSON object could be decoded; Input size:')

folder='logs/nodes/'
lb="\n"
hostnames=[]
# write all nodes in separate files under logs/nodes/
for i in nodes:
  with open(folder+nodes[i]['hostname'], 'wb') as fp:
    json.dump(nodes[i], fp)
    fp.close()
    hostnames.append(nodes[i]['hostname'])
        
# offline nodes:
offline=open('alfred_offline.json', 'wb')
offline.write('{')
# look for files not in the nodes array
for fn in os.listdir('logs/nodes'):
  if not (fn in hostnames):
    node=open(folder+fn,'r')
    offline.write(node.read()+lb)

offline.write('}'+lb)
offline.close()