#!/usr/bin/env bash
set -e

if [[ $# -ne 3 ]]; then
  echo "usage: ./deploy.sh <environment> <app-name> <platform>"
  echo "e.g.   ./deploy.sh Production Elliot ios"
  exit 1
fi

ENV=$1
APPNAME=$2
PLATFORM=$3
BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT=$(git log --pretty=format:'%h' -n 1)

if [ "$ENV" != "Production" ] && [ "$ENV" != "Staging" ]; then
	echo "environment should be either 'Production' or 'Staging'"
	exit 1
fi

if [ "$PLATFORM" != "ios" ] && [ "$PLATFORM" != "android" ]; then
	echo "platform should be either 'ios' or 'android'"
	exit 1
fi

git_name="$(git config user.name)"
slack_url="https://slack.com/api/chat.postMessage?token=xoxp-71345121281-71466681605-132637077411-5cc6a4f19311fcba3c0dcf3f04c288a2"
full_slack_url="$slack_url&channel=deploy&text=$git_name deploying elliot-mobile:$BRANCH $COMMIT on CodePush-$ENV&pretty=1"
# Need to convert spaces to %20's for slack
converted_slack_url="${full_slack_url// /%20}"
curl -s "$converted_slack_url"


code-push release-react $APPNAME $PLATFORM --deploymentName $ENV --mandatory 
