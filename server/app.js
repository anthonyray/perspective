var express = require('express');
var path = require('path');
var logger = require('morgan');
var bodyParser = require('body-parser');
var formidable = require('formidable');
var routes = require('./routes/index');

var app = express();

// view engine setup

app.use(logger('dev'));
app.use(bodyParser.urlencoded( {limit:'10mb'} ));
app.use(express.static(path.join(__dirname, '../app')));
app.use('/', routes);


/// catch 404 and forwarding to error handler
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

app.listen(9000);
console.log('MEGASERVER IS LISTENING ON PORT 9000');
