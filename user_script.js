(function script() {
  'use strict';
  var w, h, resx, resy, fontw, fonth, yscale;
  ap37.setTextSize(10);
  w = ap37.getScreenWidth();
  h = ap37.getScreenHeight();
  resx=720;
  resy=1600;
  fontw = resx/w;
  fonth = resy/h;
  yscale=fonth/fontw

  //before init {{{1
  //color2 {{{2
  var color2 = {
    prefPalette:'greenGreen', //select from colour2.palette
    nextPalette: function () {
      let keys = Object.keys(this.palette)
      let i = keys.indexOf(this.prefPalette)

      this.prefPalette = keys[(i+1) % keys.length]
      refresh()
    },
    palette: {
      rainbow: '#9400d3 #4b0082 #0000ff #00ff00 #ffff00 #ff7f00 #ff0000'.split(' '),
      cyber: [
        '#fff69f',//sun
        '#fdd870',//sunrad
        '#d0902f',//redsun
        '#a15501',//earth
        '#351409'//shadow
      ],
      cyberGreen : [
        '#a0ffe3',//light green
        '#65dc95',//green
        '#8d8980',//gray
        '#575267',//violet
        '#222035',//black
      ],
      cyberPlink : [
        '#ff2a6d',//red
        '#d1f7ff',//whiete
        '#05d9e8',//blue
        '#005678',//lite blue
        '#01012b',//black
      ],
      cyberRadiation : [
        '#ff124f',//red
        '#ff00a0',//whiete
        '#fe75fe',//blue
        '#7a04eb',//lite blue
        '#120458',//black
      ],
      greenGreen : [
        '#00ff00',//red
        '#005500',//whiete
        '#00c000',//blue
        '#00ff00',//lite blue
        '#003300',//black
      ]
    }
  }


  //color {{{2
  var color= {
    prefScheme: 'cyber',
    palette: color2.palette ,

    schemeLib: {
      default: { 
        keyboard: {
          activator: ['red','red'],
          key: 'red'
        },
        apps: {
          activator: ['red','teal'],
          name: {
            base: '#999999',
            accent: '#ff0000'
          },
          number: {
            total: '#ffffff',
            loaded: '#ffffff'
          }
        },
        toggle: {
          strict: ['red','teal'],
          auto: ['red','teal']
        }

      },
      cyber: { 
        keyboard: {
          activator: ['blue','teal'],
          get key() {return color2.palette[color2.prefPalette][3]}
        },
        apps: {
          activator: ['blue','teal'],
          name: {
            get base() {return color2.palette[color2.prefPalette][1]},
            get accent(){ return color2.palette[color2.prefPalette][0]},
            get dash(){ return color2.palette[color2.prefPalette][1]}
          },

        },
        toggle: {
          strict: ['blue','teal'],
          auto: ['blue','teal']
        },
        matrix: {
          color: '#00ff00'
        },
        bareText: {
          get myName(){ return color2.palette[color2.prefPalette][0]},
          get battery(){ return color2.palette[color2.prefPalette][1]},
          get time(){ return color2.palette[color2.prefPalette][1]},
          get filter(){ return color2.palette[color2.prefPalette][0]},
          get filterLong(){ return color2.palette[color2.prefPalette][1]},
          get total(){ return color2.palette[color2.prefPalette][3]},
          get eof(){ return color2.palette[color2.prefPalette][0]},
          get clicked(){ return color2.palette[color2.prefPalette][0]},
          get shownApp(){ return color2.palette[color2.prefPalette][3]},
        }

      }



    },
    scheme: function(query) {
      //color.scheme("['user'].keyboard.key")
      var qArr=query.split(/\.(?![^.]*\])/)
      var seq='color.schemeLib'+qArr[0]

      for (var i=1;i<qArr.length;i++){

        seq+= '&& '+seq+'.'+qArr[i]
      }
      var q = 'color.schemeLib'+query

      if (eval(seq)) {
        return eval(q);
      } else {
        var r = q.replace(/\[.*\]/,'["default"]')
        return eval(r);
      }

    },
    setOnOffColor: function (skm,bool,col) {
      color.schemeLib[skm].toggle.strict[bool] = col;
      color.schemeLib[skm].toggle.auto[bool] = col;
      color.schemeLib[skm].keyboard.activator[bool] = col;
      color.schemeLib[skm].apps.activator[bool] = col;
    },
    i: 0,
    getFromP: function (p) {
      return color.palette[p][color.i%color.palette[p].length]
    }
  }
  color.setOnOffColor('cyber',1,color2.palette[color2.prefPalette][2])
  color.setOnOffColor('cyber',0,color2.palette[color2.prefPalette][4])

  //init {{{1 
  //{{{
  function init() {
    //}}}
    ////inits {{{2
    background.init();
    print(5, 0, 'Yeamin Sarder',color.scheme('[color.prefScheme].bareText.myName'));
    battery.init();
    time.init();
    //notifications.init();
    matrix.init();
    keyboard.init();
    keyboardShortcuts.init();
    apps.construct();
    apps.init();
    //markets.init();
    //transmissions.init();
    print(w - 4, h - 2, 'EOF',color.scheme('[color.prefScheme].bareText.eof'));

    //var o=''
    var clicked=0
    // adding buttons {{{2
    var myButton_Load_Apps = myAddButton(5,2,'','','Shown   ',function () { //{{{3
      this.color2 = color.scheme('[color.prefScheme].apps.activator')[apps.isHidden]
      if (apps.isHidden){
        this.text = 'Shown   ';
        apps.isHidden=0;
        apps.isIntercept=1;
        setTimeout(apps.init,1);
      } else {
        this.text = 'Hidden  ';
        apps.isHidden=1;
        apps.isIntercept=1;
        apps.hide();
      }
      //o=apps.isHidden;
    },color.scheme('[color.prefScheme].apps.activator[1]'));
    //myButton_Load_Apps.text = 'Hide_A';
    var myButton_Toggle_Strict = myAddButton(20,2,'','','Strict:ON',function () { //{{{3
      if (apps.isStrict){
        this.text = 'Strict:OFF';
        apps.isStrict = 0;
      } else {
        this.text = 'Strict: ON';
        apps.isStrict = 1;
      }
      this.color2 = color.scheme('[color.prefScheme].toggle.strict')[apps.isStrict]
    },color.scheme('[color.prefScheme].toggle.strict')[apps.isStrict]);
    var myButton_Toggle_Auto = myAddButton(35,2,'','','Auto:ON',function () { //{{{3
      if (apps.isAuto){
        this.text = 'Auto:OFF';
        apps.isAuto = 0;
      } else {
        this.text = 'Auto: ON';
        apps.isAuto = 1;
      }
      this.color2 = color.scheme('[color.prefScheme].toggle.auto')[apps.isAuto]
    },color.scheme('[color.prefScheme].toggle.auto')[apps.isAuto])

    var myButton_Toggle_Matrix = myAddButton(50,2,'','','Matrix:Off',function () { //{{{3
      if (matrix.isOn){
        this.text = 'Matrix:OFF';
        matrix.isOn = 0;
        matrix.onTurnOff();
      } else {
        this.text = 'Matrix: ON';
        matrix.isOn = 1;
        matrix.onTurnOn();
      }
      this.color2 = color.scheme('[color.prefScheme].toggle.auto')[matrix.isOn]
    },color.scheme('[color.prefScheme].toggle.auto')[matrix.isOn])

    var myB_Keyboard = myAddButton(0,h-2,10,h-1,' KEYBOARD ',function () { //{{{3
      var tmp=keyboard.isOn ? 0:1;
      this.color2 = color.scheme('[color.prefScheme].keyboard.activator')[tmp]
      if (keyboard.isOn) {
        keyboard.isOn = 0;
        keyboard.hide();
        apps.bottomMargin = apps.bottomMargin2;
        apps.isIntercept=1;
        setTimeout(apps.init,1);
      } else {
        keyboard.isOn = 1;
        keyboard.draw();
        apps.bottomMargin = h - keyboard.topMargin;
        apps.isIntercept=1;
        setTimeout(apps.init,1);
      }
      //alert(keyboard.layout[0]);
    },color.scheme('[color.prefScheme].keyboard.activator')[keyboard.isOn]);

    //comment next line to disable Keyboard at start
    myB_Keyboard.onclick();
    //prompt()
    //var button1 = myAddButton(11,2,15,3,'Button2','alert("perfect2")','red');

    /*
        for (var i=0;i<h;i++){
            print(w-1,i,'x',color.getFromP(0));
            color.i++;
        }
        */

    //button0.onclick()
    var myB_Command = myAddButton(11,h-2,20,h-1,' COMMAND ',function () { //{{{3
      var input=prompt();
      var output=eval(input);
      if (output) {
        alert(output);
      }
    },color.scheme('[color.prefScheme].keyboard.activator')[keyboard.isOn]);
    //}}}
    //comment next line to disable Keyboard at start
    //myB_Keyboard.onclick();
    // touch {{{2
    ap37.setOnTouchListener(function (x, y) {
      //notifications.onTouch(x, y);
      if (!apps.isHidden) {
        //apps.onTouch(x, y);
      }
      transmissions.onTouch(x, y);
      lineGlitch.onTouch(x, y);
      wordGlitch.onTouch(x, y);
      buttons.onTouch(x, y);
      if (apps.isHidden && y>apps.topMargin && y< h-apps.bottomMargin){
        cursor.putAt(x,y);
      }
      clicked++
      print(0,2,clicked,color.scheme('[color.prefScheme].bareText.clicked'))
      //clearInterval(i1)
    });
  }


  // after init {{{1

  // functions {{{2
    function refresh() { //{{{3
      keyboard.hide(); keyboard.draw()
    }
    function showThisLinesCaption(app) {
      var printlen=app.name.length
      //show caption
      print(apps.captionX,apps.captionY," ".repeat(w))  //clearing
      print(apps.captionX,apps.captionY,app.caption)   //writing caption in whiete
      printCapitalInCaption(apps.captionX,apps.captionY, app.name.substring(0, printlen), app.caption ,color.scheme('[color.prefScheme].apps.name.accent'));

      //reprint the row with bounds
      let listAppsInSameRow = apps.list.filter((app_)=>{return app_.x0==app.x0})
      if (apps.prevRow) {
        //clear the previous row
        apps.prevRow.forEach( (app_,i,a) => {
          apps.printAppNameWithBound(app_,a[i-1] ? a[i-1] : null,a[i+1] ? a[i+1] : null," "," ")  // using fill " " to erase boundery
        })

      }
      apps.prevRow = listAppsInSameRow
      listAppsInSameRow.forEach( (app_,i,a) => {
        apps.printAppNameWithBound(app_,a[i-1] ? a[i-1] : null,a[i+1] ? a[i+1] : null)
      })
        
    }
    var lastZoomStartIndex = -1
    var tout = [0,0,0,0]
    function zoomNearThisApp(app) {
      let zoomLevel = 4
      let startIndex = Math.floor(app.index/zoomLevel)*zoomLevel
      let captions = ""
      for ( var i = 0; i < zoomLevel; i++) {
        let app_i = apps.list[startIndex+i]
        let k=i
        let winW = w/2
        let winH = keyboard.height/2
        let winX = i%2 * winW
        let winY = keyboard.topMargin + Math.floor(i/2) * winH
        let a = new Window(winX,winY,winW,winH,true)
        //if (tout[i]) {clearInterval(tout[i])}
        tout[i] = setTimeout(()=>{a.close()},1000)
        //clearInterval(tout)
        let pos = a.printCenter(app_i.caption,color.scheme('[color.prefScheme].apps.name.base'))
        ap37PrintCapitalInCaption(pos[0],pos[1], app_i.name, app_i.caption ,color.scheme('[color.prefScheme].apps.name.accent'));
        
        a.addButton("",()=>{
          ap37.openApp(apps.list[startIndex+k].id)
          //alert(apps.list[startIndex+k].caption)
          },"#ff0000")
        //captions += apps.list[i].caption + "\n"
      }
      //a.close()
      //alert(captions)
    }


    //class constructors
    function Window(x,y,w,h,useAp37Print){
      this.x = x;
      this.y = y;
      this.w = w;
      this.h = h;
      this.buffer = [];
      this.bufferColors = [];
      for (var hi = 0; hi < h; hi++) {
        this.buffer[hi] = background.buffer[y+hi].substr(x,w)
        this.bufferColors[hi] = []
        for (var wi=0; wi < w; wi++){
          this.bufferColors[hi][wi] = background.bufferColors[y+hi][x+wi]
        }
        if (useAp37Print) {
        ap37.print(x,y+hi,"█".repeat(w),"#111111")
        } else {
        background.printPattern(x,x+w,y+hi)
        }
      }
      this.printbuffer = function () {
        for (var i = 0; i<h; i++) {
          for (var j =0; j<w; j++) {
            ap37.print(this.x+j,this.y+i,this.buffer[i][j],this.bufferColors[i][j])
          }
        }
      }
      this.printMainBuffer = function () {
        for (var i = 0; i<h; i++) {
          for (var j =0; j<w; j++) {
            ap37.print(this.x+j,this.y+i,background.buffer[this.y+i][this.x+j],background.bufferColors[this.y+i][this.x+j])
          }
        }
      }

      this.printCenter = function(text,color) {
        let pos = [
          x+w/2-text.length/2,
          y+h/2
        ]
        ap37.print(pos[0],pos[1],text,color)
        return pos
      }
      this.addButton = function(text,func,color){
        this.button = myAddButton(this.x,this.y,this.x+this.w-1,this.y+this.h-1,text,func,color)
      }
      this.close = function (){
        if (useAp37Print) {
          this.printMainBuffer()
        } else {
        this.printbuffer()
        }
        buttons.del(this.button)
      }

    }


  function myAddButton(x1,y1,x2,y2,text,func,color) { // {{{3
    if (!x2){x2 = x1 + text.length - 1};
    if (!y2){y2 = y1};
    if (text) {
    print(x1,Math.floor((y1+y2)/2),text,color);
    }
    var objButton = {
      x1: x1,
      y1: y1,
      x2: x2,
      y2: y2,
      color: color,
      id: buttons.list.length,
      name: text,
      onclick: func,
      set text(txt) {
        this.name=txt;
        print(x1,y1,txt,this.color);
      },
      set color2(col2) {
        this.color=col2
        print(x1,y1,this.name,col2);

      },
      onTouch: function (x,y) {
        if (x>=this.x1 && x<=this.x2 && y>=this.y1 && y<=this.y2){
          return true;
          //objButton.onclick();
        }
      }
    };
    buttons.list.push(objButton);
    buttons.update()
    return objButton;
  }



  function printCC(x1,y1,text,color2){ // {{{3
    for (var i=x1;i<x1+text.length;i++){
      color.i=keyboard.chars.indexOf(text.substr(i-x1,1).toLowerCase());
      print(i,y1,text.substr(i-x1,1),color.getFromP(0));
    }
  }



  function printCapital(x,y,text,color2){ //{{{3
    for (var i=0;i<text.length;i++) {
      if (text[i].isCap()) {
        print(x+i,y,text[i],color2);
      }
    }
  }

  function printCapitalInCaption(x,y,text,caption,color2){ //{{{3
    let startIndex = 0
    for (var i=0;i<text.length;i++) {
      if (text[i].isCap()) {
        for (var j=startIndex;j<caption.length;j++) {
          if (caption[j].toUpperCase() == text[i]) {
        print(x+j,y,caption[j],color2);
            startIndex = j+1

            break;
          }
        }
      }
    }
  }
  function ap37PrintCapitalInCaption(x,y,text,caption,color2){ //{{{3
    let startIndex = 0
    for (var i=0;i<text.length;i++) {
      if (text[i].isCap()) {
        for (var j=startIndex;j<caption.length;j++) {
          if (caption[j].toUpperCase() == text[i]) {
        ap37.print(x+j,y,caption[j],color2);
            startIndex = j+1

            break;
          }
        }
      }
    }
  }

  function printCaptionWithAccent(app){ //{{{3
          print(apps.captionX,apps.captionY," ".repeat(w))  //clearing
          print(apps.captionX,apps.captionY,app.caption)   //writing caption in whiete
          printCapitalInCaption(apps.captionX,apps.captionY, app.name, app.caption ,color.scheme('[color.prefScheme].apps.name.accent'));
  }

  function ap37PrintCaptionWithAccent(app){ //{{{3
          //print(apps.captionX,apps.captionY," ".repeat(w))  //clearing
          ap37.print(apps.captionX,apps.captionY,app.caption,"#ffffff")   //writing caption in whiete
          ap37PrintCapitalInCaption(apps.captionX,apps.captionY, app.name, app.caption ,color.scheme('[color.prefScheme].apps.name.accent'));
  }
 

  String.prototype.isCap = function (char) { //{{{3
    return ( this.toUpperCase() == this && /[a-zA-Z]/.test(this))
  }



  String.prototype.replaceAt = function(index, replacement) { //{{{3
        if (index >= this.length) {
              return this.valueOf();
          }

     

    var chars = this.split('');

        chars[index] = replacement;

        return chars.join('');

  }

  String.prototype.repeat = function(n) { //{{{3
    let str=""
      for (var i=0;i<n;i++) {
        str += this
      }
    return str
  } //}}}
   

//var str = "Hello World";

//str = str.replaceAt(5, '_');

//alert(str);


function getAt(x,y) {    //{{{3
  if (background.bufferColors[y][x] == '#333333') {return 0}
  return [background.buffer[y][x],background.bufferColors[y][x]]
}
function drawCircle(x,y,r,text,color) {
  text = text;
  color = color;
  var ddeg=1/r
  for (var i=0;i<2*Math.PI;i+=ddeg) {
    var xi=r*Math.cos(i)
    var yi=r*Math.sin(i)
    var nx=Math.round(x+r*Math.cos(i))
    var ny=Math.round(y+r*Math.sin(i)/yscale)

    if (nx<0||nx>=w||ny<0||ny>=h){continue}
    var ga=getAt(nx,ny)
    ap37.print(nx,ny,text?text:ga?ga[0]:' ',color?color:ga?ga[1]:'#ffffff')
  }
}
function blastAt(x,y,d,l,t1,col1,t2,col2) {
  col1=col1 || '#ffffff';
  d=d || 1;
  l=l || 72;
  var bool=0;
  var i=0;
  var j=0;
  var blast = setInterval(function (){
    drawCircle(x,y,i,t1,col1)

    i++
    if (i>l){clearInterval(blast)}
  },100)
  var blast2 = setInterval(function (){
    if (i>=d) {
      drawCircle(x,y,j,t2,col2)

      j++
      if (j>l){clearInterval(blast2)}
    }
  },100)
}
//drawCircle(30,30,10)





// objects {{{2

var prefs = {
  color: color
}
var buttons = {  //{{{3
  list: [],

  onTouch: function (x,y) {
    // making a copy so that updating the list on the fly won't interfare
    let listcopy = buttons.list.filter(() => {return true})
    for (var i=listcopy.length-1;i>=0;i--) {
      if (listcopy[i].onTouch(x,y)) {
        listcopy[i].onclick(x,y)
        break
      }
    }

  },
  update: function () {
    for (var i=0;i<buttons.list.length;i++) {
      buttons.list[i].id=i;
    }
  },
  del: function (btn) {
    var id=btn.id;
    buttons.list.splice(btn.id,1)
    for (var i=id;i<buttons.list.length;i++) {
      buttons.list[i].id=i;
    }
  }

}
var cursor = { // {{{3
  x:0,
  y:3,
  advance: function (n){
    cursor.y=(cursor.y+Math.floor((cursor.x+n)/w))
    cursor.x=(cursor.x+n)%w
  },
  putAt: function (xi,yi) {
    cursor.x=xi;
    cursor.y=yi;
  }
}





var keyboardShortcuts = { // {{{3
  echoAddress: [5,5],
  _echo: "",
  set echo(e) {

    print(this.echoAddress[0],this.echoAddress[1],e)
    let relativeNewLength = e.length - this._echo.length
    if (relativeNewLength < 0) {
      print(this.echoAddress[0] + e.length,this.echoAddress[1],' '.repeat(-relativeNewLength))
    }
    this._echo = e
  },
  get echo() {return this._echo},
  _currentLayer: "plain",
  set currentLayer(l) {
    this._currentLayer = l
    this.echo = this._currentLayer
  },
  get currentLayer() { return this._currentLayer},
  ctrl: function (key) {
    return () => {return keyboard.ctrlActive && keyboard.currentKey == key}
  },
  init: function () {
    keyboard.plug("KS-C-sp",keyboardShortcuts.ctrl(" "),() => {
      keyboardShortcuts.currentLayer = "plain"
    })
    keyboard.plug("KS-C-C",keyboardShortcuts.ctrl("C"),() => {
      keyboardShortcuts.currentLayer = "colors"
    })
    keyboard.plug("KS-C-A",keyboardShortcuts.ctrl("A"),() => {
      keyboardShortcuts.currentLayer = "autoview"
    })
    //in colours mode //{{{4
    keyboard.plug("n_colors_N",() => {return keyboard.currentKey == "N" && keyboardShortcuts.currentLayer == "colors"},() => {
      color2.nextPalette()
      this.echo = color2.prefPalette
      setTimeout(() => { keyboardShortcuts.echo= keyboardShortcuts.currentLayer},3000)
    })
    //}}}
    //in autoview made //{{{4
    keyboard.plug("n_A",() => {return keyboard.currentKey == "A" && keyboardShortcuts.currentLayer == "autoview"},() => {
      let auto = 1;
      (function showCaptionAfterAWhile(appIndex) {
        if (!(appIndex in apps.list)){return}
        printCaptionWithAccent(apps.list[appIndex])
        let timeoutPromise = new Promise((resolve)=>{
          let t
          //autoresolve
          if (auto) {
          t = setTimeout(()=>{resolve(appIndex+1)},apps.list[appIndex].caption.length*50 + 1000)
          }
          //next
          keyboard.plug("n_autoview_N",() => {return keyboard.currentKey == "N" && keyboardShortcuts.currentLayer == "autoview"},() => {
            resolve(appIndex +1)
          })
          //prev
          keyboard.plug("n_autoview_P",() => {return keyboard.currentKey == "P" && keyboardShortcuts.currentLayer == "autoview"},() => {
            resolve(appIndex -1)
          })
          //toggle autoresolve
          keyboard.plug("n_autoview_sp",() => {return keyboard.currentKey == " " && keyboardShortcuts.currentLayer == "autoview"},() => {
            if (t) {
            clearInterval(t)
            auto = 0
            }else{
            auto = 1
              resolve(appIndex + 1)
            }
          })

        },(reject) => {
          //autoreject
          setTimeout(()=>{reject("er")},3000)
        })
        timeoutPromise.then((v,r)=>{
          
          showCaptionAfterAWhile(v)
        })

      })(0)
    })

    //})
    //}}}
  }
}


var keyboard = {  //{{{3
  _layout: [
    // will be set on init
  ],
  get layout() {
    return this._layout
  },
  set layout(l) {
    keyboard.keyHeight = Math.floor(keyboard.height/l.length);
    this._layout = l
  },
  layoutMaster: [
    [ //abc mode
    'shift P Y F G C R L bksp'.split(' '),
    'AOEUIDHTNS'.split(''),
    'Q J K X B M W V Z'.split(' '),
    'ctrl sym _ _ space _ _ arrow enter'.split(' ')
    ],
    [ //shift mode
    'abc p y f g c r l bksp'.split(' '),
    'aoeuidhtns'.split(''),
    'q j k x b m w v z'.split(' '),
    'ctrl abc _ _ space _ _ arrow enter'.split(' ')
    ],
    [ //sym mode
    'shift P Y F G C R L bksp'.split(' '),
    '0123456789'.split(''),
    'Q J K X B M W V Z'.split(' '),
    'ctrl abc _ _ space _ _ arrow enter'.split(' ')
    ]
  ],
  chars: 'abcdefghijklmnopqrstuvwxyz0123456789'.split(''),
  key: [[]],
  maxKey: 10,
  _currentKey:null,
  _keyFlag: 8, // binary, LSB is isCtrlActive
  _plugged: {
    "C-D": { // will be shoted and the first object that matches testfunc will
             // be run
      testfunc:function(){return keyboard.ctrlActive && keyboard.currentKey == "D"},
      func: function(){alert(JSON.stringify(this))}
    }
  },  // stucture: {id: {testfunc,func}}
  plug: function(id,testfunc,func) {
    this._plugged[id] = {
      testfunc: testfunc,
      func: func
    }
  },
  checkPlug: function () {
    let keys = Object.keys(this._plugged).sort()
    for (var i=0;i<keys.length;i++) {
      let shortcut = this._plugged[keys[i]]
      if (shortcut.testfunc && shortcut.func && shortcut.testfunc())  {
        shortcut.func()
        return
      }
    }
  },
  set currentKey(k) {
    this._currentKey = k
    this.checkPlug()
    this.ctrlActive = 0
  },
  get currentKey() {return this._currentKey},
  set ctrlActive(bool) {
    if (bool) {
    this._keyFlag |= 1 // set LSB
    } else {
      this._keyFlag = this._keyFlag &~ 1 //unset LSB
    }
    //this.key[3][0].text = 'CTRL'
  },
  get ctrlActive(){return this._keyFlag & 1},  //return LSB
  init: function () {  //{{{4

    keyboard.topMargin = Math.floor(h*.67);
    keyboard.bottomMargin = (h-2)*1;

    //counting from top
    keyboard.height = keyboard.bottomMargin - keyboard.topMargin ;
    keyboard.keyWidth = Math.floor(w/keyboard.maxKey);
    keyboard.keyHeight = Math.floor(keyboard.height/keyboard.layout.length);
    keyboard.keyPad = Math.ceil(keyboard.keyWidth/2)
    keyboard.layout = keyboard.layoutMaster[0]
  },
  draw: function () { //{{{4
    for (var j=0; j< keyboard.layout.length;j++){
      var linePad = Math.floor((w-keyboard.layout[j].length*keyboard.keyWidth)/2)
      for (var k=0;k<keyboard.keyHeight;k++) {
        background.printPattern(0,w,keyboard.topMargin + j*keyboard.keyHeight + k);
      }
      keyboard.key[j] = [];
      for (var i=0;i < keyboard.layout[j].length;i++) {
        let key = keyboard.layout[j][i]
        if (key == "space") {key = " "}
        //triggers when ctrl is not active and an ordinary key is pressed
        keyboard.plug("u_"+key,  // unique id
          (key => {         // testfunc
            return keyboard.currentKey == key && !keyboard.ctrlActive
          }).bind(null,key),
          (key =>  {        // func
            if (!(key == 'null')) {
              print(cursor.x,cursor.y,key,color.scheme('[color.prefScheme].bareText.filterLong'))
              if (!apps.isHidden) {
                apps.filter+=key;
              }
              cursor.advance(1)
            }
            //alert(keyboard.layout[j][i])
          }).bind(null,key))
        //keyboard.plug("u_space",)

        keyboard.key[j][i] = myAddButton(
          linePad + i*keyboard.keyWidth,
          keyboard.topMargin + j*keyboard.keyHeight,
          linePad + (i+1)*keyboard.keyWidth-1,
          keyboard.topMargin+(j+1)*keyboard.keyHeight-1,
          ' '.repeat(Math.floor((keyboard.keyWidth-keyboard.layout[j][i].length)/2)) + keyboard.layout[j][i],
          function () {  //{{{5
            switch (this.name) {
              case 'bksp':
                if (keyboard.ctrlActive) {
                  apps.filter = '';
                  cursor.x = 0;
                  keyboard.ctrlActive = 0;
                } else {
                  cursor.x--
                  if (cursor.x<0) {cursor.x=w-1;cursor.y--;}
                  background.printPattern(cursor.x,1,cursor.y)
                  apps.filter=apps.filter.slice(0,-1);
                }
                break;
              case 'space':
                //background.printPattern(cursor.x,1,cursor.y);
                //cursor.advance(1);
                //apps.filter+=' ';
                keyboard.currentKey = ' '
                break;
              case 'enter':
              case 'ENTER':
                ap37.openApp(apps.list[0].id);
                apps.filter = '';
                break;
              case 'sym':
                keyboard.layout=keyboard.layoutMaster[2];
                keyboard.hide();
                keyboard.draw();
                break;
              case 'shift':
                keyboard.layout=keyboard.layoutMaster[1];
                keyboard.hide();
                keyboard.draw();
                break;
              case 'abc':
                keyboard.layout=keyboard.layoutMaster[0];
                keyboard.hide();
                keyboard.draw();
                break;
                
              case 'ctrl':
                if (keyboard.ctrlActive) {
                  keyboard.ctrlActive = 0;
                } else {
                  keyboard.ctrlActive = 1;
                }
                break;
              default:

                keyboard.currentKey = this.name
            }

          },
          color.scheme('[color.prefScheme].keyboard.key')
        );
        keyboard.key[j][i].name = keyboard.layout[j][i];
        //myAddButton(0,60,3,66,'b','','red');
      }
    }
  },

  hide: function () {  // {{{4
    for (var i=keyboard.topMargin;i<keyboard.bottomMargin;i++){
      //print(0,i,' '.repeat(w));
      background.printPattern(0,w,i);
    }
    for (var j=0; j< keyboard.key.length;j++){
      for (var i=0;i < keyboard.key[j].length;i++) {
        //alert (j+','+i+','+keyboard.key[j]);
        buttons.del(keyboard.key[j][i])
      }
    }
    keyboard.key=[];


  },

}

//modules

var background = {  //{{{3
  buffer: [],
  bufferColors: [],
  pattern: '',
  printPattern: function (x0, xf, y) { //{{{4
    print(x0, y,
      background.pattern.substring(y * w + x0, y * w + xf),
      '#333333');
  },
  init: function () {//{{{4

    background.pattern = rightPad('', h * w, ' ');

    for (var i = 0; i < h; i++) {
      background.buffer.push(background.pattern.substr(i * w, w));
      background.bufferColors.push(arrayFill('#333333', w));
    }

    ap37.printLines(background.buffer, '#333333');
  }
};

var time = {//{{{3

  update: function () {
    var d = ap37.getDate();
    var time = d.year +
      leftPad(d.month, 2, '0') + leftPad(d.day, 2, '0') + ' ' +
      leftPad(d.hour, 2, '0') + leftPad(d.minute, 2, '0');
    print(w - 18, 0, time,color.scheme('[color.prefScheme].bareText.time'));
  },
  init: function () {
    time.update();
    setInterval(time.update, 60000);
  }
};

var battery = {//{{{3

  update: function () {
    print(Math.floor(w*0.6), 0,
      leftPad(ap37.getBatteryLevel(), 3, ' ')+'%',color.scheme('[color.prefScheme].bareText.battery'));
  },
  init: function () {
    battery.update();
    setInterval(battery.update, 60000);
  }
};

var notifications = {//{{{3

  list: [],
  active: false,
  update: function () {
    notifications.active = ap37.notificationsActive();
    if (notifications.active) {
      var nots = ap37.getNotifications();
      notifications.list = nots;
      for (var i = 0; i < 3; i++) {
        var y = i + 2;
        background.printPattern(0, w, y);
        if (i < nots.length) {
          nots[i].y = y;
          if (i == 2 && nots.length > 3) {
            nots[i].ellipsis = true;
          }
          notifications.printNotification(nots[i], false);
        }
      }
    } else {
      print(0, 3, 'Activate notifications');
    }
  },
  printNotification: function (notification, highlight) {
    var name = notification.name;
    if (notification.ellipsis) {
      var length = Math.min(name.length, w - 10);
      name = name.substring(0, length) + "... +" +
        (notifications.list.length - 3);
    }
    print(0, notification.y, name, highlight ? '#ff3333' : '#ffffff');
    if (highlight) {
      setTimeout(function () {
        notifications.printNotification(notification, false);
      }, 1000);
    }
  },
  init: function () {
    ap37.setOnNotificationsListener(notifications.update);
    notifications.update();
  },
  onTouch: function (x, y) {
    if (notifications.active) {
      for (var i = 0; i < notifications.list.length; i++) {
        if (notifications.list[i].y === y) {
          notifications.printNotification(notifications.list[i], true);
          ap37.openNotification(notifications.list[i].id);
          return;
        }
      }
    } else if (y === 3) {
      ap37.requestNotificationsPermission();
    }
  }
};

var apps = {//{{{3

  list: [],
  lineHeight: 1,
  topMargin: 6,
  bottomMargin: 4,
  bottomMargin2: 4,
  lines: 0,
  appWidth: 6,
  appsPerLine: 0,
  zoomLevel: 4,
  appsPerPage: 0,
  currentPage: 0,
  palette1:1,  //main
  palette2:2,  //accent
  palette3:1,  //_
  isNextPageButtonVisible: false,
  unique:[],
  isStrict:1,
  isAuto:1,
  _filter:'',
  get filter() {return this._filter},
  set filter(f) {
    this._filter=f
    background.printPattern(0,w,4);
    print(0,4,apps.filter,color.scheme('[color.prefScheme].bareText.filter'))
    apps.isIntercept=1;
    setTimeout(apps.init,1);
  },
  xoffset:0,
  captionX: 20,
  captionY: 4,
  printPage: function () {//{{{4

    if (apps.runState==2){
      //load proggress

      if (apps.isIntercept){
        apps.isIntercept=0;
        apps.runState=0;
        //alert('dead'+ apps.isIntercept)
        return;
      }
      var x = apps.lastX;
      var y = apps.lastY;
      var appPos = apps.lastAppPos;
    } else if (apps.runState) {
    }else{
      //init ptoggtess
      var x=0;
      var y=apps.topMargin;
      var appPos = 0 * apps.appsPerPage;
    }

    //for (; x + apps.appWidth <= w;) 
    //for (; y < apps.topMargin + apps.lines *
    // apps.lineHeight;) 
    //background.printPattern(x, x + apps.appWidth, y);
    if (appPos < apps.list.length) {
      var app = apps.list[appPos];
      app.index = appPos
      app.y = y;
      app.x0 = x;
      app.xf = x + apps.appWidth;
      var printlen=app.name.length
      //apps.printApp(app, false);
      //printApp: function (app, highlight) 
      //color.i= keyboard.chars.indexOf(app.name.substring(0,1).toLowerCase())

      //uncomment next line to enable short name for apps;
      //app.name=app.name.replace(/(?<!^| )[aeiouAEIOU](?=[^ ])/g,'');
      //var printlen=apps.appWidth - 2 + apps.xoffset
      apps.printAppName(app)

      if (!app.button) {
        //add button
        app.button = myAddButton(app.x0,app.y,app.x0+apps.appWidth -1,app.y,"",() => {zoomNearThisApp(app)})
      }else {
        //update button
        app.button.x1 = app.x0
        app.button.y1 = app.y
        app.button.x2 = app.x0+apps.appWidth -1
        app.button.y2 = app.y
      }




      appPos++;
      print(0,5,rightPad(appPos,4,' '),color.scheme('[color.prefScheme].keyboard.key'))
      //save and take break if exhaused
      y += apps.lineHeight;
      if ( y >= apps.topMargin + apps.lines *apps.lineHeight) {
        y=apps.topMargin;

        // uncomment for compact desplay, default grid desplay
        //apps.xoffset = apps.appWidth - app.name.length - 2
        x += apps.appWidth - apps.xoffset;

      }
      print(4,4,leftPad(x,3,' ')+'     '+leftPad(y,3,' '),color.scheme('[color.prefScheme].keyboard.key'))
      apps.lastX = x;
      apps.lastY = y;
      apps.lastAppPos=appPos;
      apps.runState = 2;
      setTimeout(apps.printPage,1)

      return;

    }else  {
      apps.runState=0;
      //alert('peace');
      return
    }

    //apps.runState = 0;

  },
  printAppName: function(app) {
    var printlen=app.name.length

    // print _appname
    print(app.x0, app.y, '_' +

      app.name.substring(0, printlen),
      color.scheme('[color.prefScheme].apps.name.base'));
    //uncomment to disable second line
    /*print(app.x0, app.y+1, '  ' +

                app.name.substr(apps.appWidth - 2,apps.appWidth - 3),
                color.scheme('[color.prefScheme].apps.name.base'));*/


    //print _ with dash color
    print(app.x0 , app.y, Math.floor(app.index/apps.zoomLevel)%2==0 ? '┃':'│' , color.scheme('[color.prefScheme].apps.name.dash'));
    //print capital letters only with accent color
    printCapital(app.x0 + 1, app.y, app.name.substring(0, printlen), color.scheme('[color.prefScheme].apps.name.accent'));
    /*printCapital(app.x0 + 2, app.y+1, app.name.substr(apps.appWidth -2, apps.appWidth - 3), color.scheme('[color.prefScheme].apps.name.accent'));*/
  },
  printAppNameWithBound: function(app,prevApp,nextApp,fillChar,backFillChar) {
    fillChar = fillChar || ">"
    backFillChar = backFillChar || "<"
    let endSymbol="  "  //will be overriden
    let prevAppLen = prevApp ? prevApp.name.length : 0
    let nextAppLen = nextApp ? nextApp.name.length : 0
    let prevAppLenRelative = prevAppLen - app.name.length
    let nextAppLenRelative = nextAppLen - app.name.length
    //digging out holes so that you see a continuous blank separation line
    switch (true) {
      case prevAppLenRelative > 0 :
        endSymbol = fillChar.repeat(prevAppLenRelative) + fillChar
        break;
      case nextAppLenRelative > 0 :
        endSymbol = fillChar.repeat(nextAppLenRelative) + fillChar
        break;
      default :
        endSymbol = fillChar
    }
    endSymbol += fillChar
    var printlen=app.name.length
    apps.printAppName(app)
    //add $ at end to mark the end
    print(app.x0+printlen + 1,app.y,endSymbol)
    //add ^ at first to mark the start
    print(app.x0-2,app.y,backFillChar+backFillChar)
  },
  printApp: function (app, highlight) {//{{{4

    color.i= keyboard.chars.indexOf(app.name.substring(0,1).toLowerCase())

    //uncomment next line to enable short name for apps;
    //app.name=app.name.replace(/(?<!^| )[aeiouAEIOU](?=[^ ])/g,'');
    print(app.x0, app.y, '+' +

      app.name.substring(0, apps.appWidth - 2),
      highlight ? '#ff3333' : color.scheme('[color.prefScheme].apps.name.base'));
    //uncomment to disable second line
    if (apps.lineHeight == 2){
      print(app.x0, app.y+1, '  ' +

        app.name.substr(apps.appWidth - 2,apps.appWidth - 3),
        highlight ? '#ff3333' : color.scheme('[color.prefScheme].apps.name.base'));
    }

    if (highlight) {
      setTimeout(function () {
        apps.printApp(app, false);
      }, 1000);
    } else {
      print(app.x0 , app.y, '+' , color.scheme('[color.prefScheme].apps.name.dash'));
      printCapital(app.x0 + 1, app.y, app.name.substring(0, apps.appWidth - 2), color.scheme('[color.prefScheme].apps.name.accent'));
      printCapital(app.x0 + 2, app.y+1, app.name.substr(apps.appWidth -2, apps.appWidth - 3), color.scheme('[color.prefScheme].apps.name.accent'));
    }

  },
  construct: function () {//{{{4

    apps.unique =[];
    apps.list2 = ap37.getApps();
    apps.list2.map(function (v,i,a){
      v.caption = v.name
      v.name = v.name.replace(/(?<!^| )[aeiouAEIOU](?=[^ ])/g,'');
    });
    apps.list2.sort(function (a,b){


      return findUniqueChars(a.name)-findUniqueChars(b.name);
    });
    function findUniqueChars(str){
      var u=[];
      var out=0;
      for (var i=0;i<str.length;i++){
        if (/[^a-zA-Z]/.test(str.substr(i,1))) {continue;}
        if (u.indexOf(str.substr(i,1).toLowerCase()) < 0) {
          u.push(str.substr(i,1).toLowerCase());
          out++
        }
      }
      return out;
    };
    //*
    apps.list2.forEach(function (v,i,a){
      v.name=v.name.toLowerCase();
      for (var jj=0;jj<v.name.length;jj++) {
        var a0=v.name.substr(jj,1);
        if (/[^a-zA-Z]/.test(a0)){ continue; }


        for (var ii=jj+1;ii<v.name.length;ii++){
          var a1=v.name.substr(ii,1);
          if (/[^a-zA-Z]/.test(a1)){ continue; }
          if (apps.unique.indexOf(a0+a1) <0 ){
            apps.unique.push(a0+a1);
            v.name=v.name.replaceAt(jj,a0.toUpperCase());
            v.name=v.name.replaceAt(ii,a1.toUpperCase());
            return;
          }
        }
      }




    });
    //*/
    background.printPattern(0,w,5)
    print(20,5,apps.list2.length,color.scheme('[color.prefScheme].bareText.total'));
    //you can change sort here
    //apps.list2.sort(lengthSort);
    apps.list2.sort(alphabeticLengthSort);
    function alphabeticSort(a,b){
      return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      return keyboard.chars.indexOf(a.name[0].toLowerCase())-
        keyboard.chars.indexOf(b.name[0].toLowerCase())
    }

    function lengthSort(a,b){
      return a.name.length-
        b.name.length
    }

    function alphabeticLengthSort(a,b) {

      if (a.name[0].toLowerCase() == b.name[0].toLowerCase()) {
        return lengthSort(a,b)
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      }
    }
  },
  init: function () {//{{{4
    if (!apps.isHidden) {

      apps.isIntercept=0;
      if (apps.isStrict) {
        var pattern= eval('/^[^A-Z]*'+apps.filter.toUpperCase().split('').join('.*')+'/');
      } else {
        var pattern= eval(('/^'+apps.filter.toLowerCase()+'.*/i').replace(' ','.*'));
      }

      apps.list=apps.list2.filter(function (v,i,a){
        var out = pattern.test(v.name);
        return out;
      })
      print(0,5,apps.list.length,color.scheme('[color.prefScheme].bareText.shownApp'));
      apps.lines = Math.floor(
        (h - apps.topMargin - apps.bottomMargin) / apps.lineHeight);
      apps.lines = apps.lines - apps.lines % apps.zoomLevel
      apps.appsPerLine = Math.ceil(apps.list.length / apps.lines);
      apps.appWidth = Math.floor(w / apps.appsPerLine);

      // check minimum app name length
      if (apps.appWidth < 1) {
        apps.appWidth = 6;
        apps.appsPerLine = Math.floor(w / apps.appWidth);
        apps.isNextPageButtonVisible = true;
        print(w - 4, h - 9, '>>>');
        print(w - 4, h - 8, '>>>');
      } else {
        apps.isNextPageButtonVisible = false;
        background.printPattern(w - 4, w, h - 9);
      }

      apps.appsPerPage = apps.lines * apps.appsPerLine;
      apps.currentPage = 0;

      
      if (apps.isAuto && apps.list.length == 1) {
        ap37.openApp(apps.list[0].id);
        apps.filter = '';
      } else {
        apps.hide();
        apps.printPage(apps.currentPage);
      }
      apps.isHidden=0;
    }
    if (!appListener) {
      ap37.setOnAppsListener(apps.construct);
      var appListener=1;
    }
  },
  hide: function () {//{{{4

    for (var i=apps.topMargin;i<h-apps.bottomMargin;i++){
      //print(0,i,' '.repeat(w));
      background.printPattern(0,w,i);
    }
    apps.isHidden=1;
  },
  onTouch: function (x, y) {
    for (var i = apps.currentPage * apps.appsPerPage; i <
      apps.list.length; i++) {
      var app = apps.list[i];
      if (y >= app.y && y <= app.y + 1 &&
        x >= app.x0 && x <= app.xf) {
        apps.printApp(app, true);
        ap37.openApp(app.id);
        return;
      }
    }
    if (apps.isNextPageButtonVisible &&
      y >= h - 9 && y <= h - 8 &&
      x >= w - 4 && x <= w) {
      apps.currentPage++;
      if (apps.currentPage * apps.appsPerPage >= apps.list.length) {
        apps.currentPage = 0;
      }
      apps.printPage();
    }
  }
};



var matrix = {//{{{3

  topMargin: apps.topMargin,
  avg1: 21,
  avg0: 13,
  avg2: 30,
  daemonInterval:40, 
  isKind:0,
  charset:'abcdefghijklmnopqrstuvwxyz',
  isOn:0,
  get bottomMargin() { return apps.bottomMargin},
  init: function () {
    matrix.charset
    for (var i=33;i<128;i++){
      matrix.charset += String.fromCharCode(i)
    }
    matrix.charsetLength=matrix.charset.length
  },
  onTurnOn: function () {//{{{4
    if (matrix.catchMe) {
      //
    } else {    //first time running


      //matrix.w = 4;
      for (var i=0;i < w;i++) {
        matrix.startMasterDaemon(i);
      }
    }

    //alert('matrix');
  },



  onTurnOff: function () {//{{{4
    //alert('matrixOff');
  },
  startDaemon: function (mw,bool) {//{{{4
    var i=matrix.topMargin

    var daemon = setInterval(function (){
      if (i < h - matrix.bottomMargin) {
        var ga=getAt(mw,i);

        if (!matrix.isKind || !ga) {
          ap37.print(mw,i,bool ?matrix.charset[Math.floor(Math.random()*matrix.charsetLength)]:ga?ga[0]:' ',ga&&!bool?ga[1]:'#00ff00')
        }
      } else {
        clearInterval(daemon)
      }
      i++
      if (!matrix.isOn){clearInterval(daemon)}

    },matrix.daemonInterval)
    return daemon;
  },
  startMasterDaemon: function (mw) {//{{{4

    var i=0;
    var bool = 1;
    var masterDaemon = setInterval(function (){
      switch (bool) {
        case 0:
          if (Math.random() < 1/matrix.avg0) {
            var daemon = matrix.startDaemon(mw,1)
            bool=1
          }
          break;
        case 1:
          if (Math.random() < 1/matrix.avg1) {
            var daemon = matrix.startDaemon(mw,0)
            bool=0
          }
          if (Math.random() < 1/matrix.avg2) {
            clearInterval(daemon);
            var daemon= matrix.startDaemon(mw,1)
          }
          break;
      }

      /* 
            switch (true) {

                case i==0:
                    matrix.startDaemon(matrix.w,1)
                break;
                case i==4:
                    matrix.startDaemon(matrix.w,0)
                break;
                case i==200:
                    clearInterval(masterDaemon)
                break;
            }*/
      i++
      if (!matrix.isOn){clearInterval(masterDaemon)}
    },matrix.daemonInterval)
  }

}

var markets = {//{{{3

  update: function () {
    get('https://api.cryptowat.ch/markets/prices', function (response) {
      try {
        var result = JSON.parse(response).result,
          marketString =
          'BTC' + Math.floor(result['market:kraken:btcusd']) +
          ' BCH' + Math.floor(result['market:kraken:bchusd']) +
          ' ETH' + Math.floor(result['market:kraken:ethusd']) +
          ' ETC' + Math.floor(result['market:kraken:etcusd']) +
          ' LTC' + Math.floor(result['market:kraken:ltcusd']) +
          ' ZEC' + Math.floor(result['market:kraken:zecusd']);
        background.printPattern(0, w, h - 7);
        print(0, h - 7, marketString);
      } catch (e) {
      }
    });
  },
  init: function () {
    print(0, h - 8, '// Markets');
    markets.update();
    setInterval(markets.update, 60000);
  }
};

var transmissions = {//{{{3

  list: [],
  update: function () {
    get('https://hacker-news.firebaseio.com/v0/topstories.json', function (response) {
      try {
        var result = JSON.parse(response),
          line = h - 4,
          t = transmissions;
        t.list = [];
        for (var i = 0; i < result.length && i < 3; i++) {
          get('https://hacker-news.firebaseio.com/v0/item/' + result[i] + '.json', function (itemResponse) {
            var itemResult = JSON.parse(itemResponse);
            var transmission = {
              title: itemResult.title,
              url: itemResult.url,
              y: line
            };
            t.list.push(transmission);
            background.printPattern(0, w, line);
            t.printTransmission(transmission, false);
            line++;
          });
        }
      } catch (e) {
      }
    });
  },
  printTransmission: function (transmission, highlight) {
    print(0, transmission.y, transmission.title,
      highlight ? '#ff3333' : '#ffffff');
    if (highlight) {
      setTimeout(function () {
        transmissions.printTransmission(transmission, false);
      }, 1000);
    }
  },
  init: function () {
    print(0, h - 5, '// Transmissions');
    transmissions.update();
    setInterval(transmissions.update, 3600000);
  },
  onTouch: function (x, y) {
    for (var i = 0; i < transmissions.list.length; i++) {
      if (transmissions.list[i].y === y &&
        x <= transmissions.list[i].title.length) {
        transmissions.printTransmission(transmissions.list[i], true);
        ap37.openLink(transmissions.list[i].url);
        return;
      }
    }
  }
};

var wordGlitch = {//{{{3

  tick: 0,
  length: 0,
  x: 0,
  y: 0,
  text: [],
  active: false,
  intervalId: null,
  update: function () {
    var g = wordGlitch;
    if (g.tick === 0) { // generate new glitch
      g.length = 5 + Math.floor(Math.random() * 6);
      g.x = Math.floor(Math.random() * (w - g.length));
      g.y = Math.floor(Math.random() * h);

      g.text = [];
      for (var i = 0; i < 5; i++) {
        g.text.push(Math.random().toString(36).substr(2, g.length));
      }

      ap37.print(g.x, g.y, g.text[g.tick], '#666666');
      g.tick++;
    } else if (g.tick === 5) { // remove glitch
      ap37.printMultipleColors(g.x, g.y,
        background.buffer[g.y].substr(g.x, g.length),
        background.bufferColors[g.y].slice(g.x, g.x + g.length)
      );
      g.tick = 0;
      if (!wordGlitch.active) {
        clearInterval(wordGlitch.intervalId);
      }
    } else {
      ap37.print(g.x, g.y, g.text[g.tick], '#666666');
      g.tick++;
    }
  },
  onTouch: function (x, y) {
    if (x > w - 6 && y > h - 4) {
      wordGlitch.active = !wordGlitch.active;
      if (wordGlitch.active) {
        wordGlitch.intervalId = setInterval(wordGlitch.update, 100);
      }
    }
  }
};

var lineGlitch = {//{{{3

  tick: 0,
  line: 0,
  active: false,
  intervalId: null,
  update: function () {
    var g = lineGlitch;
    if (g.tick === 0) { // shift line
      g.line = 1 + Math.floor(Math.random() * h - 1);

      var offset = 1 + Math.floor(Math.random() * 4),
        direction = Math.random() >= 0.5;

      if (direction) {
        ap37.printMultipleColors(0, g.line,
          rightPad(
            background.buffer[g.line].substring(offset), w,
            ' '),
          background.bufferColors[g.line].slice(offset));
      } else {
        ap37.printMultipleColors(0, g.line,
          leftPad(background.buffer[g.line]
            .substring(0, w - offset), w, ' '),
          arrayFill('#ffffff', offset)
          .concat(background.bufferColors[g.line]
            .slice(0, w - offset))
        );
      }
      g.tick++;
    } else { // restore line
      ap37.printMultipleColors(
        0, g.line, background.buffer[g.line],
        background.bufferColors[g.line]);
      g.tick = 0;
      if (!lineGlitch.active) {
        clearInterval(lineGlitch.intervalId);
      }
    }
  },
  onTouch: function (x, y) {
    if (x > w - 6 && y > h - 4) {
      lineGlitch.active = !lineGlitch.active;
      if (lineGlitch.active) {
        lineGlitch.intervalId = setInterval(lineGlitch.update, 200);
      }
    }
  }
};

//utils
// core {{{2

function print(x, y, text, color) {//{{{3

  color = color || '#ffffff';
  background.buffer[y] = background.buffer[y].substr(0, x) + text +
    background.buffer[y].substr(x + text.length);
  for (var i = x; i < x + text.length; i++) {
    background.bufferColors[y][i] = color;
  }
  ap37.print(x, y, text, color);
}

function get(url, callback) {//{{{3

  var xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function () {
    if (xhr.status === 200) {
      callback(xhr.response)
    }
  };
  xhr.send();
}

function leftPad(str, newLength, char) {//{{{3

  str = str.toString();
  return newLength > str.length ?
    new Array(newLength - str.length + 1).join(char) + str : str;
}

function rightPad(str, newLength, char) {//{{{3

  str = str.toString();
  return newLength > str.length ?
    str + new Array(newLength - str.length + 1).join(char) : str;
}

function arrayFill(value, length) {//{{{3

  var result = [];
  for (var i = 0; i < length; i++) {
    result.push(value);
  }
  return result;
}

init();
})();

// pull requests github.com/apseren/ap37
// 
