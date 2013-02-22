
define( function( require ) {
  // Returns an array of integers from A to B (including both A to B)
  return function( a, b ) {
    var result = new Array( b - a + 1 );
    for ( var i = a; i <= b; i++ ) {
      result[i] = i;
    }
    return result;
  };
} );
