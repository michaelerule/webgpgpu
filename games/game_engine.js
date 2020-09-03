

/*

- Iterate game state
- Compute tile values
- Render tiles

Requirement determination for a kernel
 - Figure out all symbols used
 - Globals are straightforward
 - Fields 


A "global" is a variable that has one state for the whole game.
A "field" is a variable that has one state per tile.

There is a single compute_tile_values function. 
Implicitly: tile value must be stored in a vec4; 
Ideally: there are only 256 tiles

compute_tiles(game_state) {
    my_state = get_local_game_state();
    my_tile  = compute_tile_value(my_state);

    // Required variables are unpacked here
}

 */
