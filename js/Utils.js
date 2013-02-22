// Copyright 2002-2012, University of Colorado

define( function( require ) {
  throw new Error( 'how to load clamp and toRadians?' )
} );

phet.math.clamp = function ( value, min, max ) {
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

phet.math.toRadians = function ( degrees ) {
  return Math.PI * degrees / 180.0;
};

