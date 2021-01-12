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
  
  var sources = {};
  
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
    
    var gg = obj.addFile( name,"", function(v) {
      //debugger;
      if (v instanceof FileList) {
        var acc = [];
        for (var i=0; i<v.length; i++ ) 
          acc.push( v[i] );
        v = acc;
      }
      if (!Array.isArray(v)) v = [v];
      
      for (var i=0; i<v.length; i++ ) {
          var q = v[i];
          if (q instanceof File) {
            v[i] = URL.createObjectURL( q );
          }
      }
      sources[name] = v;
    } );
    gg.multiple = true;
    gg.preferFiles = true;
    
    obj.setGuiVisible( name, false );
    
    obj.addSlider( name+"-volume",1, 0,1,0.05, function() {} );
  }
  
  addsnd( "appear-sound" );
  addsnd( "hit-sound" );
  addsnd( "boom-sound" );

  obj.addCmd("Sounds at freesound.org",function() {
     window.open("https://freesound.org/");
  });
  obj.addCmd("Sounds at soundbible.com",function() {
     window.open("https://soundbible.com/");
  });
  obj.addCmd("Sounds at bigsoundbank.com",function() {
     window.open("https://bigsoundbank.com/");
  });  
  
  
  

  ///////////////////////////////////////////////////////
  
  function playsnd( name,index ) {
    var volume = obj.getParam("volume");
    var thisvolume = obj.getParam(name+"-volume");
    volume = volume * thisvolume;
    if (volume <= 0) return;
    var pos = game.getPos( index );
    
    var variants = sources[name] || [];
    if (variants.length == 0) return;
    var vnum = Math.floor( Math.random() * variants.length );
    
    //var url = obj.getParam( name );
    var url = variants[ vnum ];
    
    vz.vis.playSound3d( pos,url,function(sound) {
      //if (name == "appear") volume = volume * 0.5;
      sound.setVolume( volume );
      inplay[name] = (inplay[name] || 0)+1;
    },
    function(sound) {
      inplay[name] = (inplay[name] || 0)-1;
    } );
  }

  
  var inplay = {};

  function goif( name,limit,fn ) {
    if (inplay[name] > limit) {
       if (Math.random() > 0.05) {
         // console.log("not playing, inplay name=",name,"val=",inplay[name] );
         return;
        }
    }
    fn();
  }
  
  game.chain("setState", function(index, value) {
    var prev = game.getState(index);
    if (value == 1) { // appear
      goif( "appear-sound",10, function() {
        playsnd( "appear-sound", index );
      });
    }
    else
    if (value == 254 && prev != value) { // boom
      goif( "boom-sound",10, function() {
        playsnd( "boom-sound", index );
      });
    }
    else
    if (value == 255 && prev != value) { // heal
      goif( "hit-sound",5, function() {
        playsnd( "hit-sound", index );
      });
    }
    this.orig( index, value );
  });

}