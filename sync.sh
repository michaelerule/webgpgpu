#!/usr/bin/env bash


# It seems to be a litte tricky to get the Sphinx automatic documentation
# to host as a web page on git pages.
#
# What we will do intead is manually synchronize the documentation
# builds with the branches of these projects used for the web pages
#
# Run this script from it's local directory
#

# Clean up editor and temp files from the local directory (even if not 
# tracked by git)
echo "Deleting editor temporary files"
find . -name "*.pyc" -exec rm -rf {} \; 2>/dev/null
find . -name "*~" -exec rm -rf {} \;  2>/dev/null

cat .gitignore | awk "/^[.\*]/" | sed 's/"/"\\""/g;s/.*/"&"/' |  xargs -E '' -I{} git rm -rf --cached {}
git rm -rf --cached *.pyc

./maketree.py
shopt -s extglob
#./go
git add *
git add -u :/
git commit -a -m "$1"
git push origin master
