#!/usr/bin/env bash

mkdir -p dist

tsc
cp src/help.txt dist/help.txt
