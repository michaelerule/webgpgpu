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
http://pyopengl.sourceforge.net/context/tutorials/shader_2.html
'''

from OpenGLContext import testingcontext
BaseContext = testingcontext.getInteractive()

from OpenGL.GL import *
from OpenGL.arrays import vbo
from OpenGLContext.arrays import *
from OpenGL.GL import shaders

class TestContext( BaseContext ):
    """This shader just passes gl_Color from an input array to the fragment shader, which interpolates the values across the face (via a "varying" data type). """

    def OnInit( self ):
        """Initialize the context once we have a valid OpenGL environment"""

        vertex = shaders.compileShader( """ varying vec4 vertex_color; void main() { gl_Position = gl_ModelViewProjectionMatrix * gl_Vertex; vertex_color = gl_Color; }""",GL_VERTEX_SHADER)

        fragment = shaders.compileShader(""" varying vec4 vertex_color; void main() { gl_FragColor = vertex_color; }""",GL_FRAGMENT_SHADER)

        self.shader = shaders.compileProgram(vertex,fragment)

        self.vbo = vbo.VBO(array( [[0,1,0,0,1,0],[-1,-1,0,1,1,0],[1,-1,0,0,1,1],[2,-1,0,1,0,0],[ 4,-1,0,0,1,0],[4,1,0,0,0,1],[2,-1,0,1,0,0],[4,1,0,0,0,1],[2,1, 0,0,1,1],],'f'))

    def Render( self, mode):
        """Render the geometry for the scene."""
        BaseContext.Render( self, mode )

        glUseProgram(self.shader)
        try:
            self.vbo.bind()
            try:
                glEnableClientState(GL_VERTEX_ARRAY); glEnableClientState(GL_COLOR_ARRAY);
                glVertexPointer(3, GL_FLOAT, 24, self.vbo )
                glColorPointer(3, GL_FLOAT, 24, self.vbo+12 )
                glDrawArrays(GL_TRIANGLES, 0, 9)
            finally:
                self.vbo.unbind()
                glDisableClientState(GL_VERTEX_ARRAY); glDisableClientState(GL_COLOR_ARRAY);
        finally:
            glUseProgram( 0 )

if __name__ == "__main__":
    TestContext.ContextMainLoop()
