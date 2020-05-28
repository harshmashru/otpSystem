const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const Nexmo = require('nexmo');
const socketio = require('socket.io');
const otpnum = require('./public/js/otp');

const nexmo = new Nexmo({
    apiKey: '5293d564',
    apiSecret: 'UPlr9nA5rkjOscZ4'
}, {debug: true});

const app = express();

app.set('view engine', 'html');
app.engine('html',ejs.renderFile);

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req,res) => {
    res.render('index');
});

app.post('/', (req,res) => {
    // console.log(`hello`);
    const{number} = req.body;
    //  res.send(req.body);
    //  console.log(req.body);
    //const number = req.body.number;
    const otp = otpnum();
    console.log(otp);
    const text = `otp is ${otp}`;
    nexmo.message.sendSms(
        '919588279479', number, text, {type: 'unicode'},
        (err, responseData) => {
            if(err){
                console.log(err);
            }
            else{
                console.dir(responseData);
                const data = {
                    id: responseData.messages[0]['message-id'],
                    number: responseData.messages[0]['to']
                }

                io.emit('smsStatus',data);
            }
        }
    )
});

const port = 3000;
const server = app.listen(port, ()=> console.log(`server started on port ${port}`));

const io = socketio(server);
io.on('connection', (socket)=> {
    console.log('connected');
    io.on('disconnect', () => {
        console.log('Disconnected');
    })
})