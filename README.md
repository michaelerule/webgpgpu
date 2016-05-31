# webgpgpu

Have you ever wanted to simulate a two-dimensional PDE or integro-differential equation on the GPU? Do you envy the reaction diffusion simulators of
[pnmeila](
https://www.chromeexperiments.com/experiment/gray-scott-simulation),
[Felix Woitzel] (http://webglplayground.net/gallery),
[Robin Houston]
(https://bl.ocks.org/robinhouston/ed597847175cf692ecce),
and [Inear]
(http://www.inear.se/patterns/demo1/)?
Have you walked through the [WebGL fundamentals](webgl tutorial 2015) tutorials, only to be frustrated by how much effort was needed to wrest control of indivdual pixels?

If so, you may be interested in exploring the code here.

The OpenGL library is verbose, requiring hundreds of lines of code to get started with PDE simulation on the GPU. While there are examples of using WebGL for GPGPU code ([1](https://github.com/holgerl/webgl-gpgpu)
[2](https://github.com/stormcolor/webclgl)
[3](http://www.vizitsolutions.com/portfolio/webgl/gpgpu/)
[4](http://concord-consortium.github.io/lab/experiments/webgl-gpgpu/webgl.html)
[5](http://pathgl.com/documentation/gpgpu.html)), most of these examples

 - Do not demonstrate tight integration of GPGPU computation and visualization
 - Are incomplete
 - Crash on my machine

This repository is a record of my efforts to learn how to implement GPGPU code in WebGL toward the aim of simulating neural field equations, which are very similar to reaction-diffusion equations. The stated objectives of this project are, in descending order

 1. Provide a backup version control for my own use
 2. Develop WebGL neural field simulations
 3. Develop an API for simplifying WebGL PDE simulation
 4. Develop an API to simplify WebGL

Aims (3) and (4) are redundant to existing projects. In my case, code re-use and debugging other's libraries on my system is more difficult than re-implementing routines from scratch. One must learn the details of WebGL code in order to effectively use and debug such libraries. The same is true if you use the code here. These examples are best used as references from which to code your own implementation, as this will give you a deeper understanding of WebGL and will be more rewarding than reusing this code like a black box.
