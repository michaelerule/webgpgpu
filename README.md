# webgpgpu

Have you ever wanted to simulate a two-dimensional PDE or integro-differential equation on the GPU? Do you envy the reaction diffusion simulators of
[pnmeila](
https://www.chromeexperiments.com/experiment/gray-scott-simulation),
[Felix Woitzel] (http://webglplayground.net/gallery),
[Robin Houston]
(https://bl.ocks.org/robinhouston/ed597847175cf692ecce),
and [Inear]
(http://www.inear.se/patterns/demo1/)?
Have you walked through the [WebGL fundamentals](http://learningwebgl.com/blog/?p=11) tutorials, only to be frustrated by how much effort was needed to wrest control of indivdual pixels? If so, you may be interested in this code.

The OpenGL library is verbose, requiring hundreds of lines of code to get started with PDE simulation on the GPU. While there are examples of using WebGL for GPGPU code ([1](https://github.com/holgerl/webgl-gpgpu)
[2](https://github.com/stormcolor/webclgl)
[3](http://www.vizitsolutions.com/portfolio/webgl/gpgpu/)
[4](http://concord-consortium.github.io/lab/experiments/webgl-gpgpu/webgl.html)
[5](http://pathgl.com/documentation/gpgpu.html)), most of these examples

 - Do not demonstrate tight integration of GPGPU computation and visualization
 - Are incomplete
 - Crash on my machine

This repository is a record of my efforts to learn how to implement GPGPU code in WebGL for simulating neural field equations. The objectives, in descending order

 1. Provide version control for my own use
 2. Develop WebGL neural field simulations
 3. Develop an API for simplifying WebGL PDE simulation
 4. Develop an API to simplify WebGL

Aims (3) and (4) are redundant to existing projects. In my case, code re-use and debugging other's libraries on my system is more difficult than re-implementing routines. One must learn the details of WebGL code in order to effectively use and debug such libraries. The same is true if you use the code here. These examples are best used as references from which to code your own implementation.

[Currently accessible on Drobox since I can't seem to get Github pages to work](https://dl.dropboxusercontent.com/u/4345112/webgpgpu/index.html)
