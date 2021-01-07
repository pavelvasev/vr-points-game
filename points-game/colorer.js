/////////////////////////////////// фича

export function setup( vz, game ) {
  var colorer = create_colorer( vz, game );

  game.chain("step", function() {
    this.orig();
    colorer.perform( game.getStates(), game.getPoints() );
  } );
  // тут ваще треш - добавка требует АПИ - obj.process и obj.getPoints...
  // но она как-бы знает про эти те абстракции.. это же расширитель абстракций..
  // значит он про них знает..

  return colorer;
}

////////////////////////////////// объект раскраски

export function create_colorer( vz, game ) {

    var obj = vz.create_obj( {}, {name: "colorer", parent: game } );
    
    obj.addColor( "start-color","#0000ff",function() {} );
    obj.addColor( "final-color","#330000",function() {} );    

    /// переводит состояние в состояние точек (цвет, радиус..)
    obj.perform = function( states, pts ) {
      if (!pts) return;
      if (!states) return ;
      
      var colors = [];
      
      var startcolor = any2tri( obj.getParam( "start-color" ) );
      
      for (var i=0; i<states.length; i++) {
         var state = states[i];
         if (state == 0) { // ничего
           var fcolor = any2tri( obj.getParam( "start-color" ) );
           //colors.push( 0,0,1 ); // red green blue
           colors.push( fcolor[0], fcolor[1], fcolor[2] );
         }
         else if (state == 254) { // финал
           var fcolor = any2tri( obj.getParam( "final-color" ) );
           //colors.push( 0.1,0,0 );
           colors.push( fcolor[0], fcolor[1], fcolor[2] );
         }
         else if (state == 255) {
           colors.push( 1,1,1 ); // полечили
         }
         else {
           // версия от синего к красному
           //colors.push( Math.sin( state/255.0 ),0,1-Math.sin( state/255.0 ) );

           // версия от стартового к красному
           var targetcolor = [1.0,0.0,0.0];
           var t = 1.5 * state / 255.0;
           if (t > 1.0) t = 1.0; // легкое шаманство чтобы они подольше красными то были

           colors.push( interp( startcolor[0], targetcolor[0], t ) );
           colors.push( interp( startcolor[1], targetcolor[1], t ) );
           colors.push( interp( startcolor[2], targetcolor[2], t ) );
         }
      }
      pts.colors = colors;
      // todo radiuses?
    }



    return obj;
}

//////////// помогайка

function interp( a,b,t ) {
    return a + (b-a)*t;
}
