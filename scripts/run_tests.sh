#!/usr/bin/env bash
set -euo pipefail
# set -x

THIS_FILE=$(readlink -f "${BASH_SOURCE[0]}")
THIS_DIR=$(dirname "$THIS_FILE")
ROOT_DIR=$(dirname "$THIS_DIR")
WORKSPACE_DIR="$(dirname "$ROOT_DIR")"

. "$THIS_DIR/kash/kash.sh"

## Parse options
##

NODE_VER=20
MONGO_VER=7
CI_STEP_NAME="Run tests"
RUN_SONAR=false
while getopts "m:n:sr:" option; do
    case $option in
        m) # defines mongo version
            MONGO_VER=$OPTARG
            ;;
        n) # defines node version
            NODE_VER=$OPTARG
             ;;
        s) # publish code coverage
            RUN_SONAR=true
            ;;
        r) # report outcome to slack
            load_env_files "$WORKSPACE_DIR/development/common/SLACK_WEBHOOK_SERVICES.enc.env"
            CI_STEP_NAME=$OPTARG
            trap 'slack_ci_report "$ROOT_DIR" "$CI_STEP_NAME" "$?" "$SLACK_WEBHOOK_SERVICES"' EXIT
            ;;
        *)
            ;;
    esac
done

## Init workspace
##

. "$WORKSPACE_DIR/development/workspaces/services/services.sh" weacast

## Run tests
##

run_lib_tests "$ROOT_DIR" "$RUN_SONAR" "$NODE_VER" "$MONGO_VER"
