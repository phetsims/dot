
if ( window.has ) {
  window.has.add( 'assert.dot', function( global, document, anElement ) {
    return true;
  } );
}

window.loadedDotConfig = true;

require.config( {
  deps: [ 'main', 'CORE/main' ],

  paths: {
    underscore: '../contrib/lodash.min-1.0.0-rc.3',
    DOT: '.',
    CORE: '../common/phet-core/js',
    ASSERT: '../common/assert/js'
  },
  
  shim: {
    underscore: { exports: '_' }
  },

  urlArgs: new Date().getTime() // add cache buster query string to make browser refresh actually reload everything
} );
