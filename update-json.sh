#!/bin/bash

# call this script regularly as a cron job to get the latest alfred.json file

wget http://freifunk.in-kiel.de/alfred.json -O alfred.json
mkdir -p logs/nodes
cp alfred.json logs/alfred_`date "+%y%m%d-%H%M%S"`.json
cat alfred.json | python alfred-log.py

# to download the alfred json file every 10 minutes add this to your crontab:
#*/10 * * * * some_user cd /path/to/gluon-alfred-vis; bash update-json.sh > /dev/null

