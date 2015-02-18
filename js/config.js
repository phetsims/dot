// Copyright 2002-2014, University of Colorado Boulder

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

  // optional cache buster to make browser refresh load all included scripts, can be disabled with ?cacheBuster=false
  urlArgs: Date.now()
} );
