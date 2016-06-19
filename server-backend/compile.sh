#!/bin/bash
env GOOS=linux GOARCH=arm go build -v github.com/kunterbunt/fintag-server
