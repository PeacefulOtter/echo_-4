

const API_URL        = 'http://localhost:5000/';
let elCroppedDiv     = document.getElementById( 'cropTabImage' );
let elCroppedImg     = document.getElementById( 'tabImage' );
let elTitleContainer = document.getElementById( 'titleContainer' );
let elMainBody       = document.getElementById( 'mainBody' );


// if user pressed Enter it triggers searchStats()
document.onkeydown = function( e ) { if ( e.keyCode == 13 ) { searchStats(); } }



function searchStats() {
  // first we want to change the background.
  elCroppedDiv.style.zIndex      = '1000';
  elCroppedDiv.style.height      = '120%';
  elCroppedImg.style.width       = '120%';
  elCroppedImg.style.height      = '120%';
  elTitleContainer.style.display = 'none';
  elMainBody.style.display       = 'none';
  window.scroll( 0, 0 );

  // Grab the value from the input in the tab menu
  let sInputBar      = document.getElementsByClassName( 'searchInputBar' )[ 0 ];
  let inputUsername  = sInputBar.value || null;

  function getUsername() {
    return new Promise( function( resolve, reject ) {
      if ( inputUsername == null ) {
        swal( {
          title              : 'Enter your Fortnite username',
          input              : 'text',
          inputAttributes    : { autocapitalize : 'off' },
          confirmButtonText  : 'CONTINUE',
          showCloseButton    : true,
          inputValidator     : ( value ) => {
            return !value && 'You need to enter something!'
          },
          allowOutsideClick  : () => !swal.isLoading(),
          customClass        : 'sweetAlertFortniteBox',
          confirmButtonClass : 'sweetAlertFortniteConfirmButton'
        } ).then( function( value ) { resolve( value.value ); } )
      } else { resolve( inputUsername ); }
    } ).catch( function( error) { returnToNormalPage(); } );
  }


  // iterate through pbObject (located in manageButtonsTab.js)
  function checkPlatform() {
    return new Promise( function( resolve, reject ) {
      Object.keys( pbObject ).map( function( key, index ) {
        // Since all the keys are corresponding to a platform's name,
        // we can return the key !
        let p = pbObject[ key ];
        if ( !p.checked ) return;
        else { resolve( key ); }
      } );
      resolve( null );
    } )
  }

  function getPlatform() {
    return new Promise( function( resolve, reject ) {
      checkPlatform().then( function( buttonPlatform ) {
        if ( buttonPlatform == null ) {
          swal( {
            title              : 'Choose the platform',
            confirmButtonText  : 'SEARCH',
            input              : 'radio',
            inputOptions       : {
              'pc'  : 'Computer',
              'psn' : 'Playstation',
              'xbl' : 'Xbox'
            },
            inputValidator     : ( value ) => {
              return !value && 'You need to choose something!'
            },
            showCloseButton    : true,
            allowOutsideClick  : () => !swal.isLoading(),
            customClass        : 'sweetAlertFortniteBox',
            confirmButtonClass : 'sweetAlertFortniteConfirmButton'
          } ).then( function( value ) {
            resolve( value.value );
          } )
        } else { resolve( buttonPlatform ); }
      } )
    } ).catch( function( error) { returnToNormalPage(); } );
  }

  getUsername().then( function( value ) {
    let username = encodeURIComponent( value );
    if ( username == 'undefined' ) return returnToNormalPage();
    getPlatform().then( function( value ) {
      let platform = encodeURIComponent( value );
      if ( platform == 'undefined' ) return returnToNormalPage();
      let pushData = {
        'username' : username,
        'platform' : platform
      };

      // send a post request to our backend (to request the stats)
      fetch( API_URL + 'search', {
        method  : 'POST',
        body    : JSON.stringify( pushData ),
        headers : { 'content-type' : 'application/json' }
      } ).then( res => {
        return res.json();
      } ).then( player => {
        if ( player.status.type == 'warning' ) {
          swal( {
            position          : 'top-end',
            type              : player[ 'status' ][ 'type'  ],
            title             : player[ 'status' ][ 'title' ],
            text              : player[ 'status' ][ 'text'  ],
            showConfirmButton : false,
            customClass       : 'sweetAlertFortniteBox',
            timer             : 2000
          } )
          returnToNormalPage();
        }
        else if ( player.status.type == 'success' ) {
          window.location.href = 'http://localhost:8000/pages/users.html#' + player.accountid;
        }
      } )
    } )
  } )

  function returnToNormalPage() {
    elCroppedDiv.style.zIndex      = '0';
    elCroppedDiv.style.height      = '25%';
    elCroppedImg.style.width       = '100%';
    elCroppedImg.style.height      = 'auto';
    elTitleContainer.style.display = 'initial';
    elMainBody.style.display       = 'initial';
  }
}
