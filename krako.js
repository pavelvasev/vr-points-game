// A strange abstract points figire named `Krakozyabra`

export function foo() {
}

export function setup( vz ) {

function krako( opts ) {

  var obj = vz.create_obj( {},opts );

  var pts = vz.vis.addPoints( obj, "mypts" );
  
  var regen = function() {

    var t = obj.getParam("dlinna") || 10;
    if (t <= 0) t=1;
    var disp = obj.getParam("disp") || 0; // может obj.test уже?
    var df = function() {
      return (Math.random()-0.5)*disp;
    };

    console.log("Regen called",t,disp);
    var coords = [];
    var radius1 = obj.getParam("radius") || 10;
    var radius2 = obj.getParam("radius2") || 10;

    for (var i=0; i<t; i++) {
      // в этой формуле ошибка но эффект прикольный
      var r = radius1 + (radius2-radius1) * (i - t) / t;
      
      for (var a=0; a<360; a++) {
         coords.push( Math.cos(a)*r+df()  );
         coords.push( Math.sin(a)*r+df() );
         coords.push( a/360.0 + i +df() );
      }
    };
    pts.positions = coords;
  };
  
  obj.addSlider( "dlinna",5,0,20,1, regen );
  obj.addSlider( "disp",0,0,2,0.1, regen );
  obj.addSlider( "radius",10,0,20,0.1, regen );
  obj.addSlider( "radius2",10,0,20,0.1, regen );
  
  regen();


  return obj;
}

vz.addItemType( "krakozabra","Krakozabra", krako );

}