
const pbObject = {
  'pc'  : document.getElementById( 'pcButtonTab' ),
  'psn' : document.getElementById( 'psnButtonTab' ),
  'xbl' : document.getElementById( 'xblButtonTab' ),
};

function pbUpdate( src ) {
  Object.keys( pbObject ).map( function( key, index ) {
    let dummyEl = pbObject[ key ];
    // The user selected this button, so change the border color
    let isColorTransparent = (dummyEl.style.borderColor == 'transparent')
    if ( key == src ) {
      let c = isColorTransparent ? '#23d170' : 'transparent';
      dummyEl.style.borderColor = c;
    // the other buttons musnt have a colored border
    } else {
      dummyEl.style.borderColor = 'transparent';
    }
  } )
}

// init a border for each buttons
Object.keys( pbObject ).map( function( key, index ) {
  let dummyEl = pbObject[ key ];
  dummyEl.style.borderWidth = '0.25vw';
  dummyEl.style.borderStyle = 'solid';
  dummyEl.style.borderColor = 'transparent';
} )