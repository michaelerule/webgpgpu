#!/usr/bin/env bash


# It seems to be a litte tricky to get the Sphinx automatic documentation
# to host as a web page on git pages.
#
# What we will do intead is manually synchronize the documentation
# builds with the branches of these projects used for the web pages
#
# Run this script from it's local directory
#

shopt -s extglob
./go
git add *
git rm !(.*)
git add -u :/
git commit -m "$1"
git push origin master
