
require.config( {
  deps: [ 'main' ],

  paths: {
    DOT: '.',
    ASSERT: '../common/assert/js'
  },

  urlArgs: new Date().getTime() // add cache buster query string to make browser refresh actually reload everything
} );
