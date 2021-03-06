/////////////////////////////////// feature

export function setup( vz, game ) {
  var colorer = create_colorer( vz, game );

  game.chain("step", function() {
    this.orig();
    colorer.perform( game.getStates(), game.getPoints() );
  } );
  
  /*
  game.chain("setPoints",function(pts) {
    pts.color = [1,1,1]; // own color of point should be white!
    this.orig();
  });
  */

  return colorer;
}

////////////////////////////////// coloring object

export function create_colorer( vz, game ) {

    var obj = vz.create_obj( {}, {name: "colorer-multi", parent: game } );

    obj.addColor( "start-color","#ffaaaa",function() {} );
    // obj.addColor( "spreading-color","#330000",function() {} );
    obj.addColor( "final-color","#ff0000",function() {} );
    obj.addColor( "unpressed-color","#000000",function() {} );
    obj.addColor( "pressed-color","#ffffff",function() {} );
    
    // generate base colors
    var basecolors = [];
    
    // > Yellow. Green. Blue. Orange. Violet. In an equal ratio in a completely random order. The same level of brightness and saturation.
    var colortable = [ [1,1,0],[0,1,0], [0,0,1], [1,0.5,0], [1,0,1] ];

    for (var i=0; i<1024*8; i++) {
      var j = Math.floor( Math.random() * colortable.length );
      var basec = colortable[j];

      // color is random color in linear range of base*0.5 .... base
      // var color = interp_color( interp_color( [0,0,0], basec, 0.5 ), basec, Math.random() );
      var color = basec;
      
      basecolors.push( color );
    }

    /// transforms state to points object visual attributes
    obj.perform = function( states, pts ) {
      if (!pts) return;
      if (!states) return;
      
      var colors = [];

      var startcolor = any2tri( obj.getParam( "start-color" ) );
      var finalcolor = any2tri( obj.getParam( "final-color" ) );
      var pressedcolor = any2tri( obj.getParam( "pressed-color" ) );
      var unpressedcolor = any2tri( obj.getParam( "unpressed-color" ) );
      
      function pushc( fcolor ) {
        colors.push( fcolor[0], fcolor[1], fcolor[2] );
      }
      
      for (var i=0; i<states.length; i++) {
         var state = states[i];
         if (state == 0) { // nothing state
           pushc( basecolors[ i % basecolors.length] );
         }
         else if (state == 254) { // final state
           pushc( unpressedcolor );
         }
         else if (state == 255) { // cured state
           pushc( pressedcolor );
         }
         else {
           // active process state

           var t = 1.5 * state / 255.0;
           if (t > 1.0) t = 1.0;
           // todo: refactor to spreading-color in range 1..1.5

           colors.push.apply( colors, interp_color( startcolor, finalcolor, t ) );

         }
      }
      pts.colors = colors;
      pts.color = [1,1,1]; // own color of point should be white! to reflect colors array.
      // todo radiuses?
    }

    return obj;
}

//////////// helpers

function interp( a,b,t ) {
    return a + (b-a)*t;
}
function interp_color( a,b,t ) {
    return [ interp(a[0],b[0],t),interp(a[1],b[1],t),interp(a[2],b[2],t) ]
}
