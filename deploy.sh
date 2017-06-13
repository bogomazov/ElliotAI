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

slack_url="https://slack.com/api/chat.postMessage?token=xoxp-71345121281-71466681605-132637077411-5cc6a4f19311fcba3c0dcf3f04c288a2"
full_slack_url="$slack_url&channel=deploy&text=Deploying%20elliot-mobile:$BRANCH%20$COMMIT%20on%20CodePush-$ENV&pretty=1"
curl -s "$full_slack_url"

code-push release-react $APPNAME $PLATFORM --deploymentName $ENV --mandatory 
