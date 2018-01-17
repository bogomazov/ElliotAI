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

if [ "$PLATFORM" == "ios" ] && [ "$ENV" == "Staging" ]; then
    # Use Info.plist file with Dev- prefix for iOS Staging
    code-push release-react $APPNAME $PLATFORM --deploymentName $ENV --mandatory --pre "Dev-"
else 
    code-push release-react $APPNAME $PLATFORM --deploymentName $ENV --mandatory
fi
