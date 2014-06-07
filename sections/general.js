/* jslint node: true */
'use strict';
var fs        = require('fs'),
    errors    = require('./lib/errors'),
    success    = require('./lib/success'),
    warnings  = require('./lib/warnings'),
    __        = require('underscore')._,
    schemas   = {},
    basePath  = __dirname + '/../mongoose_models';

fs.readdirSync( basePath ).forEach(
  function ( file ) {
    var path = basePath + '/' + file;
    schemas[file.slice(0,-3)] = require( path );
  }
);

module.exports = function ( server ) {
  server.get( '/all/:schema/data', function ( req, res ) {
    var condition       = {},
        schema          = req.params.schema,
        fields          = '',
        keys            = [],
        warning         = {};

    for ( var key in schemas[schema].schema.paths ) {
      keys.push( key );
    }

    condition = req.body.condition !== undefined ? req.body.condition: {};

    keys = __.difference( req.body.fields, keys);
    if ( keys.length > 0 ) {
      if ( keys.length === req.body.fields.length ) {
        res.json( errors.noKeysFound( keys ) );
      }
      warning.keysNotFound = warnings.keysNotFound( keys );
    }

    if ( req.body.fields !== undefined ) {
      if ( req.body.fields.indexOf('_id') < 0 ) {
        req.body.fields.push('-_id');
      }
      fields = req.body.fields.join(' ');
    } else {
      fields = '-_id';
    }

    schemas[schema].find( condition ).select( fields ).exec(
      function ( err, docs ) {
        if ( err ) { throw err; }

        var toSend = { data:docs };

        res.json( toSend );
      }
    );
  });

  server.post( '/all/:schema/data', function ( req, res ) {
    var condition       = {},
        schema          = req.params.schema,
        fields          = '',
        keys            = [],
        allFields       = [],
        warning         = {};

    for ( var key in schemas[schema].schema.paths ) {
      keys.push( key );
      allFields.push( key );
    }

    condition = req.body.condition !== undefined ? req.body.condition: {};

    keys = __.difference( req.body.fields, keys);
    if ( keys.length > 0 ) {
      if ( keys.length === req.body.fields.length ) {
        res.json( errors.noKeysFound( keys ) );
      }
      warning.keysNotFound = warnings.keysNotFound( keys );
    }

    if ( req.body.fields !== undefined ) {
      if ( req.body.fields.length === 1 && req.body.fields[0] === '_id') {
        fields = allFields.join(' ');
      } else {
        if ( req.body.fields.indexOf('_id') < 0 ) {
          req.body.fields.push('-_id');
        }
        fields = req.body.fields.join(' ');
      }
    } else {
      fields = '-_id';
    }

    schemas[schema].find( condition ).select( fields ).exec(
      function ( err, docs ) {
        if ( err ) { throw err; }

        var toSend = { data:docs };

        res.json( toSend );
      }
    );
  });

  server.post( '/portal/new', function ( req, res ) {
    var portal = new schemas.portal({
      id: req.body.guid,
      data: req.body.data
    });

    // Convert the Model instance to a simple object using Model's 'toObject' function
    // to prevent weirdness like infinite looping...
    var upsertData = portal.toObject();

    // Delete the _id property, otherwise Mongo will return a "Mod on _id not allowed" error
    delete upsertData._id;

    // Do the upsert, which works like this: If no Contact document exists with
    // _id = contact.id, then create a new doc using upsertData.
    // Otherwise, update the existing doc with upsertData
    schemas.portal.update( {_id: portal.id}, upsertData, {upsert: true}, function(err){
      console.log(err);
    });
  });

};
