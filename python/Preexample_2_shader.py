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
import sys
if sys.version_info<(3,):
    from itertools import imap as map
# END PYTHON 2/3 COMPATIBILITY BOILERPLATEion
'''
This code is based on
http://pyopengl.sourceforge.net/context/tutorials/shader_1.html
'''

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

from OpenGLContext import testingcontext
BaseContext = testingcontext.getInteractive()

from OpenGLContext.arrays import *

class TestContext(BaseContext):
    """Creates a simple vertex shader..."""
    def OnInit( self ):
        VERTEX_SHADER = shaders.compileShader("""#version 120
        void main() { gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex; }""", GL_VERTEX_SHADER)
        FRAGMENT_SHADER = shaders.compileShader("""#version 120
        void main() { gl_FragColor = vec4( 0, 1, 0, 1 ); }""", GL_FRAGMENT_SHADER)
        self.shader = shaders.compileProgram(VERTEX_SHADER,FRAGMENT_SHADER)
        self.vbo = vbo.VBO( array( [ [ 0, 1, 0 ], [ -1,-1, 0 ], [ 1,-1, 0 ], [ 2,-1, 0 ], [ 4,-1, 0 ], [ 4, 1, 0 ], [ 2,-1, 0 ], [ 4, 1, 0 ], [ 2, 1, 0 ], ],'f') )

    def Render( self, mode):
        """Render the geometry for the scene."""
        shaders.glUseProgram(self.shader)
        try:
            self.vbo.bind()
            try:
                glEnableClientState(GL_VERTEX_ARRAY)
                glVertexPointerf( self.vbo )
                glDrawArrays(GL_TRIANGLES, 0, 9)
            finally:
                self.vbo.unbind()
                glDisableClientState(GL_VERTEX_ARRAY)
        finally:
            shaders.glUseProgram(0)

if __name__ == "__main__":
    TestContext.ContextMainLoop()
