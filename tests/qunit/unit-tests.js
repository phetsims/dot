// Copyright 2016, University of Colorado Boulder

// path to test base, without a slash, e.g. '../../../dot/tests/qunit'
function runDotTests( pathToTestBase ) { // eslint-disable-line no-unused-vars
  'use strict';

  function loadTestFile( src ) {
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    script.async = false;

    // make sure things aren't cached, just in case
    script.src = pathToTestBase + '/' + src + '?random=' + Math.random().toFixed( 10 );

    document.getElementsByTagName( 'head' )[ 0 ].appendChild( script );
  }

  loadTestFile( 'js/simple-tests.js' );
  loadTestFile( 'js/complex.js' );
  loadTestFile( 'js/bounds2.js' );
  loadTestFile( 'js/matrix3.js' );
  loadTestFile( 'js/transform3.js' );
  loadTestFile( 'js/modulo.js' );
  loadTestFile( 'js/binpacker.js' );
  loadTestFile( 'js/harmonic-motion.js' );
  loadTestFile( 'js/matrix-ops3.js' );
}
