#!/bin/bash

# call this script regularly as a cron job to get the latest alfred.json file

if [ -z "$1" ] ; then
  echo "ERROR: Parameter missing."
  echo "call with path/to/alfred-log.py as parameter"
  exit 0
fi

wget http://freifunk.in-kiel.de/alfred.json -O alfred.json
mkdir -p logs/nodes
cp alfred.json logs/alfred_`date "+%y%m%d-%H%M%S"`.json
cat alfred.json | python $1alfred-log.py

# to download the alfred json file every 10 minutes add this to your crontab:
#*/10 * * * * some_user cd /path/to/www/gluon-alfred-vis; bash /path/to/bin/update-json.sh /path/to/bin/ > /dev/null

