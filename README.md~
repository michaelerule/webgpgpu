# webgpgpu

This library contains a series of walk-through examples, starting from "hello GPU" and slowly building up to simulating spatiotempoal PDEs/IDEs (e.g.
[pnmeila](https://www.chromeexperiments.com/experiment/gray-scott-simulation),
[woitzel](http://webglplayground.net/gallery),
[houston](https://bl.ocks.org/robinhouston/ed597847175cf692ecce),
[inear](http://www.inear.se/patterns/demo1/)).


The aim is to construct minimal examples using only HTML, Javascript and WebGL (no libraries). 

Previews and descriptions of the examples can be found [here](https://michaelerule.github.io/webgpgpu/examples/example_previews/index.html), and the files contained in this repository can be browsed on [Github pages](https://michaelerule.github.io/webgpgpu/).

Explore project contents in browser: [examples](https://michaelerule.github.io/webgpgpu/examples/index.html) and (not quite) [games](https://michaelerule.github.io/webgpgpu/games/index.html).

Other examples of using WebGL for GPGPU code can be found here ([1](https://github.com/holgerl/webgl-gpgpu)
[2](https://github.com/stormcolor/webclgl)
[3](http://www.vizitsolutions.com/portfolio/webgl/gpgpu/)
[4](http://concord-consortium.github.io/lab/experiments/webgl-gpgpu/webgl.html)
[5](http://pathgl.com/documentation/gpgpu.html)).

# Basic examples

Basic examples that set up a two-dimensional rendering environment within the 3D WebGL framework, and then illustrate
basic rendering techniques like rendering from a texture, pixel operations like blurring, and random noise.
<table>
<tr><td width='120'><a href="./examples/Example_1_hello_gpu.html">
<img src='./examples/example_previews/example1.png' width='100'/>
</a></td>
<td><a href="./examples/Example_1_hello_gpu.html"><h4>Example 1: "Hello GPU"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_1_hello_gpu.html">run in browser</a>)
<break/>
Set up an HTML Canvas for webGLM rendering, and render a simple coordinate-dependent image.
</td></tr>
<tr><td><a href="./examples/Example_2_colormap_texture.html"><img src='./examples/example_previews/example2.png' width='100'/></a></td>
<td><a href="./examples/Example_2_colormap_texture.html"><h4>Example 2: "1D texture"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_2_colormap_texture.html">run in browser</a>)
<break/>
Use a one-dimensional texture as a colormap. 
Eventually, we will also render to texture to store rendering and simulation data between frames.
</td></tr>
<tr><td><a href="./examples/Example_3_use_two_textures.html"><img src='./examples/example_previews/example3.png' width='100'/></a></td>
<td><a href="./examples/Example_3_use_two_textures.html"><h4>Example 3: "Use two textures"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_3_use_two_textures.html">run in browser</a>)
<break/>
Basic example loading two different colormaps as textures. 
Using multiple textures is important for rendering more complex systems, which may require more state than a single
red-green-blue texture can store.
</td></tr>
<tr><td><a href="./examples/Example_4_basic_blur.html"><img src='./examples/example_previews/example4.png' width='100'/></a></td>
<td><a href="./examples/Example_4_basic_blur.html"><h4>Example 4: "Pixel blur"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_4_basic_blur.html">run in browser</a>)
<break/>
Simple vertical blur by averaging nearyby pixel values.
an image. 
</td></tr>
<tr><td><a href="./examples/Example_5_gaussian_blur_separable.html"><img src='./examples/example_previews/example5.png' width='100'/></a></td>
<td><a href="./examples/Example_5_gaussian_blur_separable.html"><h4>Example 5: "Separable Gaussian blur"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_5_gaussian_blur_separable.html">run in browser</a>)
<break/>
We can compute larger Gaussian blurs quickly by blurring first horizontally and vertically. 
</td></tr>
<tr><td><a href="./examples/Example_6_multi_blur.html"><img src='./examples/example_previews/example6.png' width='100'/></a></td>
<td><a href="./examples/Example_6_multi_blur.html"><h4>Example 6: "Multi-color blur"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_6_multi_blur.html">run in browser</a>)
<break/>
For simulations, different colors might represent different quantities. This Gaussian blur kernel treats each
color channel separately, blurring them by different amounts.
</td></tr>
<tr><td><a href="./examples/Example_7_pseudorandom_noise.html"><img src='./examples/example_previews/example7.png' width='100'/></a></td>
<td><a href="./examples/Example_7_pseudorandom_noise.html"><h4>Example 7: "Noise"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_7_pseudorandom_noise.html">run in browser</a>)
<break/>
Stochastic simulations and animations require a source of noise. This kernel approximates uniform pseudorandom number
generation, in a fast ad-hoc way that is suitable for visualizations (not not guaranteed to be random enough for other
uses).
</td></tr>
<tr><td><a href="./examples/Example_8_spatiotemporal_noise.html"><img src='./examples/example_previews/example8.png' width='100'/></a></td>
<td><a href="./examples/Example_8_spatiotemporal_noise.html"><h4>Example 8: "Spatiotemporal noise"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_8_spatiotemporal_noise.html">run in browser</a>)
<break/>
This example combines driving noise with repeated Gaussian blurs to create a spatiotemporal noise effect. 
</td></tr>
<tr><td><a href="./examples/Example_11_bitops.html"><img src='./examples/example_previews/example11.png' width='100'/></a></td>
<td><a href="./examples/Example_11_bitops.html"><h4>Example 11: "Bitops"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_11_bitops.html">run in browser</a>)
<break/>
The minimal subset of WebGL doesn't explicitly support storing/reading unsigned integer types from textures, or bit operations. However, most reasonable hardware and WebGL implementations should implicitly store color texture data as 8-bit integers. This kernel accesses this color data as if it were uint8, even though it is technically a float. 
</td></tr>
</table>


# Image processing examples
These examples demonstrate basic image processing: color adjustments and blur/sharpen.
<table>
<tr><td width='120'><a href="./examples/Example_15_load_image.html"><img src='./examples/example_previews/example15.png' width='100'/></a></td>
<td><a href="./examples/Example_15_load_image.html"><h4>Example 15: "Load image"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_15_load_image.html">run in browser</a>)
<break/>
This example loads an image resource, copies it to a texture, and displays it on screen.
</td></tr>
<tr><td><a href="./examples/Example_16_hue_rotation.html"><img src='./examples/example_previews/example16.png' width='100'/></a></td>
<td><a href="./examples/Example_16_hue_rotation.html"><h4>Example 16: "Linear hue rotation"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_16_hue_rotation.html">run in browser</a>)
<break/>
This example demonstrates hue rotation as an optimize linear transformation using hue and chroma.
</td></tr>
<tr><td><a href="./examples/Example_17_blur_image.html"><img src='./examples/example_previews/example17.png' width='100'/></a></td>
<td><a href="./examples/Example_17_blur_image.html"><h4>Example 17: "Image blur"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_17_blur_image.html">run in browser</a>)
<break/>
Apply iterated Guassian blur to image data.
</td></tr>
<tr><td><a href="./examples/Example_17_unsharp_mask.html"><img src='./examples/example_previews/example17b.png' width='100'/></a></td>
<td><a href="./examples/Example_17_unsharp_mask.html"><h4>Example 17b: "Unsharp mask"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_17_unsharp_mask.html">run in browser</a>)
<break/>
Apply iterated unsharp mask to image data.
</td></tr>
<tr><td><a href="./examples/Example_19_contrast_and_brightness.html"><img src='./examples/example_previews/example19.png' width='100'/></a></td>
<td><a href="./examples/Example_19_contrast_and_brightness.html"><h4>Example 19: "Brightness and contrast"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_19_contrast_and_brightness.html">run in browser</a>)
<break/>
Adjust brightness and contrast of image based on mouse location.
</td></tr>
<tr><td><a href="./examples/Example_20_color_matrix_hue_and_saturation.html"><img src='./examples/example_previews/example20.png' width='100'/></a></td>
<td><a href="./examples/Example_20_color_matrix_hue_and_saturation.html"><h4>Example 19: "Hue and saturation"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_20_color_matrix_hue_and_saturation.html">run in browser</a>)
<break/>
Adjust hue and saturation of image based on mouse location.
</td></tr>
</table>


# Technical experiments
These examples test a couple of technical tricks that might be useful in rendering. 
<table>
<tr><td width='120'><a href="./examples/Example_25_gaussian_noise.html"><img src='./examples/example_previews/example25.png' width='100'/></a></td>
<td><a href="./examples/Example_25_gaussian_noise.html"><h4>Example 25: "Gaussian noise"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_25_gaussian_noise.html">run in browser</a>)
<break/>
Convert uniform random numbers to Gaussian random numbers with mean and variance specified by the mouse location. 
</td></tr>
<tr><td><a href="./examples/Example_21_incremental_mipmaps.html"><img src='./examples/example_previews/example21.png' width='100'/></a></td>
<td><a href="./examples/Example_21_incremental_mipmaps.html"><h4>Example 21: "Recursive mipmaps"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_21_incremental_mipmaps.html">run in browser</a>)
<break/>
Mipmaps are successively downsampled copies of a texture that are used to avoid aliasing. The are usually computed once, with a program is initialized. However, if we are rendering to texture data, and then want to use that data as a texture to color 3D objected, we may want to updates mipmaps. Rather than update all texture resolutions at once, however, we successively downsample on each iteration. meaning that lower-resolution mipmaps are updated later.
</td></tr>
<tr><td><a href="./examples/Example_26_statistical_mipmap.html"><img src='./examples/example_previews/example26.png' width='100'/></a></td>
<td><a href="./examples/Example_26_statistical_mipmap.html"><h4>Example 25: "Statistical mipmaps"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_26_statistical_mipmap.html">run in browser</a>)
<break/>
Texture mipmaps compute the average texture color over a region, by downsampling. What if we'd like the average statistics, like mean and variance, over a given region? 
</td></tr><tr><td><a href="./examples/Example_23_hello_particles.html"><img src='./examples/example_previews/example23.png' width='100'/></a></td>
<td><a href="./examples/Example_23_hello_particles.html"><h4>Example 25: "Hello particles"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_23_hello_particles.html">run in browser</a>)
<break/>
Particle systems are useful in many-body simulations. This example uses texture data for particle location, and also renders each particle differently based on an offset into a texture.
</td></tr>
<tr><td><a href="./examples/Example_13_mouse_tracking.html"><img src='./examples/example_previews/example13.png' width='100'/></a></td>
<td><a href="./examples/Example_13_mouse_tracking.html"><h4>Example 13: "Julia set"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_13_mouse_tracking.html">run in browser</a>)
<break/>
Track the mouse location and render a Julia set using video feedback. 
</td></tr>
</table>


# Psychedelic
These examples are "Just for fun"
<table>
<tr><td width='120'><a href="./examples/Example_9_quadratic_feedback.html"><img src='./examples/example_previews/example9.png' width='100'/></a></td>
<td><a href="./examples/Example_9_quadratic_feedback.html"><h4>Example 9: "Quadratic feedback"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_9_quadratic_feedback.html">run in browser</a>)
<break/>
Quadratic video feedback example of iterated conformal maps which can be used to render Julia set fractals. 
</td></tr>
<tr><td><a href="./examples/Example_10_logarithmic_feedback.html"><img src='./examples/example_previews/example10.png' width='100'/></a></td>
<td><a href="./examples/Example_10_logarithmic_feedback.html"><h4>Example 10: "Logarithmic feedback"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_10_logarithmic_feedback.html">run in browser</a>)
<break/>
Iterated logarithmic video feedback. The logarithmic map can be used to approximate the coordinate mapping from visual cortex to retinal (or "subjective") coordinates, which explains why some visual hallucinations take on a tunnel appearance. <i>(Ermentrout GB, Cowan JD. A mathematical theory of visual hallucination patterns. Biological cybernetics. 1979 Oct 1;34(3):137-50.)</i>
</td></tr>
<tr><td><a href="./examples/Example_18_psychedelic_mask.html"><img src='./examples/example_previews/example18b.png' width='100'/></a></td>
<td><a href="./examples/Example_18_psychedelic_mask.html"><h4>Example 18: "Psychedelic filter"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_18_psychedelic_mask.html">run in browser</a>)
<break/>
Applies a combination of blues, sharpening, and hue rotations for a psychedelic image effect.
</td></tr>
<tr><td><a href="./examples/Example_14_complex_arithmetic.html"><img src='./examples/example_previews/example14b.png' width='100'/></a></td>
<td><a href="./examples/Example_14_complex_arithmetic.html"><h4>Example 14: "Complex arithmetic"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_14_complex_arithmetic.html">run in browser</a>)
<break/>
Interpret length-2 vectors as complex numbers using a collection of macros. More sophisticated video feedback example. 
</td></tr>
<tr><td><a href="./examples/Example_27_quasizoom.html"><img src='./examples/example_previews/example27.png' width='100'/></a></td>
<td><a href="./examples/Example_27_quasizoom.html"><h4>Example 17: "Quasicrystal 1"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_27_quasizoom.html">run in browser</a>)
<break/>
An infinitely-zooming quasicrystal visualization with Shepard tone accompaniment, black and white.
</td></tr>
<tr><td><a href="./examples/Example_28_quasizoom_color.html"><img src='./examples/example_previews/example28.png' width='100'/></a></td>
<td><a href="./examples/Example_28_quasizoom_color.html"><h4>Example 17: "Quasicrystal 2"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/Example_28_quasizoom_color.html">run in browser</a>)
<break/>
An infinitely-zooming quasicrystal visualization with Shepard tone accompaniment, color.
</td></tr>
</table>



# Neural field simulations
Using only 8-bit color data to store state values means that these neural field simulations are only approximate. Some dynamical behaviors won't appear at parameters quite qhere the theory predicts. However, most qualitative behaviors are preserved.
<table>
<tr><td width='120'><a href="./examples/wilson_cowan_examples/WC_Example_1_basic.html"><img src='./examples/example_previews/WCexample1.png' width='100'/></a></td>
<td><a href="./examples/wilson_cowan_examples/WC_Example_1_basic.html"><h4>Example 1: "Wilson-Cowan equations"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/wilson_cowan_examples/WC_Example_1_basic.html">run in browser</a>)
<break/>
Spiral wave emerge in a Wilson-Cowan neural field model. The lack of platform-specified rounding in WebGL means that these patteerns to not appear correcrtly on all devices (see example 2). 
</td></tr>
<tr><td><a href="./examples/wilson_cowan_examples/WC_Example_2_platform_independent_rounding.html"><img src='./examples/example_previews/WCexample2.png' width='100'/></a></td>
<td><a href="./examples/wilson_cowan_examples/WC_Example_2_platform_independent_rounding.html"><h4>Example 2: "Platform independent rounding"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/wilson_cowan_examples/WC_Example_2_platform_independent_rounding.html">run in browser</a>)
<break/>
Spiral wave emerge in a Wilson-Cowan neural field model. Additional macros enforce a platform-independent rounding rule, allowing for consistent behavior across devices.
</td></tr>
<tr><td><a href="./examples/wilson_cowan_examples/WC_Example_3_wilson_cowan_center_surround.html"><img src='./examples/example_previews/WCexample3.png' width='100'/></a></td>
<td><a href="./examples/wilson_cowan_examples/WC_Example_3_wilson_cowan_center_surround.html"><h4>Example 3: "Center-surround"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/wilson_cowan_examples/WC_Example_3_wilson_cowan_center_surround.html">run in browser</a>)
<break/>
Center surround "mexican hat" style coupling leads to the emergence of striped patterns in a Wilson-Cowan system.
</td></tr>
<tr><td><a href="./examples/wilson_cowan_examples/WC_Example_4_periodic_forcing.html"><img src='./examples/example_previews/WCexample4b.png' width='100'/></a></td>
<td><a href="./examples/wilson_cowan_examples/WC_Example_4_periodic_forcing.html"><h4>Example 4: "Flicker"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/wilson_cowan_examples/WC_Example_4_periodic_forcing.html">run in browser</a>)
<break/>
Turing patterns induced in a Wilson-Cowan system by periodic forcing. 
<i>(Rule M, Stoffregen M, Ermentrout B. <a href="https://journals.plos.org/ploscompbiol/article?id=10.1371/journal.pcbi.1002158">A model for the origin and properties of flicker-induced geometric phosphenes.</a> PLoS computational biology. 2011 Sep 29;7(9):e1002158.)</i>
</td></tr>
<tr><td><a href="./examples/wilson_cowan_examples/WC_Example_5_logarithmic_retinal_map.html"><img src='./examples/example_previews/WCexample5.png' width='100'/></a></td>
<td><a href="./examples/wilson_cowan_examples/WC_Example_5_logarithmic_retinal_map.html"><h4>Example 5: "Retinotopic map"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/wilson_cowan_examples/WC_Example_5_logarithmic_retinal_map.html">run in browser</a>)
<break/>
Use the logarithmic map to approximate how a Wilson-Cowan pattern forming system might appear in subjective coordinates, if the emergent waves were to occur in visual cortex. <i>(Ermentrout GB, Cowan JD. <a href="https://link.springer.com/article/10.1007/BF00336965">A mathematical theory of visual hallucination patterns.</a> Biological cybernetics. 1979 Oct 1;34(3):137-50.)</i>
</td></tr>
<tr><td><a href="./examples/wilson_cowan_examples/WC_Example_9_wilson_cowan_fix_point_16_bit.html"><img src='./examples/example_previews/WCexample9.png' width='100'/></a></td>
<td><a href="./examples/wilson_cowan_examples/WC_Example_9_wilson_cowan_fix_point_16_bit.html"><h4>Example 9: "16-bit precision"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/wilson_cowan_examples/WC_Example_9_wilson_cowan_fix_point_16_bit.html">run in browser</a>)
<break/>
Use two color components, with 8-bits each, to implement 16-bit fixed-point storage of simulation states. This leads to a slightly more accurate numerical integration.
</td></tr>
<tr><td><a href="./examples/wilson_cowan_examples/WC_Example_10_fullscreen.html"><img src='./examples/example_previews/WCexample10.png' width='100'/></a></td>
<td><a href="./examples/wilson_cowan_examples/WC_Example_10_fullscreen.html"><h4>Example 10: "Fullscreen"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/wilson_cowan_examples/WC_Example_10_fullscreen.html">run in browser</a>)
<break/>
Full-screen test of a logarithmically-mapped Wilson-Cowan pattern forming system.
</td></tr>
<tr><td><a href="./examples/wilson_cowan_examples/WC_Example_11_acid_trip.html"><img src='./examples/example_previews/WCexample11.png' width='100'/></a></td>
<td><a href="./examples/wilson_cowan_examples/WC_Example_11_acid_trip.html"><h4>Example 11: "Psychedelic"</h4></a>
(<a href="http://michaelerule.github.io/webgpgpu/examples/wilson_cowan_examples/WC_Example_11_acid_trip.html">run in browser</a>)
<break/>
Full-screen test of a logarithmically-mapped Wilson-Cowan pattern forming system. Additional noise and hue rotation effects are added. This is purely a visual demonstration.
</td></tr>
</table>


#  "Games"
Not actually games, but rather explorations of using a tile shader with various cellular automata. The first few examples just set up basic [(1) html](https://michaelerule.github.io/webgpgpu/games/lesson_1_hello_html.html), render a [(2) test canvas](https://michaelerule.github.io/webgpgpu/games/lesson_2_hello_canvas.html), and then check that things are [(3) working](https://michaelerule.github.io/webgpgpu/games/lesson_3_gpgpu_library.html) with the webgpgpu javascript library. The next few examples check that we've configured the [(4) viewport](https://michaelerule.github.io/webgpgpu/games/lesson_4_hello_viewport.html) correctly, and build up [(5) mouse](https://michaelerule.github.io/webgpgpu/games/lesson_5_mouse_panning.html) and [(6) keyboard](https://michaelerule.github.io/webgpgpu/games/lesson_6_keyboard_panning.html) interaction. The remaining examples render fun things like...
<table>
  
<tr><td width='120'><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_7_hello_texture.html"><img src='https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-20-51.png' width='100'/></a></td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_7_hello_texture.html"><h4>Game Example 7: "Hello Texture"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_7_hello_texture.html">run in browser</a>)
<break/>
Load a texture of 256 8×8 tiles from a web resource. We'll use this texture to render pixels of the game not as colors, but as character-like tiles. Mouse and keyboard zoom/pan should work.
</td></tr>
  
<tr><td width='120'><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_8_base64_texture.html"><img src='https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-20-59.png' width='100'/></a></td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_8_base64_texture.html"><h4>Game Example 8: "Base64 Texture"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_8_base64_texture.html">run in browser</a>)
<break/>
Encode texture in javascript source in base64. This side-steps the cross-domain restrictions and makes it slightly less painful to edit the texture locally when developing. Mouse panning and zoom should work.
</td></tr>
  
<tr><td width='120'><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_9_hello_tiles.html"><img src='https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-21-17.png' width='100'/></a></td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_9_hello_tiles.html"><h4>Game Example 9: "Hello Tiles"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_9_hello_tiles.html">run in browser</a>)
<break/>
Get a tile shader working that renders 8x8 tiles at a large size to the screen, with 1:1 matching of canvas to device pixels. 
</td></tr>

<tr><td width='120'><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_10_hello_noise.html"><img src='https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot_2020-10-14_22-15-48.png' width='100'/></a></td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_10_hello_noise.html"><h4>Game Example 10: "Hello Noise"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_10_hello_noise.html">run in browser</a>)
<break/>
Tests random number generation and renders noisy pixels as randomly selected tiles from a texture of 256 8x8 pixel tiles.
</td></tr>
  
<tr><td width='120'><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_11_game_of_life.html"><img src='https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot_2020-10-14_22-16-04.png' width='100'/></a></td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_11_game_of_life.html"><h4>Game Example 11: "Game of Life"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_11_game_of_life.html">run in browser</a>)
<break/>
Conway's game-of-life with a wacky tile shader. Dying cells are skulls. Colors diffuse outward from living areas.
</td></tr>

<tr><td width='120'><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_12_dendrites.html"><img src='https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-17-24.png' width='100'/></a></td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_12_dendrites.html"><h4>Game Example 12: "Dendrites"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_12_dendrites.html">run in browser</a>)
<break/>
Cellular automata performing a sort of diffusion-limited aggregation. Dendrites grow from seed points, avoiding self-intersection. Refresh the page to get one of four tile sets at random.
</td></tr>

<tr><td width='120'><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_13_forest_fire.html"><img src='https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-18-09.png' width='100'/></a></td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_13_forest_fire.html"><h4>Game Example 13: "Forest Fire"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_13_forest_fire.html">run in browser</a>)
<break/>
Forest fire cellular automata. Trees burn, turn to ash, then grass, then shrub, then trees, then burn again. Should be close-ish to criticality, and generate patterns at a range of scales. Same as the model for developmental retinal waves in <a href="https://mrule-intheworks.blogspot.com/2019/02/neural-field-models-for-latent-state.html">this paper</a>.
</td></tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_12_dendrites_variant_3.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-48-10.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_12_dendrites_variant_3.html"><h4>Game Example 12 variant: "Neural Dendrites"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_12_dendrites_variant_3.html">run in browser</a>)
<break/>
Nucleate invisible dendrites from a seed. Around the environment are scattered invisible targets ("synapses"). When a dendrite forms a synapse, it becomes visible. Store a distance-from-seed value in the invisible exploratory dendrite in order to trace a path back to the seed ("cell"). 
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_14_marching_squares_I.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-18-38.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_14_marching_squares_I.html"><h4>Game Example 14: "Marching Squares"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_14_marching_squares_I.html">run in browser</a>)
<break/>
Broken/ugly terrain example with marching squares.
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_15_marching_squares_II.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/terrain_march_squares.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_15_marching_squares_II.html"><h4>Game Example 15: "Marching Squares"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_15_marching_squares_II.html">run in browser</a>)
<break/>
Terrain example with marching squares, less broken.
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_17_marching_boxes.html
">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot_2020-10-14_23-04-03.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_17_marching_boxes.html
"><h4>Game Example 17: "Marching Boxes"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_17_marching_boxes.html">run in browser</a>)
<break/>
Marching boxes shader as described in <a href="https://crawlingrobotfortress.blogspot.com/2020/09/box-drawing-characters-marching-squares.html">this post</a>.
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_17b_marching_boxes_game_of_life.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/mbgol.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_17b_marching_boxes_game_of_life.html"><h4>Game Example 17b: "Marching-Boxes Game of Life"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_17b_marching_boxes_game_of_life.html">run in browser</a>)
<break/>
Conways game of life rendered with the marching boxes shader.
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_17c_marching_boxes_hello_world.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-48-38.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_17c_marching_boxes_hello_world.html"><h4>Game Example 17c: "Map Generator"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_17c_marching_boxes_hello_world.html">run in browser</a>)
<break/>
Generates terrain using a diffusion-smoothed noise-driven height field. Thresholds tis to demarcate land/boundary. Runs a variant of the dendrites cellular automata to add rivers.
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_18_hello_interaction_C_getset_method.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-49-03.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_18_hello_interaction_C_getset_method.html"><h4>Game Example 18: "Read/write data in texture"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_18_hello_interaction_C_getset_method.html">run in browser</a>)
<break/>
Explores several methods of modifying texture data. 
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_18_hello_interaction_A_shader_method.html">Test A</a> 
calls an entire shader to read/edit/write a single pixel; surprisingly faster than reading data back of the GPU (<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_18_hello_interaction_B_test_get_pixels.html">Test B</a>, <a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_18_hello_interaction_C_getset_method.html">C</a>). Don't do use either method!
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_18_hello_interaction_D_compare_benchmarks.html">Test D</a> prints benchmarks to the console
<a href="https://michaelerule.github.io/webgpgpu/games/lesson_18_hello_interaction_D_compare_benchmarks.html">(run it)</a>.
On my system, using a shader with full viewport costs 42 ms; Restricting viewport to single pixel took longer, 131 ms. Reading-writing using memory copy took a whopping 1.3 s. Simply setting a pixel took 11 ms. <i>TLDR: the best method is to retain a copy of the game state on the CPU. Do any editing there, then transfer the changes write-only with a memory copy to the GPU</i>. 
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_19_draw_pipes.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-51-13.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_19_draw_pipes.html"><h4>Game Example 18: Draw Pipes</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_19_draw_pipes.html">run in browser</a>)
<break/>
Mouse interaction lets you edit a map to draw draw roads, pipes, cables. Inspired by classic sim city.
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_20_layered_tile_kernel.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-52-50.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_20_layered_tile_kernel.html"><h4>Game Example 20: "Layered Pipe-Drawing Kernel"</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_20_layered_tile_kernel.html">run in browser</a>)
<break/>
Same as example 19, but now we composite layers atop one another, so pipes/roads/cabels can cross. Still stores all the game state in the RGBA color data of a texture. 
</td>
</tr>
<tr>
<td width='120'>
<a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_21_terrain_kernel.html">
<img src="https://michaelerule.github.io/webgpgpu/games/screenshots/cropped/Screenshot%20at%202020-10-14%2022-53-42.png" width='100'/>
</a>
</td>
<td><a href="https://github.com/michaelerule/webgpgpu/blob/master/games/lesson_21_terrain_kernel.html"><h4>Game Example 21: Layered Terrain Edit</h4></a>
(<a href="https://michaelerule.github.io/webgpgpu/games/lesson_21_terrain_kernel.html">run in browser</a>)
<break/>
This is unfinished. Goal was to make a map editor with different elevations of terrain, rendered using the "marching boxes" shader.
</td>
</tr>
</table>

Unless otherwise specified, media, text, and rendered outputs are licensed under the [Creative Commons Attribution Share Alike 4.0 license](https://choosealicense.com/licenses/cc-by-sa-4.0/) (CC BY-SA 4.0). Source code is licensed under the [GNU General Public License version 3.0](https://www.gnu.org/copyleft/gpl.html) (GPLv3). The CC BY-SA 4.0 is [one-way compatible](https://creativecommons.org/compatiblelicenses) with the GPLv3 license. 


