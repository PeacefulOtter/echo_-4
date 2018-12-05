
/*
  Thanks to w3cj alias CodingGarden
  Repo: meower - https://github.com/CodingGarden/meower
*/


// To build our backend server
const express        = require( 'express' );
// To get request API from other domains
const cors           = require( 'cors' );
// Set a rate limit to avoid spamming
const rateLimit      = require(  'express-rate-limit' );
const fetch          = require( 'node-fetch' );
const fortniteApiUrl = 'https://api.fortnitetracker.com/v1/profile/';
const initMethod     = {
  method  : 'GET',
  headers : {
    'Access-Control-Allow-Origin' : '*',
    'User-Agent'   : 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0',
    'Content-type' : 'application/json',
    'TRN-Api-Key'  : '35b9c881-9263-4525-b011-3571546b9ba5'
  },
  mode  : 'cors',
  cache : 'default'
};


// init our app
const app = express();
app.enable( 'trust proxy' );
app.use( cors() );
app.use( express.json() );
app.use( rateLimit( {
  windowMs : 1 * 1000, // 1 seconds
  max : 1
} ) );

// init our db
const mongoose  = require( 'mongoose' );
const dbOptions = {
  useNewUrlParser: true,
  socketTimeoutMS: 30000,
  keepAlive: true,
  reconnectTries: 30000
};
const uri = 'mongodb://LordGenji:TrashCan147@echocluster-shard-00-00-7iddl.mongodb.net:27017,echocluster-shard-00-01-7iddl.mongodb.net:27017,echocluster-shard-00-02-7iddl.mongodb.net:27017/test?ssl=true&replicaSet=EchoCluster-shard-0&authSource=admin&retryWrites=true'
mongoose.connect( uri, dbOptions );
let db = mongoose.connection;
// Any error occured
db.on( 'error',  console.error.bind( console, 'connection error' ) );
// Once the db is opened
db.once( 'open', console.log.bind(   console, 'Database Opened'  ) );

const PlayersStatsModel  = require( './models/playersStats'  );
const DatabaseStatsModel = require( './models/databaseStats' );

/* WARNING : this remove the entire model,
  restart the server once to apply */
/*
PlayersStatsModel.remove({}, function(err) {
   console.log('collection removed')
});
*/
/*
DatabaseStatsModel.remove({}, function(err) {
   console.log('collection removed')
});
*/
// see the whole db
/*
PlayersStatsModel.find( function( err, models ) {
  if ( err ) return console.error( err );
  console.log( 'allmodels ', models );
} )
*/

// Retrieve stats from the database stats
app.post( '/home', ( req, res, next ) => {
  DatabaseStatsModel.find( {} , function( err, dbStats ) {
    if ( err ) {
      console.error( ' > Error while retrieving stats from the database : ', err );
      res.json( 'error' );
    }
    let dbS = dbStats[ 0 ];
    // In case nothing is saved
    if ( dbS == undefined ) { res.json( 'error' ); }
    res.json( dbS );
  } )
} );


