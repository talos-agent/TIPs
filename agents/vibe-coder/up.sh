#!/usr/bin/env bash
docker build -t z-n-vibe agents/vibe-coder
docker run --rm -it \
  -v "$PWD":/repo \
  -e ZERO_GITHUB_TOKEN \
  --network host \
  z-n-vibe uvicorn main:app --reload --host 0.0.0.0 --port 8081
