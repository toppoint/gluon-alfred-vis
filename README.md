gluon-alfred-vis
================
Lists all nodes in Freifunk by analysing `alfred.json`

The file `alfred.json` will be regularly downloaded into the `www` folder of this repository by `cron` that calls the script `update-json.sh`. Therefore copy the `crontab` file into your `/etc/cron.d/` folder and adapt it to your needs.

The files `alfred-log.py` and `update-json.sh` from the `bin` folder have to stay in the same folder for example `/opt/ff/gluon-alfred-vis/bin/`.

 + *git repository:* https://github.com/ffnord/gluon-alfred-vis
 + *online version:* http://freifunk.discovibration.de/gluon-alfred-vis/www/alfred.html