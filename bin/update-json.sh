#!/bin/bash

# This script downloads the latest alfred.json and optional legacy nodes.json, creates logs by date in the www folder of your allpplication under logs/ 
# and calls alfred-log.py that splits all nodes in single files under logs/nodes and creates an alfred_offline.json file

BINPATH="$1"
WWWPATH="$2"
URL="$3"
LEGACY_URL="$4"

# call this script regularly as a cron job to get the latest alfred.json file

if [ $# -ne 3 -a $# -ne 4 ] ; then
  if [ "$1" != "--help" ]; then
	echo "ERROR: wrong number of parameters"
    echo
  fi
  echo "Syntax:"
  echo "$0 /path/to/bin /path/to/www http://freifunk.path/to/.../alfred.json [http://freifunk.path/to/.../nodes.json]"
  echo
  echo "the fourth parameter for legacy nodes.json is optional"
  echo
  exit 1
fi

cd "${WWWPATH}"

# get the actual json file from $URL
curl -o alfred.json "$URL"

mkdir -p logs/nodes

# copy the new file to a backupped version by date for possible analysation use later
cp alfred.json logs/alfred_$(date +%y%m%d-%H%M%S).json

# call alfred-log.py to split all single nodes under logs/nodes
${BINPATH}/alfred-log.py < alfred.json

# optional download legacy nodes.json
if [ "$LEGACY_URL" != "" ]; then
	curl -o nodes.json "$LEGACY_URL"
	cp nodes.json logs/nodes_$(date +%y%m%d-%H%M%S).json
	${BINPATH}/nodes-log.py < nodes.json
fi