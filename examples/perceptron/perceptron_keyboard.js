
perceptron_maps = ["z",
"z z / 2",
"z z z / 6",
"z abs(z) / 2",
"e^z+e^(i z)",
"e^z+e^(-i z)",
"e^z+e^(z e^(i pi/4))",
"e^z+e^(z e^(i pi/-4))",
"1/(z e^(i 2 pi/3)+1.4)+1/(z e^(i -2 pi/3)+1.4)+1/(z+1.4)",
"conj(e^z+e^(i z))",
"conj(e^z+e^(-i z))",
"conj(e^z+e^(z e^(i pi/4)))",
"conj(e^z+e^(z e^(i pi/-4)))",
"abs(z) e^(2*i arg(z)) *2",
"z z e^(i abs(z))",
"z z z e^(i abs(z))",
"z e^(i abs(z)) abs(z)",
"sin(z)^2",
"cos(z)^2",
"z z+2 log(z)/pi",
"(z+1)/(z-1)+(z-1)/(z+1)",
"(z+i)/(z-i)+(z-i)/(z+i)"];


function bind_perceptron_key_listener(perceptron_model) {
    document.onkeypress = function(e) {
        var k = (e.which) ? e.which : e.keyCode;
        apply_perceptron_key_event(k, perceptron_model);
        perceptron_model.compile_kernel();
        console.log('Key pressed: '+k);
        //console.log(perceptron_model);
    };
}

/** Takes a key code and a perceptron state model, and modified the state model
  */
function apply_perceptron_key_event(k, P) {
    // Common key codes (not exclusive)
    // # denotes numeric keypad codes (distinct from numbers in a row
    // above QWERTY
    switch (k) {

        case 19: /*PAUSE*/ 
        case 32: /*SPACE*/ 
             if (perceptron_running) stop_perceptron();
             else start_perceptron();
             break;

        case 44: /*,*/ 
            P.motion_blur = Math.max(0.0,P.motion_blur-0.1);
            console.log('less blur');
            break;
        case 46: /*.*/ 
            P.motion_blur = Math.min(1.0,P.motion_blur+0.1);
            console.log('more blur');
            break;
        case 91: /*[*/ 
            P.noise_level = Math.max(0.0,P.noise_level-0.1);
            if (P.noise_level<=0) P.do_noise=false;
            console.log('less noise');
            break;
        case 93: /*]*/ 
            P.noise_level = Math.min(1.0,P.noise_level+0.1);
            if (P.noise_level>0) P.do_noise=true;
            console.log('more noise');
            break;

        case 97 : /*a*/
            P.aux_mode = (P.aux_mode+1)%3;
            break;
        case 65 : /*A*/ break;
        case 98 : /*b*/ 
            P.bounds_mode = (P.bounds_mode+1)%3;
            break;
        case 66 : /*B*/ break;
        case 99 : /*c*/ 
            P.do_conbrite ^= true;
            break;
        case 67 : /*C*/ break;
        case 100: /*d*/ break;
        case 68 : /*D*/ break;
        case 101: /*e*/ 
            break;
        case 69 : /*E*/ break;
        case 102: /*f*/ break;
        case 70 : /*F*/ break;
        case 103: /*g*/ 
            //P.gradient_mode = (P.gradient_mode+1)%3;
            //P.do_gradient = P.gradient_mode!=0;
            break;
        case 71 : /*G*/ break;
        case 104: /*h*/
            P.do_huesat ^= true;
            break;
        case 72 : /*H*/ break;
        case 105: /*i*/ 
            P.do_invert ^= true;
            break;
        case 73 : /*I*/ break;
        case 106: /*j*/ break;
        case 74 : /*J*/ break;
        case 107: /*k*/ break;
        case 75 : /*K*/ break;
        case 108: /*l*/ 
        case 76 : /*L*/ 
            next_image(); // will crash
            break;
        case 109: /*m*/ 
            P.do_mblur ^= true;
            break;
        case 77 : /*M*/ break;
        case 110: /*n*/
            P.do_noise ^= true;
            break;
        case 78 : /*N*/ break;
        case 111: /*o*/ break;
        case 79 : /*O*/ break;
        case 112: /*p*/ break;
        case 80 : /*P*/ break;
        case 113: /*q*/ 
            P.map_index = (P.map_index+1)%(perceptron_maps.length);
            P.map = perceptron_maps[P.map_index];
            break;
        case 81 : /*Q*/ break;
        case 114: /*r*/ 
            P.reflection_mode = (P.reflection_mode+1)%4;
            break;
        case 82 : /*R*/ break;
        case 115: /*s*/ break;
        case 83 : /*S*/ break;
        case 116: /*t*/ break;
        case 84 : /*T*/ break;
        case 117: /*u*/ break;
        case 85 : /*U*/ break;
        case 118: /*v*/ break;
        case 86 : /*V*/ break;
        case 119: /*w*/ 
            P.map_index = (P.map_index+perceptron_maps.length-1)%(perceptron_maps.length);
            P.map = perceptron_maps[P.map_index];
            break;
        case 87 : /*W*/ break;
        case 120: /*x*/ break;
        case 88 : /*X*/ break;
        case 121: /*y*/ break;
        case 89 : /*Y*/ break;
        case 122: /*z*/ break;
        case 90 : /*Z*/ break;


    }
}
