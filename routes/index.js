var express = require('express');
var router = express.Router();

const SerialPort = require('serialport')

var globalStatus = "Not connected";
var globalStatusFlag = 0;

var globalBaud = 0;
var globalPort = 0;
var portas = [];
var port;
var connected = 0;

var txdata = [];
var rxarray = [];
var rxdata = 0;

router.get('/', function(req, res, next) {
  portas = [];
  if(globalStatus == 0){globalStatus = "Not connected"};
  SerialPort.list().then(
    ports => {
     ports.forEach(port => {
      portas.push(port.comName);
     })},
    err => {
     console.error('Error listing ports', err)
     globalStatus = "Error on listing ports";
     globalStatusFlag = 0;
    }
   )
   res.render('index', { title: 'SerialController',ports:portas,status:globalStatus,statusFlag:globalStatusFlag,txdata:txdata,rxdata:rxarray});
  });

router.post('/', function (req, res) {

  console.log(req.body);
  globalPort = req.body.port;
  globalBaud = req.body.baud;

  connect();

  port.open(function (err) {
    if (err) {
      return console.log('Error opening port: ', err.message)
    }else{      
    globalStatusFlag = 1;
    globalStatus = "Connected";
    }
  })

  if(req.body.up){
    port.write('3', function(err) {
     txdata.push(3);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };
  if(req.body.my){
    port.write('4', function(err) {
      txdata.push(4);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };
  if(req.body.down){
    port.write('5', function(err) {
      txdata.push(5);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };

  if(req.body.prog){
    port.write('6', function(err) {
      txdata.push(6);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };
  
  if(req.body.upmy){
    port.write('7', function(err) {
      txdata.push(7);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };
  
  if(req.body.updown){
    port.write('8', function(err) {
      txdata.push(8);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };
  
  if(req.body.mydown){
    port.write('9', function(err) {
      txdata.push(9);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };

  if(req.body.one){
    port.write('1', function(err) {
      txdata.push(1);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };
  if(req.body.two){
    port.write('2', function(err) {
      txdata.push(2);
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };
  if(req.body.ump){
    port.write(':', function(err) {
      txdata.push(":");
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };
  if(req.body.doisp){
    port.write(';', function(err) {
      txdata.push(";");
     if (err) {
      globalStatus = err.message;
      return console.log('Error on write: ', err.message)
     }
    })
  };

  
  if(req.body.cleartx){    
      txdata = [];
  };

  
port.on('readable', function () {
  var rx = null;
  var rxstring = null;
  rxdata = port.read()
  if(rxdata != "null"){
    rx = rxdata;
    if(Buffer.isBuffer(rx)){
      if(rx.includes('null') == false) rxstring = rx.toString();
      
    } 
    rxarray.push(rxstring);
    if (rxarray.length > 10) {
      rxarray = [];
    }
  console.log('Data:', rxarray);
  }
});

  res.render('index', {title: 'SerialController',ports:portas,status:globalStatus,baud:globalBaud,port:globalPort,statusFlag:globalStatusFlag,txdata:txdata,rxdata:rxarray});
});


module.exports = router;


function connect(){
  if(connected){

  }else{
  port = new SerialPort( globalPort, { baudRate: Number(globalBaud),autoOpen: false });

    connected = 1;
  }
}