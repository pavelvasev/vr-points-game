// Главный игровой объект "Points game"

import * as points_process from "./points-process.js";
import * as colorer from "./colorer.js";
//import * as interact from "./interact.js";
import * as interact1 from "./mouse_clicker.js";
import * as interact2 from "./mouse_clicker_ctrl_key.js";
import * as interact3 from "./xr_clicker.js";
import * as soundes from "./sounds/init.js";

// создает объект "игра в точки"
export function create( vz, opts ) {

  // алгоритм развития точек
  var obj = points_process.create( vz, opts );

  // всякие фичи
  colorer.setup( vz,obj );   // раскраска
  interact1.setup( vz,obj ); // взаимодействие мышка клики
  interact2.setup( vz,obj ); // взаимодействие мышка движ
  interact3.setup( vz,obj ); // взаимодействие вирт реал
  soundes.setup( vz, obj );  // sounds on points state change
  
  // входной параметр "points" это объект
  obj.setReference( "points" );

  // добавляем гуи для выбора объекта "points" - на котором будем играть
  var tmrid;
  obj.addObjectRef( "points","",(o) => !!o.positions, function( path ) {
    if (tmrid) clearTimeout( tmrid );
    tmrid = setTimeout( function() {
      var pts = vz.find_by_path( vz.root,path );
      obj.setPoints(pts);
    },10 ); // чуть чуть подождать - при инициализации path-объект еще могут не создать
  });

  return obj;
}

////////////////////
// регистрация типа во вьюзавре
export default function setup( vz ) {
  vz.addItemType( "points-game","Points game", function( opts ) {
    return create( vz, opts );
  } );
};
