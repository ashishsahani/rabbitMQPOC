const express = require('express');
const bodyParser = require('body-parser');
var amqp = require('amqplib/callback_api');


const app = express();


const PORT = 3000;

app.use(bodyParser.json());

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  //connection.createChannel(function(error1, channel) {});

  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var queue = 'push';
    //var msg = 'Hello world';

    channel.assertQueue(queue, {
      durable: false
    });

    app.post('/push', (req, res)=>{
        //console.log(req.query.message);
        channel.sendToQueue(queue, Buffer.from(req.query.message));
        console.log(" [x] Sent %s", req.query.message);
        res.send('pushed');
    });
    
    app.listen(PORT, ()=> {
        console.log(`App is running on ${PORT}`);
    });
    function close(){
        console.log('jhjahshsj');
        connection.close();
    }
    process.on('SIGTERM', close);
    
  });
});




  
