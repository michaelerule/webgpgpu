
/**
 * Update game view position if panned/scrolled resized.
 * Update rules: 
 * - If game fits in window, it must remain centered
 * - If game is bigger than window, you can't drag it offscreen
 * - These rules apply to x and y separately
 * 
 * @param gx {number} - x coordinate of new desired game focus point
 * @param gy {number} - y coordinate of new desired game focus point
 */
function update_game_focus(gx,gy) {
    var w = gl.canvas.width;
    var h = gl.canvas.height;
    // Ensure theres no dark regions: game focus cannot be above/below limits
    var xpad = w/2/game_scale;
    gx = Math.min(game_w_px-xpad,Math.max(xpad,gx));      
    var ypad = h/2/game_scale;
    gy = Math.min(game_h_px-ypad,Math.max(ypad,gy)); 
    // Center game if it fits on screen
    if (game_h_px*game_scale<=h) gy=game_h_px/2;
    if (game_w_px*game_scale<=w) gx=game_w_px/2;
    game_focus_x = gx;
    game_focus_y = gy;
}

/** 
 * Update game scale (magnification, zoom level). Limits scale to below
 * max_scale, and prevents zooming out beyond the game size. Accepts a point
 * parameter to zoom in/out around and updates the central focus point 
 * appropriately. 
 * @param s {number} new desired scale
 * @param e {{x:number,y:number}}
 *      x: screen x coordinate to zoom in/out around
 *      y: screen y coordinate to zoom in/out around
 */
function update_game_scale(s,e) {
    var w  = gl.canvas.width;
    var h  = gl.canvas.height;
    var s0 = game_scale;
    //var s1 = Math.min(max_scale,Math.max(Math.min(w/game_w_px,h/game_h_px),s));
    var s1 = Math.min(max_scale,Math.max(min_scale,s));
    game_scale = s1;
    // Keep game focus at mouse position constant. Solve for the change in 
    // the game offset that keeps the mouse position in game the same: 
    // gx2+(ex-w/2)*s2 = gx1+(ex-w/2)*s1 => gx2 = gx1+(ex-w/2)*(s1-s2)
    // gy2-(ey-h/2)*s2 = gy1-(ey-h/2)*s1 => gy2 = gy1+(ey-h/2)*(s2-s1)
    e = e || {x:w/2,y:h/2};
    update_game_focus(
        game_focus_x+(e.x-w/2)*(1/s0-1/s1),
        game_focus_y-(e.y-h/2)*(1/s0-1/s1));
}

/**
 * Adjust the scale of the game view so that it fits entirely on screen, 
 * provided, the required scale is not too small. 
 */
function scale_to_screen() {
    update_game_scale(Math.min(gl.canvas.width/game_w_px,gl.canvas.height/game_h_px));
}

/**
 * Convert mouse event to game coordinates.
 * @param e {MouseEvent} mouse event object
 */
function mouse_to_game_point(e) {
    return {x:game_focus_x+(e.x-gl.canvas.width /2)/game_scale,
            y:game_focus_y-(e.y-gl.canvas.height/2)/game_scale};
}

/**
 * Handle window resized. Adjust view scale and coordinates and redraw.
 */
function resizeCanvas() {
    var w = Math.round(canvas.clientWidth*window.devicePixelRatio );
    var h = Math.round(canvas.clientHeight*window.devicePixelRatio);
    if (canvas.width!=w||canvas.height!=h) {
        canvas.width =w; 
        canvas.height=h;
        update_game_scale(game_scale);
        render();
    }
}

/** 
 * Crate mouse interface and attach it to canvas object 
 */
function create_mouse_interface() {
    // Enclosed state variables
    // isdown is a bool that tracks whether left mouse button is pressed
    // downp is a struct that stores previous screen, game coordinates, used to
    // determine how far the mouse has been dragged
    var isdown=false;
    var downp ={mx:0,my:0,gx:0,gy:0};
    /**
     * Detect mouse clicks. At the moment, just prints coordinate in console.
     * @param e {MouseEvent} mouse event object
     */
    canvas.onclick = function(e) {
        console.log(mouse_to_game_point(e));
    };
    /** 
     * Handle panning of view view mouse dragging. First check that mouse is
     * really still pressed. If it is, update the view position.
     * @param e {MouseEvent} mouse event object
     */
    canvas.onmousemove = function(e) {
        //console.log("moved");
        button_state = e.buttons===undefined?e.which:e.buttons;
        //if (isdown && !(button_state&1)) {
        //    console.log("abnormal end of dragging");
        //}
        isdown &= !!(button_state&1);
        if (isdown) {
            update_game_focus(downp.gx-(e.x-downp.mx)/game_scale,
                              downp.gy+(e.y-downp.my)/game_scale);
            downp = {mx:e.x,my:e.y,gx:game_focus_x,gy:game_focus_y};
            render();
            //console.log("dragged");
            canvas.style.cursor="grabbing";
        } else {
            canvas.style.cursor="default";
        }
    };
    /**
     * Detect mouse pressed. Store location of press in screen and game 
     * coordinates. This will be used to pan view by dragging mouse. 
     * @param e {MouseEvent} mouse event object
     */
    canvas.onmousedown = function(e) {
        downp = {mx:e.x,my:e.y,gx:game_focus_x,gy:game_focus_y};
        isdown = true;
        canvas.style.cursor="grabbing";
    };
    /** 
     * Detect mouse released. End dragging.
     * @param e {MouseEvent} mouse event object
     */
    canvas.onmouseup = function(e) {
        isdown = false;
        //console.log("end dragging");
        canvas.style.cursor="default";
    };
    /** 
     * Detect scroll wheel. This is used to zoom in/out. 
     * @param e {MouseEvent} mouse event object
     */
    canvas.onwheel = function(e) {
        update_game_scale(game_scale/Math.exp(Math.sign(e.deltaY)*0.05),e);
        render();
    };
}

/** 
 * Add the various event listeners to make the user interface work. 
 */
function add_event_listeners() {

    // Bind change and event listeners to canvas
    window.addEventListener('resize', resizeCanvas);

    // Mouse zoom, pan
    create_mouse_interface();

    // Add keyboard navigation
    // Add this as a listener to avoid blocking other key events on page
    // Enable navigation with arrows, or asdw/ASDW, or number pad
    window.addEventListener('keydown', (e)=>{
        switch (e.key) {
            case "ArrowLeft" : case "a": case "A": case "4":
            update_game_focus(game_focus_x-key_pan/game_scale,game_focus_y);
            render(); break;
            case "ArrowRight": case "d": case "D": case "6":
            update_game_focus(game_focus_x+key_pan/game_scale,game_focus_y);
            render(); break;
            case "ArrowDown" : case "s": case "S": case "2":
            update_game_focus(game_focus_x,game_focus_y-key_pan/game_scale);
            render(); break;
            case "ArrowUp"   : case "w": case "W": case "8": 
            update_game_focus(game_focus_x,game_focus_y+key_pan/game_scale);
            render(); break;
            case "PageUp"    : case "q": case "Q": case "9": case "-": case "_":
            update_game_scale(game_scale/key_zoom); 
            render(); break;
            case "PageDown"  : case "e": case "E": case "3": case "+": case "=":
            update_game_scale(game_scale*key_zoom); 
            render(); break;
        }
    });
}