// Search stats from a player and add/update them
app.post( '/search', ( req, res, next ) => {
  let platform = req.body.platform;
  let username = req.body.username;
  let statsUrl = fortniteApiUrl + platform + '/' + username;

  console.log( 'Requested : ', statsUrl );

  function ftnData() {
    return new Promise( resolve => {
      return fetch( statsUrl, initMethod )
        .then( resp => {
          return resp.json();
        } ).then( data => {

          if ( data == undefined ) {
            resolve( {
              'status' : {
                'title' : 'An error occured..',
                'text'  : 'Can\'t find this player',
                'type'  : 'warning'
              }
            } );
          }

          let filteredData = {
            'solo' : {
              'top1'    : data[ 'stats' ][ 'p2' ][ 'top1'     ][ 'value' ],
              'winpct'  : data[ 'stats' ][ 'p2' ][ 'winRatio' ][ 'value' ],
              'kills'   : data[ 'stats' ][ 'p2' ][ 'kills'    ][ 'value' ],
              'matches' : data[ 'stats' ][ 'p2' ][ 'matches'  ][ 'value' ],
              'kd'      : data[ 'stats' ][ 'p2' ][ 'kd'       ][ 'value' ]
            },
            'duo' : {
              'top1'    : data[ 'stats' ][ 'p10' ][ 'top1'    ][ 'value' ],
              'winpct'  : data[ 'stats' ][ 'p10' ][ 'winRatio'][ 'value' ],
              'kills'   : data[ 'stats' ][ 'p10' ][ 'kills'   ][ 'value' ],
              'matches' : data[ 'stats' ][ 'p10' ][ 'matches' ][ 'value' ],
              'kd'      : data[ 'stats' ][ 'p10' ][ 'kd'      ][ 'value' ]
            },
            'squad' : {
              'top1'    : data[ 'stats' ][ 'p9' ][ 'top1'     ][ 'value' ],
              'winpct'  : data[ 'stats' ][ 'p9' ][ 'winRatio' ][ 'value' ],
              'kills'   : data[ 'stats' ][ 'p9' ][ 'kills'    ][ 'value' ],
              'matches' : data[ 'stats' ][ 'p9' ][ 'matches'  ][ 'value' ],
              'kd'      : data[ 'stats' ][ 'p9' ][ 'kd'       ][ 'value' ]
            },
            'life' : {
              'kills'   : data[ 'lifeTimeStats' ].find( d => d.key == 'Kills' ).value,
              'kd'      : data[ 'lifeTimeStats' ].find( d => d.key == 'K/d' ).value,
              'wins'    : data[ 'lifeTimeStats' ].find( d => d.key == 'Wins' ).value,
              'winpct'  : data[ 'lifeTimeStats' ].find( d => d.key == 'Win%' ).value,
              'mPlayed' : data[ 'lifeTimeStats' ].find( d => d.key == 'Matches Played' ).value,
              'score'   : data[ 'lifeTimeStats' ].find( d => d.key == 'Score' ).value,
              'top3'    : data[ 'lifeTimeStats' ].find( d => d.key == 'Top 3s' ).value,
              'top10'   : data[ 'lifeTimeStats' ].find( d => d.key == 'Top 10' ).value,
              'top25'   : data[ 'lifeTimeStats' ].find( d => d.key == 'Top 25s' ).value
            }
          };
          let status = { 'title' : 'It Worked !', 'text' : '', 'type' : 'success' }
          /* https://stackoverflow.com/questions/23593052/format-javascript-date-to-yyyy-mm-dd */
          let date = new Date();
          let dateString = new Date(
            date.getTime() - ( date.getTimezoneOffset() * 60000 )
          ).toISOString();
          let cleanDate = dateString.split( 'T' )[ 0 ] + ' ' + dateString.split( 'T' )[ 1 ].split( '.' )[ 0 ];

          resolve( {
            'username'  : data[ 'epicUserHandle' ],
            'accountid' : data[ 'accountId' ],
            'stats'     : filteredData,
            'status'    : status,
            'date'      : cleanDate
          } );
        } )
    } )
  }

  ftnData().then( player => {
    // create the account for the database
    let FreshAccount = new PlayersStatsModel( {
      name  : player.username,
      id    : player.accountid,
      stats : player.stats,
      dates : [ player.date ]
    } );

    let FreshDatabase = new DatabaseStatsModel( {
      playerRegistered : 1,
      killsCumulated   : parseInt( player.stats.life.kills, 10 ),
      winsCumulated    : parseInt( player.stats.life.wins,  10 )
    } );


    // search for all registered accounts
    PlayersStatsModel.find( {}, function( err, accounts ) {
      if ( err ) return console.error( ' > Error while requesting accounts ', err );

      let playerInDb       = false;
      let freshAccountLife = FreshAccount.stats.life;
      let storedStatsProps = [ 'kills', 'kd', 'wins', 'winpct', 'mPlayed' ];

      for ( let account of accounts ) {
        // check if the account is the one we are looking for
        if ( account.id == FreshAccount.id ) {
          playerInDb      = true;
          let accountLife = account.stats.life;

          // store the new values into each props array
          storedStatsProps.forEach( ( props ) => {
            let accountLifeProps = accountLife[ props ];
            let lastValueProps   = freshAccountLife[ props ];
            // add the last value to all the others
            accountLifeProps.push( lastValueProps );
            // we don't need to store more then 30 values !
            if ( accountLifeProps.length >= 30 ) { accountLifeProps.shift(); }
            // store the new array in FreshAccount stats
            freshAccountLife[ props ] = accountLifeProps;
          } )

          // and add the time of update
          let nowDate = FreshAccount.dates[ 0 ];
          let updatedDates = account.dates;
          updatedDates.push( nowDate );
          // we don't need to store more then 30 values !
          if ( updatedDates.length >= 30 ) { updatedDates.shift(); }
          FreshAccount.dates = updatedDates;

          console.log('k ', FreshDatabase.killsCumulated);
          console.log('w ', FreshDatabase.winsCumulated);
          FreshDatabase.killsCumulated += FreshDatabase.killsCumulated - parseInt(
            account.stats.life.kills[ account.stats.life.kills.length - 1 ], 10
          );
          FreshDatabase.winsCumulated  += FreshDatabase.winsCumulated - parseInt(
            account.stats.life.wins[ account.stats.life.wins.length - 1 ],  10
          );
          console.log('k ', FreshDatabase.killsCumulated);
          console.log('w ', FreshDatabase.winsCumulated);
          console.log('k2 ', parseInt(
            account.stats.life.kills[ account.stats.life.kills.length - 1 ],  10
          ));
          console.log('w2 ', parseInt(
            account.stats.life.wins[ account.stats.life.wins.length - 1 ],  10
          ));

          PlayersStatsModel.findByIdAndUpdate(
            account._id,
            { $set: { stats: FreshAccount.stats, dates: FreshAccount.dates } },
            { new: true },
            function ( err, updatedAccount ) {
              if ( err ) return console.error( ' > Error while updating the player : ', err );
              console.log('updated : ', updatedAccount);
          } );
        }
      }


      if ( !playerInDb ) {
        storedStatsProps.forEach( ( props ) => {
          freshAccountLife[ props ] = Array( freshAccountLife[ props ] );
          console.log('not registered', freshAccountLife[ props ]);
        } )

        // save the account stats
        FreshAccount.save( function( err, updatedAccount ) {
            if ( err ) return console.error( ' > Error while saving the new player : ', err );
            console.log('saved account : ', updatedAccount);
        } );
      }


      // save the database stats
      DatabaseStatsModel.find( {}, function( err, dbStats ) {
        let dbS = dbStats[ 0 ];

        if ( dbS == undefined ) {
          console.log('llooolll');
          FreshDatabase.save( function( err, updatedDbStats ) {
            if ( err ) return console.error( ' > Error while saving database stats : ', err );
            console.log( 'saved database : ', updatedDbStats );
          } )
        }

        else {
          if ( playerInDb ) {
            FreshDatabase.playerRegistered = dbS.playerRegistered;
          } else if ( !playerInDb ) {
            FreshDatabase.playerRegistered += dbS.playerRegistered;
            FreshDatabase.killsCumulated   += dbS.killsCumulated;
            FreshDatabase.winsCumulated    += dbS.winsCumulated;
          }

          DatabaseStatsModel.findByIdAndUpdate(
            dbS._id,
            { $set: {
              playerRegistered: FreshDatabase.playerRegistered,
              killsCumulated:   FreshDatabase.killsCumulated,
              winsCumulated:    FreshDatabase.winsCumulated
            } },
            { new: true },
            function( err, updatedDbStats ) {
              if ( err ) return console.error( ' > Error while updating database stats : ', err );
              console.log( 'updated database : ', updatedDbStats );
          } );
        }

      } );
    } );

    res.json( player );
  } )
} );


// Retrieve stats from a player in ./users
app.post( '/users', ( req, res, next ) => {
  PlayersStatsModel.find( { id: req.body.accountid }, function( err, account ) {
    if ( err ) {
      console.error( ' > Error while retrieving stats from the database : ', err );
      res.json( { 'status' : 'warning' } );
    }
    res.json( account );
  } )
} );


app.use( ( error, req, res, next ) => {
  res.status( 500 );
  res.json( {
    message : error.message
  } );
} );

app.listen( 5000, () => {
  console.log( 'Listening on http://localhost:5000' );
} );
