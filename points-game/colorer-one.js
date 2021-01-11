/////////////////////////////////// feature

export function setup( vz, game ) {
  var colorer = create_colorer( vz, game );

  game.chain("step", function() {
    this.orig();
    colorer.perform( game.getStates(), game.getPoints() );
  } );

  return colorer;
}

////////////////////////////////// coloring object

export function create_colorer( vz, game ) {

    var obj = vz.create_obj( {}, {name: "colorer", parent: game } );

    obj.addColor( "base-color","#0000ff",function() {} );
    obj.addColor( "start-color","#0000ff",function() {} );
    // obj.addColor( "spreading-color","#330000",function() {} );
    obj.addColor( "final-color","#ff0000",function() {} );
    obj.addColor( "unpressed-color","#888800",function() {} );
    obj.addColor( "pressed-color","#ffffff",function() {} );

    /// transforms state to points object visual attributes
    obj.perform = function( states, pts ) {
      if (!pts) return;
      if (!states) return;
      
      var colors = [];
      
      var basecolor = any2tri( obj.getParam( "base-color" ) );
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
           pushc( basecolor );
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

           colors.push( interp( startcolor[0], finalcolor[0], t ) );
           colors.push( interp( startcolor[1], finalcolor[1], t ) );
           colors.push( interp( startcolor[2], finalcolor[2], t ) );
         }
      }
      pts.colors = colors;
      // todo radiuses?
    }

    return obj;
}

//////////// helpers

function interp( a,b,t ) {
    return a + (b-a)*t;
}
