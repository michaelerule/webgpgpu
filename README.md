# webgpgpu

This library contains a series of walk-through examples, starting from "hello GPU" and slowly building up to simulating spatiotempoal PDEs/IDEs (e.g.
[pnmeila](https://www.chromeexperiments.com/experiment/gray-scott-simulation),
[woitzel](http://webglplayground.net/gallery),
[houston](https://bl.ocks.org/robinhouston/ed597847175cf692ecce),
[inear](http://www.inear.se/patterns/demo1/))

Previews and descriptions of the examples can be found [here](https://michaelerule.github.io/webgpgpu/examples/example_previews/index.html), and the files contained in this repository can be browsed on [Github pages](https://michaelerule.github.io/webgpgpu/).

#Basic examples

Basic examples that set up a two-dimensional rendering environment within the 3D WebGL framework, and then illustrate
basic rendering techniques like rendering from a texture, pixel operations like blurring, and random noise.
<table>
<tr><td><a href="./examples/Example_1_hello_gpu.html">
<img src='./examples/example_previews/example1.png' height='100'/>
</a></td>
<td><a href="./examples/Example_1_hello_gpu.html"><h4>Example 1: "Hello GPU"</h4></a><break/>
Set up an HTML Canvas for webGLM rendering, and render a simple coordinate-dependent image.
</td></tr>
<tr><td><a href="./examples/Example_2_colormap_texture.html"><img src='./examples/example_previews/example2.png' height='100'/></a></td>
<td><a href="./examples/Example_2_colormap_texture.html"><h4>Example 2: "1D texture"</h4></a><break/>
Use a one-dimensional texture as a colormap. 
Eventually, we will also render to texture to store rendering and simulation data between frames.
</td></tr>
<tr><td><a href="./examples/Example_3_use_two_textures.html"><img src='./examples/example_previews/example3.png' height='100'/></a></td>
<td><a href="./examples/Example_3_use_two_textures.html"><h4>Example 3: "Use two textures"</h4></a><break/>
Basic example loading two different colormaps as textures. 
Using multiple textures is important for rendering more complex systems, which may require more state than a single
red-green-blue texture can store.  
</td></tr>
<tr><td><a href="./examples/Example_4_basic_blur.html"><img src='./examples/example_previews/example4.png' height='100'/></a></td>
<td><a href="./examples/Example_4_basic_blur.html"><h4>Example 4: "Pixel blur"</h4></a><break/>
Vertical blur by averaging nearyby pixel values. This example demonstrate basic recursive/iterated computation on 
an image. 
</td></tr>
<tr><td><a href="./examples/Example_5_gaussian_blur_separable.html"><img src='./examples/example_previews/example5.png' height='100'/></a></td>
<td><a href="./examples/Example_5_gaussian_blur_separable.html"><h4>Example 5: "Separable Gaussian blur"</h4></a><break/>
We can compute larger Gaussian blurs quickly by blurring first horizontally and vertically. 
</td></tr>
<tr><td><a href="./examples/Example_6_multi_blur.html"><img src='./examples/example_previews/example6.png' height='100'/></a></td>
<td><a href="./examples/Example_6_multi_blur.html"><h4>Example 6: "Multi-color blur"</h4></a><break/>
For simulations, different colors might represent different quantities. This Gaussian blur kernel treats each
color channel separately, blurring them by different amounts.
</td></tr>
<tr><td><a href="./examples/Example_7_pseudorandom_noise.html"><img src='./examples/example_previews/example7.png' height='100'/></a></td>
<td><a href="./examples/Example_7_pseudorandom_noise.html"><h4>Example 7: "Noise"</h4></a><break/>
Stochastic simulations and animations require a source of noise. This kernel approximates uniform pseudorandom number
generation, in a fast ad-hoc way that is suitable for visualizations (not not guaranteed to be random enough for other
uses).
</td></tr>
<tr><td><a href="./examples/Example_8_spatiotemporal_noise.html"><img src='./examples/example_previews/example8.png' height='100'/></a></td>
<td><a href="./examples/Example_8_spatiotemporal_noise.html"><h4>Example 8: "Spatiotemporal noise"</h4></a><break/>
This example combines driving noise with repeated Gaussian blurs to create a spatiotemporal noise effect. 
</td></tr>
<tr><td><a href="./examples/Example_11_bitops.html"><img src='./examples/example_previews/example11.png' height='100'/></a></td>
<td><a href="./examples/Example_11_bitops.html"><h4>Example 11: "Bitops"</h4></a><break/>
WebGL doesn't explicitly support unsigned integer types and bit operations. However, most reasonable hardware and WebGL implementations should implicitly store color texture data as 8-bit integers. This kernel accesses this color data as if it were uint8, even though it is technically a float. 
</td></tr>
</table>


Unless otherwise specified, media, text, and rendered outputs are licensed under the [Creative Commons Attribution Share Alike 4.0 license](https://choosealicense.com/licenses/cc-by-sa-4.0/) (CC BY-SA 4.0). Source code is licensed under the [GNU General Public License version 3.0](https://www.gnu.org/copyleft/gpl.html) (GPLv3). The CC BY-SA 4.0 is [one-way compatible](https://creativecommons.org/compatiblelicenses) with the GPLv3 license. 

Other examples of using WebGL for GPGPU code ([1](https://github.com/holgerl/webgl-gpgpu)
[2](https://github.com/stormcolor/webclgl)
[3](http://www.vizitsolutions.com/portfolio/webgl/gpgpu/)
[4](http://concord-consortium.github.io/lab/experiments/webgl-gpgpu/webgl.html)
[5](http://pathgl.com/documentation/gpgpu.html))
