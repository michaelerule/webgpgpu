#!/usr/bin/python
# -*- coding: UTF-8 -*-
from __future__ import absolute_import
from __future__ import with_statement
from __future__ import division
from __future__ import print_function

'''
Python code to rebuild the index, sice github pages doesn't provide
browsing links automatically
'''

import os,sys
eg = [e for e in os.listdir('./examples/') if '.html' in e]

template = '''
<html>
<head>
</head>
<body>
<h1>Index of WebGPGPU</h1>
%(content)s
</body>
</html>
'''

import locale
from functools import cmp_to_key
import re
def natural_key(string_):
    """See http://www.codinghorror.com/blog/archives/001018.html"""
    return [int(s) if s.isdigit() else s for s in re.split(r'(\d+)', string_)]

content = ""
for root,dirs,files in os.walk('.'):
    if root[:3]=='./.': continue
    if root=='.': continue
    print(root,dirs,files)
    content += "<h2>%s</h2>"%root
    for file in sorted(files,key=natural_key):
        if file[0]=='.': continue
        print(file)
        content+=\
        '<a href="./%(root)s/%(file)s">%(file)s</a><br/>'%globals()

with open("index.html", "w") as index:
    index.write(template%globals())

print("done")
