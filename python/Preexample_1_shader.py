#! /usr/bin/env python
import numpy as np
import sys

# Get OpenGL
try:
    from OpenGL.GL     import *
    from OpenGL.GLUT   import *
    from OpenGL.GLU    import *
    from OpenGL.arrays import vbo
    from OpenGL.GL     import shaders
except TypeError as te:
    print('Encountered a TypeError, PyOpenGL is outdated.')
    print('pip is known to install outdated PyOpenGL, this is a bug.')
    print('You can get a newer version by going to the link below')
    print('https://pypi.python.org/pypi/PyOpenGL/3.1.1a1')
    print('(this information current as of June 2016)')
    raise te

try:
    import OpenGLContext
except:
    print('The package OpenGLContext is missing.')
    print('It can be installed via')
    print('sudo pip install PyDispatcher PyVRML97 OpenGLContext')

from OpenGLContext import testingcontext BaseContext = testingcontext.getInteractive()
