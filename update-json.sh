#!/bin/bash

# call this script regularly as a cron job to get the latest alfred.json file

wget http://freifunk.in-kiel.de/alfred.json -O alfred.json
