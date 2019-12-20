// require imports packages required by the application
const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

// Define Host name and TCP Port for the server 
const HOST = '0.0.0.0';
const PORT = 8080;

// load passport miidleware Config
require('./security/passportConfig');

// app is a new instance of express (the web app framework)
let app = express();

//uses to display the webpage: table with the list of novels, login page and CRUM functions for novels
app.use(express.static('api-client'))

// Application settings
app.use((req, res, next) => {
    // Globally set Content-Type header for the application
    res.setHeader("Content-Type", "application/json");
    //res.setHeader("Access-Control-Allow-Origin", "http://localhost:8080");
    //res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    //res.setHeader("Access-Control-Allow-Methods", "*");
    next();
}); 

// Cookie support
app.use(cookieParser());

// Allow app to support differnt body content types (using the bidyParser package)
app.use(bodyParser.text());
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support url encoded bodies

//enable all cors request
app.use(cors({ credentials: true, origin: true }));
app.options('*', cors()) // include before other routes

/* Configure app Routes to handle requests from browser */
// The home page 
app.use('/', require('./routes/index'));

//Novel page - JSON layout
app.use('/novel', require('./routes/novel')); 

//AppUser page - JSON layout
app.use('/user', require('./routes/user')); 

//Login page
app.use('/login', require('./routes/login'));

//Author page - JSON layout
app.use('/author', require('./routes/author'));

//Type page - JSON layout
app.use('/type', require('./routes/type'));


// protected by jwt strategy as a middleware - only verified users can access this route
//app.use('/user', passport.authenticate('jwt', { session : false }), require('./routes/user') );


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found: '+ req.method + ":" + req.originalUrl);
    err.status = 404;
    next(err);
});

// Start the HTTP server using HOST address and PORT consts defined above
// Lssten for incoming connections
var server = app.listen(PORT, HOST, function() {
    console.log(`Express server listening on http://${HOST}:${PORT}`);
});

// export this as a module, making the app object available when imported.
module.exports = app;