#!/usr/bin/env bash
set -e
MODE=${MODE:-wasm}        # wasm | server | mock
export MODE

if [[ "$1" == "--ngrok" ]]; then
  export USE_NGROK=1
fi

docker compose up --build
