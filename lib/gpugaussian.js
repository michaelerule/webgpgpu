
/**
 * Initialize a Guassian convolution kernel
 * @param sigma {float} - positive float value for standard deviation
 * @return {Float32Array} - fields width and radius are stored too.
 */
function createGaussianConvolution(sigma,normalized,radius) {
    // Prepare kernel
    radius = radius || Math.ceil(3*sigma);
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
    +"  vec2  scale = 1./vec2(W,H);\n"
    +"  vec4  c     = texture2D(data,XY*scale)*weights[0];\n"
    +"  float sum   = weights[0];\n"
    +"  for (int i=1; i<=K; i++) {\n"
    +"    c += (\n"
    +"      texture2D(data,(XY+vec2( i*(1-AX), i*AX))*scale)+\n"
    +"      texture2D(data,(XY+vec2(-i*(1-AX),-i*AX))*scale))\n"
    +"      * weights[i];\n"
    +"    sum += 2.*weights[i];\n"
    +"  }\n"
    +"  c/=sum;\n"
    +"  gl_FragColor = floor(255.*c+.5)/255.;\n"
    +"}\n";

    var kernel = createGaussianConvolution(sigma);
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



/**
 * Creates a program to perform Gaussian blur on the GPU
 * @param gl {WebGL context}
 * @param sigma {number} - kernel standard deviation in pixels
 */
function GPUGaussianMultiBlur(gl,sigmaR,sigmaG,sigmaB,sigmaA) {

    var __gpu_blur_kernel__ =
     "// Gaussian blue in X or Y directions\n"
    +"// Variables W, H, K, AX #defined when shader compiled\n"
    +"#define XY gl_FragCoord.xy\n"
    +"uniform   sampler2D data;\n"
    +"uniform   vec4      weights[K+1];\n"
    +"void main() {\n"
    +"  vec2  scale = 1./vec2(W,H);\n"
    +"  vec4  c     = texture2D(data,XY*scale)*weights[0];\n"
    +"  vec4  sum   = weights[0];\n"
    +"  for (int i=1; i<=K; i++) {\n"
    +"    c += (\n"
    +"      texture2D(data,(XY+vec2( i*(1-AX), i*AX))*scale)+\n"
    +"      texture2D(data,(XY+vec2(-i*(1-AX),-i*AX))*scale))\n"
    +"      * weights[i];\n"
    +"    sum += 2.*weights[i];\n"
    +"  }\n"
    +"  c/=sum;\n"
    +"  gl_FragColor = floor(255.*c+.5)/255.;\n"
    +"}\n";

    sigmaR = sigmaR || 1;
    sigmaG = sigmaG || sigmaR;
    sigmaB = sigmaB || sigmaG;
    sigmaA = sigmaA || sigmaB;
    var sigma  = Math.max(sigmaR,sigmaG,sigmaB,sigmaA);
    var radius = Math.ceil(3*sigma);
    var kernelR = createGaussianConvolution(sigmaR,true,radius);
    var kernelG = createGaussianConvolution(sigmaG,true,radius);
    var kernelB = createGaussianConvolution(sigmaB,true,radius);
    var kernelA = createGaussianConvolution(sigmaA,true,radius);

    // Pack each channel kernel into array. This will be passed
    // to the shader
    var kernel = new Float32Array(4*(1+radius));
    for (i=0; i<=radius; i++) {
        kernel[i*4+0] = kernelR[i];
        kernel[i*4+1] = kernelG[i];
        kernel[i*4+2] = kernelB[i];
        kernel[i*4+3] = kernelA[i];
    }

    var blur_x = buildRasterProgram(gl,__gpu_blur_kernel__,{
        K  : radius,
        AX : 0
    });
    var blur_y = buildRasterProgram(gl,__gpu_blur_kernel__,{
        K  : radius,
        AX : 1
    });
    function gpu_blur(indata,temp,outdata) {
        outdata = outdata || indata;
        blur_x( {weights:kernel, data:indata}, temp    );
        blur_y( {weights:kernel, data:temp  }, outdata );
    };
    gpu_blur.source = __gpu_blur_kernel__;
    gpu_blur.kernel = kernel;
    return gpu_blur;
}
