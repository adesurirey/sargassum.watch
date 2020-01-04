#! /bin/sh

set -e

# Define review apps HOST
which heroku >/dev/null || (echo "Heroku cli not found" && exit 1)

heroku config:set --app $HEROKU_APP_NAME HOST=https://$HEROKU_APP_NAME.herokuapp.com
