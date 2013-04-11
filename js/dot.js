
define( function( require ) {
  // will be filled in by other modules
  return function dot() {
    switch ( arguments.length ) {
      case 2:
        return new dot.Vector2( arguments[0], arguments[1] );
      case 3:
        return new dot.Vector3( arguments[0], arguments[1], arguments[2] );
      case 4:
        return new dot.Vector4( arguments[0], arguments[1], arguments[2], arguments[3] );
      default:
        throw new Error( 'dot takes 2-4 arguments' );
    }
  };
} );
