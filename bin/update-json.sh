#!/bin/bash

BINPATH="$1"
WWWPATH="$2"
URL="$3"

# call this script regularly as a cron job to get the latest alfred.json file

if [ $# -ne 2 ] ; then
  echo "ERROR: wrong number of parameters"
  echo
  echo "Syntax: $0 /path/to/bin /path/to/www http://.../alfred.json"
  exit 1
fi

cd "${WWWPATH}"

curl -o alfred.json "$url"

mkdir -p logs/nodes
cp alfred.json logs/alfred_$(date +%y%m%d-%H%M%S).json
${BINPATH}/alfred-log.py < alfred.json
