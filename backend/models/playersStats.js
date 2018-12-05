
const mongoose = require( 'mongoose' );

let playerSchema = mongoose.Schema( {
  'name'  : String,
  'id'    : String,
  'stats' : { },
  'dates' : []
} );

module.exports = mongoose.model( 'Players', playerSchema );
