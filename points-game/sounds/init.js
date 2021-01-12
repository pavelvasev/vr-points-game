/////////////// feature

var dir = import.meta.url.substr( 0,import.meta.url.lastIndexOf("/") ) + "/files/";

var presets = {
  "none":null,
  "custom":null,
  "arp":dir+"324612__gokhanbiyik__arp-02.wav",
  "maracas":dir+"414619__pjcohen__maraca-low-shake-velocity-11.wav",
  "waterdrop":dir+"30341__junggle__waterdrop24.wav",
  "click":dir+"43677__stijn__click11.wav",
  "bubble":dir+"269583__ifrosta__bubble.wav",
  "baraban":dir+"27359__junggle__djembe-loop-13.wav",
  "kick":dir+"131770__bertrof__sub-kick-long.wav",
  "piano":dir+"32158__zin__piano-2-140bpm.wav",
  "guitar":dir+"181425__serylis__guitar-chord.wav",
  "tababa-bamm":dir+"4852__zajo__loop02.wav"
};

/// todo: add files hide/show if custom option is selected

export function setup( vz, game ) {
  var obj = game.ns.getChildByName( "sounds" ) || game.create_obj( {}, {name:"sounds"} );

  obj.addSlider( "volume",0.5, 0,1,0.05, function() {} );
  
  function addsnd( name ) {
  
     obj.addCombo( name+"-preset",0,Object.keys(presets),function(v) {
      if (v > 1) {
        var url = Object.values(presets)[v];
        obj.setParam(name,url );
      }
      else
      if (v == 0)
        obj.setParam(name,"" );
      obj.setGuiVisible( name,v == 1);
    });
    
    obj.addFile( name,"", function(v) {
      if (v instanceof File) {
        obj.setParam( name, URL.createObjectURL( v ) );
      }
    } );
    
    obj.setGuiVisible( name, false );
    
    obj.addSlider( name+"-volume",1, 0,1,0.05, function() {} );
  }
  
  addsnd( "appear-sound" );
  addsnd( "hit-sound" );
  addsnd( "boom-sound" );

  obj.addCmd("Sounds at freesound.org",function() {
     window.open("https://freesound.org/");
  });

  ///////////////////////////////////////////////////////
  
  function playsnd( name,index ) {
    var volume = obj.getParam("volume");
    var thisvolume = obj.getParam(name+"-volume");
    volume = volume * thisvolume;
    if (volume <= 0) return;
    var pos = game.getPos( index );
    var url = obj.getParam( name );
    vz.vis.playSound3d( pos,url,function(sound) {
      //if (name == "appear") volume = volume * 0.5;
      sound.setVolume( volume );
    } );
  }

  
  var instep = {};
  game.chain("step", function() {
    instep = {};
    this.orig.apply( game, arguments );
  });
  function goif( name,limit,fn ) {
    instep[name] = (instep[name] || 0) +1;
    if (instep[name] > limit && Math.random() > 0.05) return;
    fn();
  }
  
  game.chain("setState", function(index, value) {
    var prev = game.getState(index);
    if (value == 1) { // appear
      goif( "appear",10, function() {
        playsnd( "appear-sound", index );
      });
    }
    else
    if (value == 254 && prev != value) { // boom
      goif( "boom",10, function() {
        playsnd( "boom-sound", index );
      });
    }
    else
    if (value == 255 && prev != value) { // heal
      goif( "hit",1, function() {
        playsnd( "hit-sound", index );
      });
    }
    this.orig( index, value );
  });

}