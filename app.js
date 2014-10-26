var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var swig = require('swig');
var nodemailer = require('nodemailer');

var app = express();

// view engine setup
app.engine('html', swig.renderFile);

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, '/views'));
app.set('view engine', 'html');
app.set('view cache', false);
swig.setDefaults({ cache: false });

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Email configuration
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
        user: "grayshirts.smtp@gmail.com",
        pass: "grayshirts"
    }
});

// Methods
/* GET home page. */
app.get('/', function(req, res) {
  res.render('index');
});
/* GET works page. */
app.get('/work', function(req, res) {
    res.render('work',{
    section: 'work'
  });
});
app.get('/work/:id', function(req, res) {
    res.render('work/'+req.params.id,{
    section: 'work'
  });
});
/* GET about page. */
app.get('/about', function(req, res) {
  res.render('about',{
    section: 'about'
  });
});
/* GET contact page. */
app.get('/contact', function(req, res) {
  res.render('contact',{
    section: 'contact'
  });
});
/* POST contact page. */  
app.post('/contact', function (req, res) {
    var mailOptions = {
        from: req.param('email', null), // sender address
        to: 'nico@grayshirts.com.ar', // list of receivers
        subject: 'Contacto Grayshirts', // Subject line
        html: '<b>Name:</b> ' + req.param('name', null) + '<br><b>Email:</b> ' + req.param('email', null) + '<br><b>Company:</b> ' + req.param('company', null) + '<br><b>Project:</b> ' + req.param('project', null) + '<br><b>Message:</b> ' +  req.param('desc', null)
    }
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
          res.render("contact", { error: "Ah ocurrido un error. Intentalo en unos instantes." });
        }else{
          res.render("contact", { success: "Mensaje enviado." });
        }
        smtpTransport.close(); // shut down the connection pool, no more messages
    });
});


/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;

var server = app.listen(app.get('port'), function() {
    console.log('Listening on port %d', server.address().port);
});
