var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var Portal = new Schema({
  id: { type: String, required: true, index: { unique: true } },
  data: {}
});

module.exports = mongoose.model('Portal', Portal);
