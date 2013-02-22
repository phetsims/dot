// Copyright 2002-2012, University of Colorado

define( function( require ) {
  return function( value, min, max ) {
    if ( value < min ) {
      return min;
    }
    else if ( value > max ) {
      return max;
    }
    else {
      return value;
    }
  };
} );
