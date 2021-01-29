import krako_setup from "./krako.js";
import points_game_setup from "./points-game/init.js";

// place your app code in this function
export function create( vz, opts ) {
  krako_setup( vz );
  points_game_setup( vz );
  
  var game = vz.create_obj_by_type( {type: "points-game", name: "points-game"} );
  debugger;
  var krako = vz.create_obj_by_type( {type: "krakozabra",manual:true, parent: game} );
  game.setParam( "points", vz.get_path( krako.ns.getChildren()[0] ) );

  game.restart();
  
  return game;
}