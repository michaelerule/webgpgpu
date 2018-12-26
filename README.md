# webgpgpu

Have you ever wanted to simulate a two-dimensional PDE or integro-differential equation on the GPU [e.g. 
[pnmeila](https://www.chromeexperiments.com/experiment/gray-scott-simulation),
[Felix Woitzel](http://webglplayground.net/gallery),
[Robin Houston](https://bl.ocks.org/robinhouston/ed597847175cf692ecce),
[Inear](http://www.inear.se/patterns/demo1/)]?
Starting from the [WebGL fundamentals](http://learningwebgl.com/blog/?p=11) tutorials, its not immediately clear how to use WebGL to accelerate two-dimensional texture-based simulations. This library contains a series of walk-through examples, starting from "hello GPU" and slowly building up to simulating partial differential equations.

Other examples of using WebGL for GPGPU code ([1](https://github.com/holgerl/webgl-gpgpu)
[2](https://github.com/stormcolor/webclgl)
[3](http://www.vizitsolutions.com/portfolio/webgl/gpgpu/)
[4](http://concord-consortium.github.io/lab/experiments/webgl-gpgpu/webgl.html)
[5](http://pathgl.com/documentation/gpgpu.html)), most of these examples

This repository is a record of my efforts to learn how to implement GPGPU code in WebGL for simulating neural field equations. The objectives, in descending order

 1. Provide version control for my own use
 2. Develop WebGL neural field simulations
 3. Develop an API for simplifying WebGL PDE simulation
 4. Develop an API to simplify WebGL

Aims (3) and (4) are redundant to existing projects. In my case, code re-use and debugging other's libraries on my system is more difficult than re-implementing routines. One must learn the details of WebGL code in order to effectively use and debug such libraries. The same is true if you use the code here. These examples are best used as references from which to code your own implementation.

[The website contained in this repository can be browsed on Github pages](https://michaelerule.github.io/webgpgpu/)

Unless otherwise specified, media, text, and rendered outputs are licensed under the [Creative Commons Attribution Share Alike 4.0 license](https://choosealicense.com/licenses/cc-by-sa-4.0/) (CC BY-SA 4.0). Source code is licensed under the [GNU General Public License version 3.0](https://www.gnu.org/copyleft/gpl.html) (GPLv3). The CC BY-SA 4.0 is [one-way compatible](https://creativecommons.org/compatiblelicenses) with the GPLv3 license. 
