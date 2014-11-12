(function() {
  'use strict';

  module( 'Dot: JSHint' );

  unitTestLintFilesMatching( function( src ) {
    return src.indexOf( 'dot/js' ) !== -1;
  } );
})();
