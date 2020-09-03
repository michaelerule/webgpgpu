#!/usr/bin/python
# -*- coding: UTF-8 -*-
# BEGIN PYTHON 2/3 COMPATIBILITY BOILERPLATE
from __future__ import absolute_import
from __future__ import with_statement
from __future__ import division
from __future__ import nested_scopes
from __future__ import generators
from __future__ import unicode_literals
from __future__ import print_function

"""
https://stackoverflow.com/questions/2342132/waiting-for-image-to-load-in-javascript
https://stackoverflow.com/questions/6375942/how-do-you-base-64-encode-a-png-image-for-use-in-a-data-uri-in-a-css-file/49475135
https://stackoverflow.com/questions/2395765/store-images-in-javascript-object
"""


import os,sys

supported = {"png","jpg"}
files = [f for f in os.listdir(".") if "." in f and f.split(".")[-1].lower() in supported]

import base64

filetext = """
// Base-64 encoded texture images

base64_textures={
"""

for f in files: 
    b64encoded = base64.b64encode(open(f,"rb").read())
    filetype   = f.split(".")[-1].lower()
    datastring = ("data:image/%s;base64,"%filetype) + b64encoded
    varname    = "_".join(f.split(".")[:-1]).lower()
    for ch in "[]{}()- ":
        varname = varname.replace(ch,"_")
    filetext+="\n    %s:\"%s\","%(varname,datastring)
filetext+="\n};\n"
print(filetext)

with open("base64_encoded_textures.js", "w") as text_file:
    print(filetext, file=text_file)
