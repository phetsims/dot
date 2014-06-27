// Copyright 2002-2014, University of Colorado Boulder

if ( window.has ) {
  // default config only enables basic assertions
  window.has.add( 'assert.basic', function( global, document, anElement ) {
    'use strict';
    return true;
  } );
  // window.has.add( 'assert.slow', function( global, document, anElement ) { 'use strict'; return true; } );
}

window.loadedDotConfig = true;

require.config( {
  deps: [ 'main', 'PHET_CORE/main' ],

  paths: {
    underscore: '../../sherpa/lodash-2.4.1',
    DOT: '.',
    PHET_CORE: '../../phet-core/js',
    ASSERT: '../../assert/js',
    AXON: '../../axon/js'
  },

  shim: {
    underscore: { exports: '_' }
  },

  urlArgs: new Date().getTime() // add cache buster query string to make browser refresh actually reload everything
} );
