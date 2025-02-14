// Copyright 2025, University of Colorado Boulder

/**
 * Determines the number of decimal places in a value.
 *
 * @param value - a finite number, scientific notation is not supported for decimal numbers
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function numberOfDecimalPlaces( value: number ): number {
  assert && assert( typeof value === 'number' && isFinite( value ), `value must be a finite number ${value}` );
  if ( Math.floor( value ) === value ) {
    return 0;
  }
  else {
    const string = value.toString();

    // Handle scientific notation
    if ( string.includes( 'e' ) ) {
      // e.g. '1e-21', '5.6e+34', etc.
      const split = string.split( 'e' );
      const mantissa = split[ 0 ]; // The left part, e.g. '1' or '5.6'
      const exponent = Number( split[ 1 ] ); // The right part, e.g. '-21' or '+34'

      // How many decimal places are there in the left part
      const mantissaDecimalPlaces = mantissa.includes( '.' ) ? mantissa.split( '.' )[ 1 ].length : 0;

      // We adjust the number of decimal places by the exponent, e.g. '1.5e1' has zero decimal places, and
      // '1.5e-2' has three.
      return Math.max( mantissaDecimalPlaces - exponent, 0 );
    }
    else { // Handle decimal notation. Since we're not an integer, we should be guaranteed to have a decimal
      return string.split( '.' )[ 1 ].length;
    }
  }
}
dot.register( 'numberOfDecimalPlaces', numberOfDecimalPlaces );