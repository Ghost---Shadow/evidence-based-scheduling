var mongoose = require('mongoose');
var TaskSchema = new mongoose.Schema({
  name: String,
  estimated: Number,
  actual: Number,
  order: Number
});
module.exports = mongoose.model('Task', TaskSchema);
