

let charsGreenFade  = Array.prototype.slice.call( document.getElementsByClassName( 'greenFade' ) );
let cgfLength       = charsGreenFade.length;
let registeredChars = [];
let index           = 0;
let opacities       = [
  '0.26', '0.30', '0.34', '0.38', '0.42',
  '0.46', '0.50', '0.54', '0.58', '0.62',
  '0.66', '0.70', '0.74', '0.78', '0.82',
  '0.86', '0.90', '0.94', '0.98', '1.00',
  '0.96', '0.92', '0.88', '0.84', '0.80',
  '0.76', '0.72', '0.68', '0.64', '0.60',
  '0.56', '0.52', '0.48', '0.44', '0.40',
  '0.36', '0.32', '0.28', '0.24', '0.20',
];

class registerChar {
  constructor( char ) {
    this.pos = Math.round( ( ( opacities.length / 2 ) / cgfLength ) * charsGreenFade.indexOf( char ) );
  }
  changePosForOpacity() {
    this.pos += 1;
    if ( this.pos == opacities.length ) {
      this.pos = 0;
    }
    return this.pos;
  }
}

function loopPromises() {
  new Promise( function( resolve, reject ) {
    setTimeout(
      function() {
        if ( index == cgfLength ) index = 0;
        let charElement    = charsGreenFade[ index ];
        let charRegistered = registeredChars[ index ];
        let opacity        = opacities[ charRegistered.changePosForOpacity() ];
        //opacity = ( Math.sin( X / cgfLength - 5 ) / 2 ) + 0.5;
        charElement.style.color = `rgba(35, 209, 112, ${opacity})`;
        resolve();
      }, 10
    )
  } ).then( function( value ) {
    index += 1;
    loopPromises();
  } )
}

function __init__() {
  charsGreenFade.forEach( char => {
    registeredChars.push( new registerChar( char ) );
  } )
  loopPromises()
}
__init__();

