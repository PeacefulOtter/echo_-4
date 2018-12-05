
let beforeScrollPos = 0;
let scrollAllowed   = true;
let scrollY         = window.scrollY;
let winMaxY         = window.scrollMaxY;
let maxScrollPos    = document.documentElement.clientHeight * 0.50;
let elWrapper       = document.getElementById( 'wrapper' );
let elImgWrapped    = document.getElementById( 'wrappedImg' );
let elParaWrapped   = document.getElementById( 'pOverImg' );
let elBtnWrapped    = document.getElementById( 'searchStatsButton' );
var p5 = new p5();


window.addEventListener( 'scroll', function ( event ) {
    let actualScrollPos = this.scrollY;
    // user moved down
    if (
      actualScrollPos > beforeScrollPos
      && actualScrollPos < winMaxY
      && scrollAllowed
    ) {
      scrollAllowed = false;
      new Promise( resolve => {
        function scrollBottom() {
          scrollY = window.scrollY;
          if ( scrollY < window.innerHeight / 2 ) {
            window.scrollBy( 0, 10 )
            setTimeout( scrollBottom, 10);
          }
          else {
            resolve();
          }
        }
        scrollBottom();
      } ).then( () => {
        console.log('demons')
        scrollAllowed = true;
      } );
    }

    else if (
        beforeScrollPos > actualScrollPos
        && scrollAllowed
      ) {
        scrollAllowed = false;
        new Promise( resolve => {
          function scrollBottom() {
            scrollY = window.scrollY;
            if ( scrollY > 0 ) {
              window.scrollBy( 0, -10 )
              setTimeout( scrollBottom, 10);
            }
            else {
              resolve();
            }
          }
          scrollBottom();
        } ).then( () => {
          console.log('ZZ demons')
          scrollAllowed = true;
        } );
    }

    if ( !scrollAllowed ) {
      let wrapperRadius               = p5.map( actualScrollPos, 0, maxScrollPos, 200, -30  );
      let widthWrapper                = p5.map( actualScrollPos, 0, maxScrollPos, 70,  101  );
      let heightWrapper               = p5.map( actualScrollPos, 0, maxScrollPos, 40,  100  );
      let marginTopWrapper            = p5.map( actualScrollPos, 0, maxScrollPos, 4,   0    );
      let pTop                        = p5.map( actualScrollPos, 0, maxScrollPos, -35, -42  );
      let pFontSize                   = p5.map( actualScrollPos, 0, maxScrollPos, 4.5, 7    );
      let pWidth                      = p5.map( actualScrollPos, 0, maxScrollPos, 60,  85   );
      let btnTop                      = p5.map( actualScrollPos, 0, maxScrollPos, 3,   5    );
      let btnWidth                    = p5.map( actualScrollPos, 0, maxScrollPos, 20,  25   );
      let btnHeight                   = p5.map( actualScrollPos, 0, maxScrollPos, 6,   8    );
      let btnFontSize                 = p5.map( actualScrollPos, 0, maxScrollPos, 2.5, 3.75 );
      elWrapper.style.borderRadius    = wrapperRadius.toString() + 'px';
      elWrapper.style.width           = widthWrapper.toString()  + 'vw';
      elWrapper.style.height          = heightWrapper.toString() + 'vh';
      elMainBody.style.marginTop      = marginTopWrapper.toString() + 'vw';
      elImgWrapped.style.borderRadius = wrapperRadius.toString() + 'px';
      elImgWrapped.style.width        = widthWrapper.toString()  + 'vw';
      elParaWrapped.style.marginTop = pTop.toString()          + 'vw';
      elParaWrapped.style.fontSize    = pFontSize.toString()     + 'vw';
      elParaWrapped.style.width       = pWidth.toString()        + 'vw';
      elBtnWrapped.style.marginTop  = btnTop.toString()        + 'vw';
      elBtnWrapped.style.width        = btnWidth.toString()      + 'vw';
      elBtnWrapped.style.height       = btnHeight.toString()     + 'vw';
      elBtnWrapped.style.fontSize     = btnFontSize.toString()   + 'vw';
    }

    beforeScrollPos = actualScrollPos;
} );
