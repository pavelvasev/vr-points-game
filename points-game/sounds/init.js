/////////////// feature

var presets = [
  "none",
  "custom",
  "324612__gokhanbiyik__arp-02.wav",
  "414619__pjcohen__maraca-low-shake-velocity-11.wav",
  "30341__junggle__waterdrop24.wav",
  "43677__stijn__click11.wav",
  "269583__ifrosta__bubble.wav"
];

/// todo: add files hide/show if custom option is selected

export function setup( vz, game ) {
  var obj = game.ns.getChildByName( "sounds" ) || game.create_obj( {}, {name:"sounds"} );
  
  var dir = import.meta.url.substr( 0,import.meta.url.lastIndexOf("/") ) + "/files";
  var active=true;
  
//  obj.addSlider( "active",1,0,1,1,function(v) { active = v; } );

  obj.addSlider( "volume",0.5, 0,1,0.05, function() {} );
  
  obj.addCombo( "appear-sound-preset",0,presets,function(v) {
    if (v > 1) {
      var url = dir + "/" + presets[v];
      obj.setParam("appear-sound",url );
    }
    else
    if (v == 0)
      obj.setParam("appear-sound","" );
  });
//  obj.addFile( "appear-sound","", function() {} );  

  obj.addCombo( "hit-sound-preset",2,presets,function(v) {
    if (v > 1) {
      var url = dir + "/" + presets[v];
      obj.setParam("hit-sound",url );
    }
    else
    if (v == 0)
      obj.setParam("hit-sound","" );
  });
  
//  obj.addFile( "hit-sound","", function() {} );
  
  obj.addCombo( "boom-sound-preset",3,presets,function(v) {
    if (v > 1) {
      var url = dir + "/" + presets[v];
      obj.setParam("boom-sound",url );
    }
      else 
    if (v == 0)
      obj.setParam("boom-sound","" );
  });
//  obj.addFile( "boom-sound","", function() {} );

  obj.addCmd("Sounds at freesound.org",function() {
     window.open("https://freesound.org/");
  });

  ///////////////////////////////////////////////////////

  game.chain("setState", function(index, value) {
//    if (active) {

    if (value == 1) { // appear
      var pos = game.getPos( index );
      var url = obj.getParam("appear-sound"); 
      vz.vis.playSound3d( pos,url,function(sound) {
        sound.setVolume( obj.getParam("volume") );
      } );
    }
    else
    if (value == 254) { // boom
      var pos = game.getPos( index );
      var url = obj.getParam("boom-sound"); 
      vz.vis.playSound3d( pos,url,function(sound) {
        sound.setVolume( obj.getParam("volume") );
      } );
    }
    else
    if (value == 255) { // heal
      var pos = game.getPos( index );
      var url = obj.getParam("hit-sound"); 
      vz.vis.playSound3d( pos,url,function(sound) {
        sound.setVolume( obj.getParam("volume") );
      } );    
    }
//    }
    this.orig( index, value );
  });

}