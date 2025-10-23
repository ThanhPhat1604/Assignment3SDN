#!/usr/bin/env bash
# Ensure all dependencies (including dev) are installed before building
npm install --include=dev
npm run build
