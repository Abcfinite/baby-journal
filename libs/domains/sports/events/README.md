# EVENTS SERVICE

## offline

DOMAIN=sports SERVICE=events make offline

## Deployment

### deploy all functions
update webpack.config.js to production mode
comment externals on webpack.config.js

make shell
cd libs/domains/sports/bets
sls deploy

### deploy single function
You can only deploy single function after you deploy all functions

make shell
cd libs/domains/sports/events
sls deploy -f removeAllCache
