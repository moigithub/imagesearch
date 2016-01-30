'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Images = new Schema({
    term: String,
    when: Date
});

module.exports = mongoose.model('Images', Images);
