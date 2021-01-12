import krako_setup from "./krako.js";
import points_game_setup from "./points-game/init.js";

krako_setup( vz );
points_game_setup( vz );

var krako = vz.create_obj_by_type( {type: "krakozabra",manual:true } );
var game = vz.create_obj_by_type( {type: "points-game"} );
game.setParam( "points", vz.get_path( krako.ns.getChildren()[0] ) );

vz.restoreFromHash();

game.restart();