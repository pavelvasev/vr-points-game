/////////////// добавка

export function setup( vz, game ) {
  var obj = game.ns.getChildByName( "interact" ) || game.create_obj( {}, {name:"interact"} );
  var ptsfunc = function() { return game.getPoints(); };
  do_track( obj, ptsfunc );
  obj.chain( "hit",function(v) {
    game.user_click_pt( v );
  });
}

////////////// добавляет отслеживание по клику мышки
// вход  
//   obj - объект вьюзавра, в который добавим параметры
//   ptsfunc - функция которая сообщает объект на котором делается поиск пересечений кликов и т.п.
// выход 
//   вызывает obj.hit( индекс ) где индекс номер примитива (точки)

function do_track( obj,ptsfunc ) {
  var raycaster = new THREE.Raycaster();
  
  var f = function(event) {

    var pts = ptsfunc();
    if (!pts) return;

    var sceneMouse = { x:0, y:0 };
    sceneMouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    sceneMouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
    
    raycaster.params.Points.threshold = 0.5;
    raycaster.setFromCamera( sceneMouse, threejs.camera );
    var intersects = raycaster.intersectObject( pts.sceneObject, true );
    
    for (var i=0; i<intersects.length; i++) {
      var r = intersects[i];
      var curPt = r ? r.index : -1;
      obj.hit( curPt );
   }
  }

  threejs.renderer.domElement.addEventListener( "click", f );
  
  obj.chain("remove", function() {
    threejs.renderer.domElement.removeEventListener( "click", f );
    this.orig();
  });

  return obj;
}