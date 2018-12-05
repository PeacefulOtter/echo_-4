
// All elements we need to display the Stats
let elFooterTab        = document.getElementById( 'footerTab'          );
let elPlayerRegistered = document.getElementById( 'pPlayerRegistered' );
let elKillsCumulated   = document.getElementById( 'pKillsCumulated'   );
let elWinsCumulated    = document.getElementById( 'pWinsCumulated'    );


window.onload = function( e ) {
  fetch( API_URL + 'home', {
    method  : 'POST',
    headers : { 'content-type' : 'application/json' }
  } ).then( res => {
    return res.json();
  } ).then( db => {
    // if the db is empty or any error happened, the server returns "error"
    if ( db == 'error' ) {
      // just hide the whole tab so it doesn't look like a "bug"
      elFooterTab.style.height     = '0px';
      elFooterTab.style.visibility = 'hidden';
      return;
    }
    console.log(db);
    elPlayerRegistered.innerHTML     = db.playerRegistered;
    elKillsCumulated.innerHTML       = db.killsCumulated;
    elWinsCumulated.innerHTML        = db.winsCumulated;
  } );
}
