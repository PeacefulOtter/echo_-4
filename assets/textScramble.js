

class TextScramble {

  constructor( wor, enc, fad, el ) {
    this.wordsList = wor;
    this.encodingCharsList = enc;
    this.fadeDelay = fad;
    this.el = el;

    this.indexWordsList = 0;
    this.generateWords();

  }


  generateWords() {
    this.actualWord = this.wordsList[ this.indexWordsList ];
    this.actualWordArray = this.actualWord.split( '' );
    // to loop when the last word has been decoded
    if ( this.indexWordsList === this.wordsList.length - 1 ) {
      this.indexWordsList = 0;
    }
    this.nextWord = this.wordsList[ this.indexWordsList + 1 ];
    this.nextWordArray = this.nextWord.split( '' );
    this.lengthBetweenWords = this.actualWord.length - this.nextWord.length;
  }


  // pich a random encoded char
  // quick trick to avoid having the same encoded char "l'un à coté de l'autre"
  randomChar() {
    this.prevEncodedChar = this.encodedChar || '';
    this.encodedChar = this.encodingCharsList[
      Math.floor( Math.random() * Math.floor( this.encodingCharsList.length ) )
    ];
    return ( this.encodedChar == this.prevEncodedChar ) ? this.randomChar() : this.encodedChar;
  }


  // change or add an encoding char
  metamorphWord( i ) {
    if ( i <= this.actualWord.length ) {
      this.actualWordArray[ i ] = this.randomChar()
    } else if ( i > this.actualWord.length ) {
      this.actualWordArray.push( this.randomChar() )
    }
  }


  // encode the word and make sure that the length of the encoded word
  // becomes equal to the next word
  encodeWord() {
    let indexMetamorph = 0;

    const encodeChars = () => {
      // encode the whole word
      if ( indexMetamorph < this.actualWord.length ) {
        this.metamorphWord( indexMetamorph );
        setTimeout( encodeChars, this.fadeDelay[ 'chars' ] );

      // if the next word is bigger
      } else if ( this.lengthBetweenWords < 0 ) {
        this.metamorphWord( indexMetamorph );
        this.lengthBetweenWords += 1;
        setTimeout( encodeChars, this.fadeDelay[ 'chars' ] );

      // if the next word is smaller
      } else if ( this.lengthBetweenWords > 0 ) {
        this.actualWordArray = this.actualWordArray.slice( 0, -1 );
        this.lengthBetweenWords -= 1;
        setTimeout( encodeChars, this.fadeDelay[ 'chars' ] );
      } else {
        setTimeout( this.decodeWord(), this.fadeDelay[ 'chars' ] );
      }

      this.el.innerHTML = this.actualWordArray.join( '' );
      indexMetamorph += 1;
    };

    encodeChars();
  }


  // so, we have our "actualWordArray" wich is the same length of "nextWordArray"
  // Let's decode it to get our "nextWord" !
  // Basically, our "actualWordArray" slowly becomes our "nextWordArray"
  decodeWord() {
    let indexDecode = 0;

    const decodeChars = () => {
      // decode the whole word
      if ( indexDecode <= this.nextWord.length ) {
        this.actualWordArray[ indexDecode ] = this.nextWordArray[ indexDecode ];
        this.el.innerHTML = this.actualWordArray.join( '' );
        setTimeout( decodeChars, this.fadeDelay[ 'chars' ] )

      // The decoding is done, now we can go to the next word
      // after a quick break so the user has time to see the decoded word
      } else if ( indexDecode > this.nextWord.length ) {
        this.indexWordsList += 1;
        let that = this;
        setTimeout(
          function() {
            that.generateWords();
            that.encodeWord();
          },
          this.fadeDelay[ 'pause' ]
        );
      }
      indexDecode += 1;
    }
    decodeChars();
  }
}

// words to fade
let wordsList = [
  'G E N J Y', '( e )', 'E C H O _', 'echo_', 'GENJY'
];
// all chars for the fade effect
let encodingCharsList = [
  '&', '&', '~', '~', '~', '~', '#', '#', '%', '%',
  '{', '[', ']', '}', '$', '$', '§', '§', '/', '/',
  '@', '@', '|', '_', '_', '_', '_', '=', '=', '=',
  '-', '-', '-', '-', '^', '^', '*', '*', '.', '.'
];
// time* between the fade of one word to an other
// and the time* to stop between one fade and an other
// *in ms
let fadeDelay = {
  'chars' : 100,
  'pause' : 1000,
};

const dt = document.getElementById( 'dynamicTextLeft' );
dt.innerHTML = wordsList[ 0 ];
//document.querySelector( '.dynamicText' ).innerHTML = wordsList[ 0 ];
const ts = new TextScramble( wordsList, encodingCharsList, fadeDelay, dt );
ts.encodeWord();
