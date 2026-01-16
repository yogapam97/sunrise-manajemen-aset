#!/bin/bash

# Build the stageholder-api Docker image
echo "Building stageholder-api Docker image..."
docker build -t stageholder-api:latest -f apps/stageholder-api/Dockerfile .
if [ $? -ne 0 ]; then
  echo "Failed to build stageholder-api Docker image."
  exit 1
fi

# Build the stageholder-pwa Docker image
echo "Building stageholder-pwa Docker image..."
docker build -t stageholder-pwa:latest -f apps/stageholder-pwa/Dockerfile .
if [ $? -ne 0 ]; then
  echo "Failed to build stageholder-pwa Docker image."
  exit 1
fi

echo "Docker images built successfully."
