'use strict';

import mongoose from 'mongoose';

// create new schema
const schema = new mongoose.Schema({
  title: String,
  year: Number,
  url: String,
  text: String
});
// virtual date attribute
schema.virtual('date').get(() => this._id.getTimestamp());
// assign schema to 'Movie'
mongoose.model('Movie', schema);
