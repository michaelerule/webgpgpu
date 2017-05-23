function get_color_transforms(perceptron_model,render_cursors) {
    conbrite  = render_cursors.get(3);
    huesat    = render_cursors.get(4);
    
    // Init default (no-op) color transform
    var ctx, cty, ctz, ctw;
    ctx = 1.0;
    cty = ctz = 0.0;
    ctw = 0.0;
    
    if (perceptron_model.do_huesat) {
        // Precompute hue-saturation matrix for performance reasons
        var alpha = huesat.y;
        var beta  = huesat.x;
        var hsa = (0.50-alpha)/1.50;
        var hsb = beta*1.15470053838;
        ctx = ((0.25+alpha)/0.75);
        cty = hsa+hsb;
        ctz = hsa-hsb;
    }
    
    if (perceptron_model.do_conbrite) {
        // Precompute contrast brightness
        var x = Math.tan((conbrite.x*0.5+1.0)*0.78539816339);
        var y = conbrite.y*0.5
        var cbx = x*(1.0-Math.abs(y));
        var cby = (x*y-cbx+1.0)*0.5;
        ctx *= cbx;
        cty *= cbx;
        ctz *= cbx;
        ctw += cby;
    }

    if (perceptron_model.do_invert) {
        // invert color transform (reflect across 0.5)
        ctx = -ctx;
        cty = -cty;
        ctz = -ctz;
        ctw = -ctw+1.0;
    }
    return [ctx,cty,ctz,ctw];
}


function get_effects_parameters(perceptron_model,render_cursors) {
    effects  = render_cursors.get(5);
    gradient = render_cursors.get(2);
    // noise motion-blur gradient controls (x2)
    return [(effects.x+1.0)*0.5,(effects.y+1.0)*0.5,gradient.x,gradient.y]; 
    //return [0,0,gradient.x,gradient.y]; 
    //return [0.5,0.5,gradient.x,gradient.y]; 
}

function get_map_affine_transform(perceptron_model,render_cursors) {
    translate = render_cursors.get(0);
    rotate    = render_cursors.get(1);
    // translation+rotation/scaling
    return [translate.x,translate.y,rotate.x,rotate.y];
}

function make_fullscreen()
{
    // Retrieve a handle to the canvas element
    var canvas = $("maincanvas");
    //var wrap = $("wrapper");
    var w = document.body.clientWidth ;
    var h = document.body.clientHeight;
    //var s = Math.max(w,h);
    canvas.style.width  = w;
    canvas.style.height = h;
    //wrap.style.width  = s;
    //wrap.style.height = s;
    /*
    if (h<s) {
      canvas.style.marginTop = -(s-h)*0.5;
    }
    else if (w<s) {
      canvas.style.marginLeft = -(s-w)*0.5;
    }
    */
}


function bin2String(array) {
  var result = "";
  for (var i = 0; i < array.length; i++) {
    result += String.fromCharCode(parseInt(array[i], 2));
  }
  return result;
}




