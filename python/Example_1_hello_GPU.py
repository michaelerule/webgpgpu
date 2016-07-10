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

vertex_shader = '''#version 330
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0, 1);
}
'''

fragment_shader = '''#version 330
void main() {
    gl_FragColor = vec4(
        gl_FragCoord.x<256.?1:0,
        gl_FragCoord.y<256.?1:0,
        mod(floor(gl_FragCoord.y/8.),2.),
        1);
}
'''


SIZE = 512

# Create a new window and GL context
glutInit(sys.argv)
glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB | GLUT_DEPTH)
glutInitWindowSize(SIZE,SIZE)
glutCreateWindow("Hello GPU")

# Set viewport to match frame size
glViewport(0,0,SIZE,SIZE)

# Set clear color and clear (same as in javascript example)
glClearColor(0.5, 0.7, 0.6, 1.0);
glClear(GL_COLOR_BUFFER_BIT);

# Compile the shaders
vertex_shader   = shaders.compileShader(
    vertex_shader,GL_VERTEX_SHADER)
fragment_shader = shaders.compileShader(
    fragment_shader,GL_FRAGMENT_SHADER)
program = shaders.compileProgram(vertex_shader,fragment_shader)

# Activate the compiled shader program
shaders.glUseProgram(program)


# Make a quadrilateral that will serve as the drawing surface
# Remember that WebGL descends from OpenGL for drawing 3D scenes
# Think of this as a minimal 3D model serving as a "screen"
buffer = glGenBuffers(1);
glBindBuffer(GL_ARRAY_BUFFER, buffer);
glBufferData(
    GL_ARRAY_BUFFER,
    float32([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),
    GL_STATIC_DRAW
);
# We also need to manually pass arguments to the shader
positionLocation = glGetAttribLocation(program, "a_position");
glEnableVertexAttribArray(positionLocation);
glVertexAttribPointer(positionLocation, 2, GL_FLOAT, False, 0, 0);

glDrawArrays(GL_TRIANGLES, 0, 6);

'''
indices.bind()
glDrawElements(GL_TRIANGLES, self.num_faces, GL_UNSIGNED_SHORT, None)
indices.unbind()
'''
