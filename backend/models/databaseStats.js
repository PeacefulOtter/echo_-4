
const mongoose = require( 'mongoose' );

let databaseSchema = mongoose.Schema( {
  'playerRegistered' : Number,
  'killsCumulated'   : Number,
  'winsCumulated'    : Number
} );

module.exports = mongoose.model( 'Database', databaseSchema );
