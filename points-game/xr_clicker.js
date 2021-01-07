/////////////// добавка

export function setup( vz, game ) {
  var obj = game.ns.getChildByName( "interact" ) || game.create_obj( {}, {name:"interact"} );
  var ptsfunc = function() { return game.getPoints(); };
  do_track( obj, ptsfunc );
  obj.chain( "hit",function(v) {
    game.user_click_pt( v );
  });
}

// добавляет отслеживание в виртуальной реальности

function do_track( obj, ptsfunc ) {
    var raycaster = new THREE.Raycaster();
  
    var orig_qqq = threejs.renderer.xr.setSession;
    var tempMatrix = new THREE.Matrix4();

    function onSelectStart(event) {
      var pts = ptsfunc();
      if (!pts) return;
    
      var controller = event.target;
      tempMatrix.identity().extractRotation(controller.matrixWorld);
      raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);

      // дальше логика как в мышке

      var intersects = raycaster.intersectObject( pts.sceneObject,true );
      //console.log("points game vr intersect found",intersects.length );

      for (var i=0; i<intersects.length; i++) {
        var r = intersects[i];
        var curPt = r ? r.index : -1;
        //console.log("clicked",sceneMouse, "r=",r, "curPt=",curPt );
        //user_touch_pt( curPt );
        obj.hit( curPt );
      }

    };

    threejs.renderer.xr.setSession = function(value) {
      orig_qqq(value);
      if (!value) return;

      var controller1 = threejs.renderer.xr.getController(0);
      controller1.addEventListener("selectstart", onSelectStart);
      var controller2 = threejs.renderer.xr.getController(1);
      controller2.addEventListener("selectstart", onSelectStart);
    }
  }
