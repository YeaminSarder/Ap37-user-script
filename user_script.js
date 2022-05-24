(function script() {
    'use strict';
    var w, h;


    var color2 = {
        prefPalette:'cyberGreen', //select from colour2.palette
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
            ]
        }
    }



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
                    key: color2.palette[color2.prefPalette][3]
                },
                apps: {
                    activator: ['blue','teal'],
                    name: {
                        base: color2.palette[color2.prefPalette][1],
                        accent: color2.palette[color2.prefPalette][0],
                        dash: color2.palette[color2.prefPalette][1]
                    },
                 
                },
                toggle: {
                    strict: ['blue','teal'],
                    auto: ['blue','teal']
                },
                bareText: {
                    myName: color2.palette[color2.prefPalette][0],
                    battery: color2.palette[color2.prefPalette][1],
                    time: color2.palette[color2.prefPalette][1],
                    filter: color2.palette[color2.prefPalette][0],
                    filterLong: color2.palette[color2.prefPalette][1],
                    total: color2.palette[color2.prefPalette][3],
                    eof: color2.palette[color2.prefPalette][0],
                    clicked: color2.palette[color2.prefPalette][0],
                    shownApp: color2.palette[color2.prefPalette][3],
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


    function init() {
        ap37.setTextSize(10);
        w = ap37.getScreenWidth();
        h = ap37.getScreenHeight();
        ////inits__________________________
        background.init();
        print(5, 0, 'Yeamin Sarder',color.scheme('[color.prefScheme].bareText.myName'));
        battery.init();
        time.init();
        //notifications.init();
        keyboard.init();
        apps.construct();
        apps.init();
        //markets.init();
        //transmissions.init();
        print(w - 4, h - 2, 'EOF',color.scheme('[color.prefScheme].bareText.eof'));

        //var o=''
        var clicked=0
        var myButton_Load_Apps = myAddButton(5,2,'','','Shown   ',function () {
            this.color2 = color.scheme('[color.prefScheme].apps.activator')[apps.isHidden]
            if (apps.isHidden){
                this.text = 'Shown   ';
                        apps.isIntercept=1;
                        setTimeout(apps.init,1);
            } else {
                this.text = 'Hidden  ';
                        apps.isIntercept=1;
                apps.hide();
            }
            //o=apps.isHidden;
        },color.scheme('[color.prefScheme].apps.activator[1]'));
        //myButton_Load_Apps.text = 'Hide_A';
        var myButton_Toggle_Strict = myAddButton(20,2,'','','Strict:ON',function () {
            if (apps.isStrict){
                this.text = 'Strict:OFF';
                apps.isStrict = 0;
            } else {
                this.text = 'Strict: ON';
                apps.isStrict = 1;
            }
            this.color2 = color.scheme('[color.prefScheme].toggle.strict')[apps.isStrict]
        },color.scheme('[color.prefScheme].toggle.strict')[apps.isStrict]);
        var myButton_Toggle_Strict = myAddButton(35,2,'','','Auto:ON',function () {
            if (apps.isAuto){
                this.text = 'Auto:OFF';
                apps.isAuto = 0;
            } else {
                this.text = 'Auto: ON';
                apps.isAuto = 1;
            }
            this.color2 = color.scheme('[color.prefScheme].toggle.auto')[apps.isAuto]
        },color.scheme('[color.prefScheme].toggle.auto')[apps.isAuto])

        var myB_Keyboard = myAddButton(0,h-2,10,h-1,' KEYBOARD ',function () {
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

        ap37.setOnTouchListener(function (x, y) {
            //notifications.onTouch(x, y);
            if (!apps.isHidden) {
                apps.onTouch(x, y);
            }
            transmissions.onTouch(x, y);
            lineGlitch.onTouch(x, y);
            wordGlitch.onTouch(x, y);
            buttons.onTouch(x, y);
            clicked++
            print(0,2,clicked,color.scheme('[color.prefScheme].bareText.clicked'))
            //clearInterval(i1)
        });
    }


    //-----------------------------------------------------------------End_of_init

    // functions

    function myAddButton(x1,y1,x2,y2,text,func,color) {
        if (!x2){x2 = x1 + text.length - 1};
        if (!y2){y2 = y1};
        print(x1,Math.floor((y1+y2)/2),text,color);
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
                if (x>=x1 && x<=x2 && y>=y1 && y<=y2){
                    objButton.onclick();
                }
            }
        };
        buttons.list.push(objButton);
        return objButton;
    }



    function printCC(x1,y1,text,color2){
        for (var i=x1;i<x1+text.length;i++){
            color.i=keyboard.chars.indexOf(text.substr(i-x1,1).toLowerCase());
            print(i,y1,text.substr(i-x1,1),color.getFromP(0));
        }
    }



    function printCapital(x,y,text,color2){
        for (var i=0;i<text.length;i++) {
            if (text[i].isCap()) {
                print(x+i,y,text[i],color2);
            }
        }
    }



    String.prototype.isCap = function (char) {
        return ( this.toUpperCase() == this && /[a-zA-Z]/.test(this))
    }



    String.prototype.replaceAt = function(index, replacement) {
            if (index >= this.length) {
                    return this.valueOf();
                }

         

    var chars = this.split('');

            chars[index] = replacement;

            return chars.join('');

    }

     

//var str = "Hello World";

//str = str.replaceAt(5, '_');

//alert(str);










var prefs = {
    color: color
}
var buttons = {
    list: [],

    onTouch: function (x,y) {
        for (var i=0;i<buttons.list.length;i++) {
            buttons.list[i].onTouch(x,y)
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
var cursor = {
    x:0,
    y:3,
    advance: function (n){
        cursor.y=(cursor.y+Math.floor((cursor.x+n)/w))
        cursor.x=(cursor.x+n)%w
    }
}
var keyboard = {
    layout: [
        '1234567890'.split(''),
        'QWERTYUIOP'.split(''),
        'ASDFGHJKL'.split(''),
        'shift Z X C V B N M bksp'.split(' '),
        'ctrl fn _ _ space _ _ arrow enter'.split(' ')
    ],
    chars: 'abcdefghijklmnopqrstuvwxyz0123456789'.split(''),
    key: [[]],
    maxKey: 10,
    set set_controlActive(bool) {
        this.controlActive = bool
        this.key[3][0].text = 'CTRL'
    },
    init: function () {

        keyboard.topMargin = Math.floor(h*.75);
        keyboard.bottomMargin = (h-2)*1;
        keyboard.keyWidth = Math.floor(w/keyboard.maxKey);

        //counting from top
        keyboard.height = keyboard.bottomMargin - keyboard.topMargin ;
        keyboard.keyHeight = Math.floor(keyboard.height/keyboard.layout.length);
        keyboard.keyPad = Math.ceil(keyboard.keyWidth/2)
    },
    draw: function () {
        for (var j=0; j< keyboard.layout.length;j++){
            var linePad = Math.floor((w-keyboard.layout[j].length*keyboard.keyWidth)/2)
            for (var k=0;k<keyboard.keyHeight;k++) {
                background.printPattern(0,w,keyboard.topMargin + j*keyboard.keyHeight + k);
            }
            keyboard.key[j] = [];
            for (var i=0;i < keyboard.layout[j].length;i++) {

                keyboard.key[j][i] = myAddButton(
                    linePad + i*keyboard.keyWidth,
                    keyboard.topMargin + j*keyboard.keyHeight,
                    linePad + (i+1)*keyboard.keyWidth-1,
                    keyboard.topMargin+(j+1)*keyboard.keyHeight-1,
                    ' '.repeat(Math.floor((keyboard.keyWidth-keyboard.layout[j][i].length)/2)) + keyboard.layout[j][i],
                    function () {
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
                                background.printPattern(cursor.x,1,cursor.y);
                                cursor.advance(1);
                                apps.filter+=' ';
                                break;
                            case 'enter':
                                ap37.openApp(apps.list[0].id);
                                apps.filter = '';
                                break;
                            case 'ctrl':
                                if (keyboard.ctrlActive) {
                                    keyboard.set_ctrlActive=0;
                                } else {
                                    keyboard.set_ctrlActive=1;
                                }
                                break;
                            default:

                                if (!(this.name == 'null')) {
                                    print(cursor.x,cursor.y,this.name,color.scheme('[color.prefScheme].bareText.filterLong'))
                                    apps.filter+=this.name;
                                    cursor.advance(1)
                                }
                        }
                        background.printPattern(0,w,4);
                        print(0,4,apps.filter,color.scheme('[color.prefScheme].bareText.filter'))
                        apps.isIntercept=1;
                        setTimeout(apps.init,1);


                    },
                    color.scheme('[color.prefScheme].keyboard.key')
                );
                keyboard.key[j][i].name = keyboard.layout[j][i];
                //myAddButton(0,60,3,66,'b','','red');
            }
        }
    },

    hide: function () {
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


    },

}

//modules

var background = {
    buffer: [],
    bufferColors: [],
    pattern: '',
    printPattern: function (x0, xf, y) {
        print(x0, y,
            background.pattern.substring(y * w + x0, y * w + xf),
            '#333333');
    },
    init: function () {
        background.pattern = rightPad(script, h * w, ' ');

        for (var i = 0; i < h; i++) {
            background.buffer.push(background.pattern.substr(i * w, w));
            background.bufferColors.push(arrayFill('#333333', w));
        }

        ap37.printLines(background.buffer, '#333333');
    }
};

var time = {
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

var battery = {
    update: function () {
        print(Math.floor(w*0.6), 0,
            leftPad(ap37.getBatteryLevel(), 3, ' ')+'%',color.scheme('[color.prefScheme].bareText.battery'));
    },
    init: function () {
        battery.update();
        setInterval(battery.update, 60000);
    }
};

var notifications = {
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

var apps = {
    list: [],
    lineHeight: 2,
    topMargin: 6,
    bottomMargin: 4,
    bottomMargin2: 4,
    lines: 0,
    appWidth: 6,
    appsPerLine: 0,
    appsPerPage: 0,
    currentPage: 0,
    palette1:1,  //main
    palette2:2,  //accent
    palette3:1,  //_
    isNextPageButtonVisible: false,
    unique:[],
    isStrict:1,
    isAuto:1,
    filter:'',
    printPage: function () {
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
            app.y = y;
            app.x0 = x;
            app.xf = x + apps.appWidth;
            //apps.printApp(app, false);
            //printApp: function (app, highlight) 
            //color.i= keyboard.chars.indexOf(app.name.substring(0,1).toLowerCase())

            //uncomment next line to enable short name for apps;
            //app.name=app.name.replace(/(?<!^| )[aeiouAEIOU](?=[^ ])/g,'');
            print(app.x0, app.y, '_' +

                app.name.substring(0, apps.appWidth - 2),
                color.scheme('[color.prefScheme].apps.name.base'));
            //uncomment to disable second line
            print(app.x0, app.y+1, '  ' +

                app.name.substr(apps.appWidth - 2,apps.appWidth - 3),
                color.scheme('[color.prefScheme].apps.name.base'));



            print(app.x0 , app.y, '_' , color.scheme('[color.prefScheme].apps.name.dash'));
            printCapital(app.x0 + 1, app.y, app.name.substring(0, apps.appWidth - 2), color.scheme('[color.prefScheme].apps.name.accent'));
            printCapital(app.x0 + 2, app.y+1, app.name.substr(apps.appWidth -2, apps.appWidth - 3), color.scheme('[color.prefScheme].apps.name.accent'));



            appPos++;
            //save and take break if exhaused
            y += apps.lineHeight;
            if ( y >= apps.topMargin + apps.lines *apps.lineHeight) {
                y=apps.topMargin;
                x += apps.appWidth;

            }
            print(4,4,leftPad(x,3,'0')+'     '+leftPad(y,3,'0'))
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
    printApp: function (app, highlight) {
        color.i= keyboard.chars.indexOf(app.name.substring(0,1).toLowerCase())

        //uncomment next line to enable short name for apps;
        //app.name=app.name.replace(/(?<!^| )[aeiouAEIOU](?=[^ ])/g,'');
        print(app.x0, app.y, '_' +

            app.name.substring(0, apps.appWidth - 2),
            highlight ? '#ff3333' : color.scheme('[color.prefScheme].apps.name.base'));
        //uncomment to disable second line
        print(app.x0, app.y+1, '  ' +

            app.name.substr(apps.appWidth - 2,apps.appWidth - 3),
            highlight ? '#ff3333' : color.scheme('[color.prefScheme].apps.name.base'));


        if (highlight) {
            setTimeout(function () {
                apps.printApp(app, false);
            }, 1000);
        } else {
            print(app.x0 , app.y, '_' , color.scheme('[color.prefScheme].apps.name.dash'));
            printCapital(app.x0 + 1, app.y, app.name.substring(0, apps.appWidth - 2), color.scheme('[color.prefScheme].apps.name.accent'));
            printCapital(app.x0 + 2, app.y+1, app.name.substr(apps.appWidth -2, apps.appWidth - 3), color.scheme('[color.prefScheme].apps.name.accent'));
        }

    },
    construct: function () {
        apps.unique =[];
        apps.list2 = ap37.getApps();
        apps.list2.map(function (v,i,a){
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
        apps.list2.sort(lengthSort);
        function alphabeticSort(a,b){
            return keyboard.chars.indexOf(a.name[0].toLowerCase())-
                keyboard.chars.indexOf(b.name[0].toLowerCase())
        }

        function lengthSort(a,b){
            return a.name.length-
                b.name.length
        }
    },
    init: function () {
        apps.isIntercept=0;
        if (apps.isStrict) {
            var pattern= eval('/.*'+apps.filter.toUpperCase().split('').join('.*')+'/');
        } else {
            var pattern= eval(('/^'+apps.filter.toLowerCase()+'.*/i').replace(' ','.*'));
        }

        apps.list=apps.list2.filter(function (v,i,a){
            var out = pattern.test(v.name);
            return out;
        })
        if (apps.isAuto && apps.list.length == 1) {
            ap37.openApp(apps.list[0].id);
            apps.filter = '';
                        apps.isIntercept=1;
                        setTimeout(apps.init,1);
        }
        print(0,5,apps.list.length,color.scheme('[color.prefScheme].bareText.shownApp'));
        apps.lines = Math.floor(
            (h - apps.topMargin - apps.bottomMargin) / apps.lineHeight);
        apps.appsPerLine = Math.ceil(apps.list.length / apps.lines);
        apps.appWidth = Math.floor(w / apps.appsPerLine);

        // check minimum app name length
        if (apps.appWidth < 6) {
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

        apps.hide();
        apps.printPage(apps.currentPage);

        apps.isHidden=0;
        ap37.setOnAppsListener(apps.construct);
    },
    hide: function () {
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

var markets = {
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

var transmissions = {
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

var wordGlitch = {
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

var lineGlitch = {
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

function print(x, y, text, color) {
    color = color || '#ffffff';
    background.buffer[y] = background.buffer[y].substr(0, x) + text +
        background.buffer[y].substr(x + text.length);
    for (var i = x; i < x + text.length; i++) {
        background.bufferColors[y][i] = color;
    }
    ap37.print(x, y, text, color);
}

function get(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
        if (xhr.status === 200) {
            callback(xhr.response)
        }
    };
    xhr.send();
}

function leftPad(str, newLength, char) {
    str = str.toString();
    return newLength > str.length ?
        new Array(newLength - str.length + 1).join(char) + str : str;
}

function rightPad(str, newLength, char) {
    str = str.toString();
    return newLength > str.length ?
        str + new Array(newLength - str.length + 1).join(char) : str;
}

function arrayFill(value, length) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result.push(value);
    }
    return result;
}

init();
})();

// pull requests github.com/apseren/ap37
