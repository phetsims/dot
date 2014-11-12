// Copyright 2002-2014, University of Colorado Boulder

window.loadedDotConfig = true;

require.config( {
  deps: [ 'main', 'PHET_CORE/main' ],

  paths: {
    underscore: '../../sherpa/lodash-2.4.1',
    DOT: '.',
    PHET_CORE: '../../phet-core/js',
    AXON: '../../axon/js'
  },

  shim: {
    underscore: { exports: '_' }
  },

  urlArgs: new Date().getTime() // add cache buster query string to make browser refresh actually reload everything
} );
