// the http module have method to help create the server
const http = require('http');

// Create the server instance
// req :  incoming request
// res :  outgoing response

/* V1 */
/*
const server = http.createServer((req, res) => {

    const pathName = req.url;

    const request_json = JSON.stringify(req.POST);

    // send a response to client
    if (req.url == '/friends')
        res.end("Hello Friend");
    else if (req.url == '/')
        res.end("Hello From root");
    else
        res.end("Why are u running ?");
});

i
// start server listening for request
server.listen(3000, 'localhost', () => {
    console.log('Server is listening at localhost on port 3000');
});
*/

/* V2 */
/*
const express = require('express');
var app = express();

app.get('/', (req, res) => {
    res.send('Hello Root')
});

app.get('/friends', (req, res) => {
    res.send('Hello Friends')
});

app.listen(process.env.PORT || 3000)*/

/* V3 */
/*
const express = require('express');
var bodyParser = require('body-parser');

// create application/json parser
var jsonParser = bodyParser.json();

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false });

var app = express();

app.post('/', urlencodedParser , function(req, res){
    console.log("JSON POST BODY : %j", req.body);
    console.log("JSON ID : " + req.body.responseId);
    res.writeHead(200, {'Content-type': 'text/html' });
    res.end('<h1>Hello World</h1>');
});*/

/* V4 */
/* WORKING */
const express = require('express');
require("dotenv").config();

const app = express();

app.use(express.json());

// set the view engine to ejs
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);

require("dotenv").config()  ;

function check_autorisation(header)
{
    
    var authentication = header.authorization.replace(/^Basic/, '');
    authentication = (new Buffer(authentication, 'base64')).toString('utf8');
    var loginInfo = authentication.split(':');

    return (loginInfo[0] == process.env.LOGIN && process.env.PASSWD);
}

function authenticationStatus(resp) {
    resp.writeHead(401, { 'WWW-Authenticate': 'Basic realm="' + '"' });
    resp.end('Authorization is needed !');
}

function authenticationFailed(resp)
{
    resp.writeHead(401, { 'WWW-Authenticate': 'Basic realm="' + '"' });
    resp.end('Authorization failed !');
}

app.get('/', function(req, res){
    res.render('pages/index');
});


app.post('/webhook', function(req, res){

    if (!req.headers.authorization) {
        authenticationStatus (res);
        return;
    }

    if (!check_autorisation(req.headers))
    {
        authenticationFailed(res);
        return;
    }
    
    console.log("JSON POST BODY : %j", req.body);
    res.writeHead(200, {'Content-type': 'text/html' });

    res.end('<h1>Hello World</h1>');
});

app.listen(process.env.PORT || 3000);
