/* jslint node: true */
'use strict';

var express       = require('express'),
    fs            = require('fs'),
    http          = require('http'),
    mongoose      = require('mongoose'),
    path          = require('path');

var app = express();

// all environments
app.set( 'port', process.env.PORT || 9999 );
app.use( express.logger('dev') );
app.use( express.json() );
app.use( express.urlencoded() );
app.use( express.methodOverride() );

// development only
if ( 'development' == app.get('env') ) {
  app.use( express.errorHandler() );
}

var conectionString = 'mongodb://paraisapi:27017/ingress';
// var conectionString = 'mongodb://localhost:27017/mocha';

mongoose.connect( conectionString, function ( err ) {
  if ( err ) { throw err; }
  console.log('Successfully connected to MongoDB');
});


fs.readdirSync( __dirname + '/sections' ).forEach( function ( file ) {
  var fullpath    = __dirname + '/sections/' + file;
  if ( fs.existsSync( fullpath ) && file !== 'lib' ) {
    require( fullpath )( app );
  }
});

http.createServer( app ).listen( app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});
