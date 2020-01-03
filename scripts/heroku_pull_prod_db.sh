#!/bin/sh

set -e

which heroku >/dev/null || (echo "You must have the heroku-cli installed, configured with production remote." && exit 1)
REMOTE="production"
TARGET_DB="sargassum_watch_development"

read -p "This will drop your local database. Are your sure? y/N " answer

case $answer in
  y*)
    # NOOP
  ;;

  *)
    exit 1
  ;;
esac

echo "Fetching heroku db config..."
SOURCE=$(heroku pg:info -r ${REMOTE} |grep -m1 Add-on |cut -d":" -f 2)

if psql -lqt | cut -d \| -f 1 | grep -qw $TARGET_DB; then
  echo "Dropping local db..."
  RAILS_ENV=development bundle exec rails db:drop >/dev/null
fi

echo "Pulling ${REMOTE} database, this could take a while..."
heroku pg:pull ${SOURCE} -r ${REMOTE} ${TARGET_DB} >/dev/null

echo "Done."
