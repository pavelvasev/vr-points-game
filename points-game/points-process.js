export function create( vz,opts ) {

    var obj = vz.create_obj({},opts);
    
    obj.setReference( "points" );
  
    // массив состояний точек, каждая точка 0 = ничего, 1 и далее до 254 - идет процесс покраснения, 254 - все, приплыли, 255 - кликнули успели
    var states = []; 
    
    var timerId; // таймер игры
    var ptsobject; // ссылка на объект с точками на которых играем
    
    // список номеров сейчас созревающих точек
    var nowgoing = [];
    
    // надо товарищам извне
    obj.getStates = function() {
      return states;
    }
    
    obj.setPoints = function( pts ) {
      var old = ptsobject;
      ptsobject = pts;
      
      if (old != ptsobject) obj.setup_new_game();
      
      if (ptsobject) {
          var q = ptsobject.positions.length / 3;
          obj.setParam("points-count", q );
      }
      
/*      
      // надо также отсоединяться - когда obj удаляют, и когда pts меняется
      ptsobject.positionsChanged.connect( obj, function() { 
        // рестартуем только если кол-во позиций изменилось
        // хотя формально и это необязательно..
        if (pts.positions.length != ptsposlen)
            obj.setup_new_game();
        } );
*/   
    }
    
    obj.getPoints = function() { return ptsobject; }

    // начинает процесс созревания точки с номером index
    obj.startpoint = function( index ) {
      states[index] = 1;
      nowgoing.push( index );
    }

    obj.step = function() {
      obj.setParam("steps", parseInt( obj.getParam("steps") )+1 );

      // запускаем новую точку с некоторой вероятностью
      var porog = (obj.getParam("appear-speed") || 10) / 100.0;

      if (Math.random() < porog) {
        var index = Math.floor( Math.random() * states.length );
        if (states[index] == 0) {
          obj.startpoint( index );
        }
      }
      
      // проводим процесс покраснения
      var i=0;
      while (i < nowgoing.length) {
        var index = nowgoing[i];
        if (states[index] < 254) {
          states[index]++;
          i++;
        }
        else
        { // приехали - покраснели (на шаге 254) - ну либо человек успел (состояние 255)
          nowgoing.splice( i,1 );
          
          if (states[index] == 254) {
            obj.setParam("missed", obj.getParam("missed")+1 );
            // теперь поищем соседей
            obj.boom( index, states, ptsobject.positions, obj.startpoint );
          }
          else
          {
            // win
            // obj.trigger( "win" );
            // noboom( index, states, ptsobject.positions, startpoint );
            // формально можно сделать obj.noboom и зацепиться для музыки
            // но хочется что-то маленько более универсального или осмысленного
          }
        }
      }
      // закончился процесс покраснения
      obj.setParam( "active", nowgoing.length );
    }

    // производит окраску точек вокруг указанной
    // вход: index - номер точки
    //       positions - координаты точек
    //       states - состояния точек
    // выход: startpt(i) - функция, вызывается для зажигания новых точек
    obj.boom = function( index, states, positions,startpt ) {
      var ox = positions[index*3];
      var oy = positions[index*3+1];
      var oz = positions[index*3+2];
      
      var candidates = [];

      for (var i=0; i < states.length; i++) {
        if (states[i] > 0) continue; // спорно

        var x = positions[3*i];
        var y = positions[3*i+1];
        var z = positions[3*i+2];

        // милый косяк
        //var dist = Math.pow(x-ox,2) + Math.pow( x-oy,2 ) + Math.pow( z-oz,2 ); 
        // норм версия
        var dist = Math.pow(x-ox,2) + Math.pow( y-oy,2 ) + Math.pow( z-oz,2 );
        candidates.push( { dist: dist, i: i } );
      }
      
      var sorted = candidates.sort( function( a,b ) { 
        if (a.dist < b.dist) return -1;
        if (a.dist > b.dist) return 1;
        return 0;
      } );
      
      // надо понять сколько точек мы хотим.. ну пусть две
      var amount_to_boom = 2;
      var ours = sorted.slice( 0, amount_to_boom );
      
      // запускаем засветившихся
      for (var j=0; j<ours.length; j++) startpt( ours[j].i );
    }
  
    obj.user_click_pt = function( index ) {
      //console.log( "user touch pt index=",index, "state=",states[index] );
      if (states[index] > 0 && states[index] < 254) {
          states[index] = 255;
          obj.setParam("catched", obj.getParam("catched")+1 );
      }
    }

    // запускаем новую игру
    obj.setup_new_game = function() {
      cleanup_game();
      if (!ptsobject) return;

      var len = ptsobject.positions.length / 3;
      for (var i=0; i<len; i++)
        states.push( 0 );
      // ок подготовили состояние

      obj.start(); // по идее можно тут это не вызывать.. вдруг там вручную хотят играть?
    }

    obj.start = function() {
      if (timerId) clearInterval( timerId );
      timerId = setInterval( obj.step, 100 );
    }
    
    obj.pause = function() {
      if (timerId) clearInterval( timerId );
      timerId = null;
    }
    
    obj.restart = function() {
      obj.setup_new_game();
    }

    obj.chain("remove",function() {
      cleanup_game();
      this.orig();
    });

    function cleanup_game() {
      if (timerId) clearInterval( timerId );
      timerId = null;
      states = [];
      nowgoing = [];
      
      obj.setParam("steps", 0 );
      obj.setParam("missed", 0 );
      obj.setParam("catched", 0 );
    }

    //////////////////////////////////

    // obj.setup_new_game( opts.pts );

    obj.addCmd( "start new", obj.restart );
    obj.addCmd( "pause", obj.pause );
    obj.addCmd( "resume", obj.start );
    
    obj.addSlider( "appear-speed",10, 0,100,1, function() {} );
    
    var update_rating = function() {
      var a = obj.getParam("missed");
      var b = obj.getParam("catched");
      obj.setParam("rating",b / a );
    }

    obj.addText( "steps",0,function() {} );
    obj.addText( "points-count","...",function() {});
    obj.addText( "active",0,function() {} );
    obj.addText( "missed",0,update_rating );
    obj.addText( "catched",0,update_rating );
    obj.addText( "rating",0, function() {} );


  return obj;
}
