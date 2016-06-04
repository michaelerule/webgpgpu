
/**
 * Initialize a Guassian convolution kernel
 * @param sigma {float} - positive float value for standard deviation
 * @return {Float32Array} - fields width and radius are stored too.
 */
function createGaussianKernel(sigma,normalized) {
    // Prepare kernel
    var radius = Math.ceil(3*sigma);
    var kernel = new Float32Array(radius+1);
    kernel.radius = radius;
    var sum = 0.;
    for (var i=0; i<=radius; i++)
        sum += kernel[i] = 100*Math.exp(-0.5*Math.pow(i/sigma,2));
    if (normalized) for (var i=0; i<length; i++) kernel[i] /= sum;
    return kernel;
}

/**
 * Creates a program to perform Gaussian blur on the GPU
 * @param gl {WebGL context}
 * @param sigma {number} - kernel standard deviation in pixels
 */
function GPUGaussianBlur(gl,sigma) {

    var __gpu_blur_kernel__ =
     "// Gaussian blue in X or Y directions\n"
    +"// Variables W, H, K, AX #defined when shader compiled\n"
    +"#define XY gl_FragCoord.xy\n"
    +"uniform   sampler2D data;\n"
    +"uniform   float     weights[K+1];\n"
    +"void main() {\n"
    +"  vec2 scale = 1./vec2(W,H);\n"
    +"  vec4 c = texture2D(data,XY*scale)*weights[0];\n"
    +"  float sum = weights[0];\n"
    +"  for (int i=1; i<=K; i++) {\n"
    +"    c += (\n"
    +"      texture2D(data,(XY+vec2( i*(1-AX), i*AX))*scale)+\n"
    +"      texture2D(data,(XY+vec2(-i*(1-AX),-i*AX))*scale))\n"
    +"      * weights[i];\n"
    +"    sum += 2.*weights[i];\n"
    +"  }\n"
    +"  c/=sum;\n"
    +"  gl_FragColor = c;\n"
    +"}\n";

    var kernel = createGaussianKernel(sigma);
    var blur_x = buildRasterProgram(gl,__gpu_blur_kernel__,{
        K  : kernel.radius,
        AX : 0
    });
    var blur_y = buildRasterProgram(gl,__gpu_blur_kernel__,{
        K  : kernel.radius,
        AX : 1
    });
    function gpu_blur(indata,temp,outdata) {
        outdata = outdata || indata;
        blur_x( {weights:kernel, data:indata}, temp    );
        blur_y( {weights:kernel, data:temp  }, outdata );
    };
    gpu_blur.sigma  = sigma;
    gpu_blur.source = __gpu_blur_kernel__;
    gpu_blur.kernel = kernel;
    return gpu_blur;
}
