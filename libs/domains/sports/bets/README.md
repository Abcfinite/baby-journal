# BETS SERVICE

## offline

DOMAIN=sports SERVICE=bets make offline

## Deployment

update webpack.config.js to production mode
comment externals on webpack.config.js

make shell
cd libs/domains/sports/bets
sls deploy