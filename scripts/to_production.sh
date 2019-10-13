#!/bin/sh

set -e
[ -n "$DEBUG" ] && set -x

which heroku >/dev/null || (echo "You must have the heroku-cli installed, configured with staging & production remotes." && exit 1)
which sentry-cli >/dev/null || (echo "You must have the sentry-cli installed and configured." && exit 1)

HEROKU_APP="sargassum-watch"
TIMESTAMP=`date +"%s"`
TAG="${USER}@${TIMESTAMP}"

echo "👀 Fetching git repo..."
git fetch origin --quiet

CURRENT_BRANCH=`git rev-parse --abbrev-ref HEAD`
CURRENT_HEAD=`git rev-parse HEAD`
ORIGIN_HEAD=`git rev-parse origin/master`

if [ $CURRENT_BRANCH != "master" ]; then
  echo "✋ Please switch to master branch to deploy."
  exit 1
fi

if [ $CURRENT_HEAD != $ORIGIN_HEAD ]; then
  echo "✋ master is not synced with origin, solve it."
  exit 1
fi

read -p "👉 Deploy to production? (y/N) " confirmed

if [ $confirmed != "y" ]; then
  echo "✋ Aborted."
  exit 1
fi

sentry-cli releases new $TAG

echo "🚀 git push production master..."
git push production master

sentry-cli releases finalize $TAG
sentry-cli releases set-commits --auto $TAG

git tag $TAG && git push origin tag $TAG

heroku config:set RELEASE=$TAG --app $HEROKU_APP

echo "👌 Done."
