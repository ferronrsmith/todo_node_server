/*jslint node: true, nomen: true, devel : true */
/*global delete*/
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var todo = require('./routes/todo');
var http = require('http');
var path = require('path');

var app = express();
exports.app = app;

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express['static'](path.join(__dirname, 'public')));

// development only
if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);

app.get('/todo', todo.list);
app.post('/todo', todo.create);
app.put('/todo/:id', todo.update);
app['delete']('/todo/:id', todo.remove);

http.createServer(app).listen(app.get('port'), function () {
    "use strict";
    console.log('Express server listening on port ' + app.get('port'));
});
