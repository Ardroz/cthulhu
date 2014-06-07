/* jslint node: true */
'use strict';

module.exports = {
  keysNotFound:  function ( keys ) {
    return {
      type: 'Key(s) not found',
      message: "The following key(s) wasn't found: " + keys.join(',')
    };
  }
};