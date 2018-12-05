
const API_URL        = 'http://localhost:5000/';
// All elements we need to display the Stats
let elUsername        = document.getElementById( 'playerUsername'   );
let elSoloKills       = document.getElementById( 'soloPKills'       );
let elSoloRatio       = document.getElementById( 'soloPRatio'       );
let elSoloMatches     = document.getElementById( 'soloPMatches'     );
let elSoloTop1        = document.getElementById( 'soloPTop1'        );
let elSoloWins        = document.getElementById( 'soloPWin%'        );
let elDuoKills        = document.getElementById( 'duoPKills'        );
let elDuoRatio        = document.getElementById( 'duoPRatio'        );
let elDuoMatches      = document.getElementById( 'duoPMatches'      );
let elduoTop1         = document.getElementById( 'duoPTop1'         );
let elduoWins         = document.getElementById( 'duoPWin%'         );
let elSquadKills      = document.getElementById( 'squadPKills'      );
let elSqualRatio      = document.getElementById( 'squadPRatio'      );
let elSquadMatches    = document.getElementById( 'squadPMatches'    );
let elSquadTop1       = document.getElementById( 'squadPTop1'       );
let elSquadWins       = document.getElementById( 'squadPWin%'       );
let elLifeKills       = document.getElementById( 'lifePKills'       );
let elLifeRatio       = document.getElementById( 'lifePRatio'       );
let elLifeMatches     = document.getElementById( 'lifePMatches'     );
let elLifeScore       = document.getElementById( 'lifePScore'       );
let elLifeWins        = document.getElementById( 'lifePWins'        );
let elLifeTops3       = document.getElementById( 'lifePTops3'       );
let elLifeTops10      = document.getElementById( 'lifePTops10'      );
let elLifeTops25      = document.getElementById( 'lifePTops25'      );
let elMegaWrapper     = document.getElementById( 'megaWrapperStats' );
let elLastUpdate      = document.getElementById( 'lastUpdateInfo'   );

window.onload = function( e ) {

  let bodyPostRequest = window.location.href.split( '#' )[ 1 ];
  if ( bodyPostRequest === undefined ) return;

  fetch( API_URL + 'users', {
    method  : 'POST',
    body    : JSON.stringify( { 'accountid' : bodyPostRequest } ),
    headers : { 'content-type' : 'application/json' }
  } ).then( res => {
    return res.json();
  } ).then( player => {

    // if the player wasn't find
    if ( player.length == 0 ) {
      swal( {
        position          : 'top-end',
        type              : 'error',
        title             : 'Can\'t find this player',
        showConfirmButton : false,
        customClass       : 'sweetAlertFortniteBox',
        timer             : 1200
      } );
      elUsername.innerHTML        = 'It looks like your looking for a wrong id..';
      elUsername.style.visibility = 'visible';
      return;
    }
    else if ( player[ 'status' ] == 'warning' ) {
      swal( {
        position          : 'top-end',
        type              : 'warning',
        title             : 'Something went wrong.. Please retry',
        showConfirmButton : false,
        customClass       : 'sweetAlertFortniteBox',
        timer             : 1200
      } );
      elUsername.innerHTML        = 'Something is wrong with the database..';
      elUsername.style.visibility = 'visible';
      return;
    }

    // or if we found him
    swal( {
      position          : 'top-end',
      type              : 'success',
      title             : 'Here comes the stats !',
      showConfirmButton : false,
      customClass       : 'sweetAlertFortniteBox',
      timer             : 1200
    } );

    elUsername.innerHTML     = player[ 0 ][ 'name' ];
    let playerS = player[ 0 ][ 'stats' ];
    elSoloKills.innerHTML    = playerS[ 'solo'  ][ 'kills' ];
    elSoloRatio.innerHTML    = playerS[ 'solo'  ][ 'kd' ];
    elSoloMatches.innerHTML  = playerS[ 'solo'  ][ 'matches' ];
    elSoloTop1.innerHTML     = playerS[ 'solo'  ][ 'top1' ];
    elSoloWins.innerHTML     = playerS[ 'solo'  ][ 'winpct' ];
    elDuoKills.innerHTML     = playerS[ 'duo'   ][ 'kills' ];
    elDuoRatio.innerHTML     = playerS[ 'duo'   ][ 'kd' ];
    elDuoMatches.innerHTML   = playerS[ 'duo'   ][ 'matches' ];
    elduoTop1.innerHTML      = playerS[ 'duo'   ][ 'top1' ];
    elduoWins.innerHTML      = playerS[ 'duo'   ][ 'winpct' ];
    elSquadKills.innerHTML   = playerS[ 'squad' ][ 'kills' ];
    elSqualRatio.innerHTML   = playerS[ 'squad' ][ 'kd' ];
    elSquadMatches.innerHTML = playerS[ 'squad' ][ 'matches' ];
    elSquadTop1.innerHTML    = playerS[ 'squad' ][ 'top1' ];
    elSquadWins.innerHTML    = playerS[ 'squad' ][ 'winpct' ];
    elLifeKills.innerHTML    = (playerS[ 'life' ]['kills'][playerS['life']['kills'].length-1]);
    elLifeRatio.innerHTML    = (playerS[ 'life' ]['kd'][playerS['life']['kd'].length-1]);
    elLifeMatches.innerHTML  = (playerS[ 'life' ]['mPlayed'][playerS['life']['mPlayed'].length-1]);
    elLifeScore.innerHTML    = playerS[ 'life'  ][ 'score' ];
    elLifeWins.innerHTML     = `${(playerS['life']['wins'][playerS[ 'life']['wins'].length-1])}
                              ( ${(playerS['life']['winpct'][playerS[ 'life']['winpct'].length-1])} )`;
    elLifeTops3.innerHTML    = playerS[ 'life'  ][ 'top3' ];
    elLifeTops10.innerHTML   = playerS[ 'life'  ][ 'top10' ];
    elLifeTops25.innerHTML   = playerS[ 'life'  ][ 'top25' ];

    let pDate = player[ 0 ][ 'dates' ][player[ 0 ][ 'dates' ].length-1];
    elLastUpdate.innerHTML   = pDate;
    // the div appears, Whoosh..
    elUsername.style.visibility    = 'visible';
    elMegaWrapper.style.visibility = 'visible';







    // Time for charts

    // LIFETIME KILLS
    new Chartist.Line(
      '.ct-chart',
      // data
      {
        // A labels array that can contain any sort of values
        labels: player[ 0 ][ 'dates' ],
        // Our series array that contains series objects or in this case series data arrays
        series: [
          playerS[ 'life' ]['kills']
        ]
      },
      // options
      {
        width: 800,
        height: 300,
        series: {
          lineSmooth: Chartist.Interpolation.simple(),
          showArea: true
        }
      }
    );

  } )
}

/**/
