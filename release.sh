#!/bin/bash

function echoHelp {
    printf "Usage: \n\t release.sh 'Commit message'\n\n";
}

if [ -z "$1" ]; then
    echoHelp;
    exit 1;
fi;

# compile typescript

# commit 
git add *
git commit -am "$1"

# push
git push 