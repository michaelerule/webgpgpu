#!/usr/bin/env ipython3

import os, sys

extensions = 'png jpg'.split()
files = set()

print([f for f in os.listdir('./images') if f[-3:].lower() in extensions])

