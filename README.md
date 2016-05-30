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
 - Are incomplete and
 - Crash on my machine, likely because they require GL extensions.

This repository is a record of my efforts to learn how to implement GPGPU code in WebGL toward the aim of simulating neural field equations, which are for most purposes very similar to reaction-diffusion equations. The stated objectives of this project are, in descending order

 1. Provide a backup version control for my own use
 2. Develop WebGL neural field simulations
 3. Develop an API for simplifying WebGL PDE simulation
 4. Develop an API to simplify WebGL

Aims (3) and (4) are redundant to existing projects mentioned. In my case, code re-use and debugging other's libraries on my system is more difficult than re-implementing the routines from scratch. Regardless, one must learn the details of WebGL code in order to effectively use and debug such libraries. The same is likely true if you decide to use any code stored here. The code examples here are best used as references and examples from which to code your own implementations, as this will give you a deeper understanding of WebGL and will be more rewarding than attempting to use any code in this project like a black box.
