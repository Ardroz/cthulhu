/* jslint node: true */
'use strict';

module.exports = {
  savedCorrectly:  function ( schema ) {
    return "Document saved correctly in: " + schema;
  },
  deletedCorrectly:  function () {
    return "Document deleted correctly";
  },
  updatedCorrectly:  function () {
    return "Document updated correctly";
  }
};