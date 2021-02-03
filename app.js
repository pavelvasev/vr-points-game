import * as krakom from "./krako.js";
import * as points_game from "./points-game/init.js";

// place your app code in this function
export function create( vz, opts ) {

  krakom.setup( vz );
  points_game.setup( vz );
  
  var game = vz.create_obj_by_type( {type: "points-game", name: "points-game", parent: opts.parent } );

  var krako = vz.create_obj_by_type( {type: "krakozabra", parent: game} );
  game.setParam( "points", vz.get_path( krako.ns.getChildren()[0] ) );

  game.restart();
  
  return game;
}