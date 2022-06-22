// Copyright 2022, University of Colorado Boulder

/**
 * toFixedPointString is a version of Number.toFixed that avoids rounding problems and floating-point errors that exist
 * in Number.toFixed and dot.Utils.toFixed. It converts a number of a string, then modifies that string based on the
 * number of decimal places desired. It performs symmetric rounding based on only the 2 specific digits that should be
 * considered when rounding. Values that are not finite are converted using Number.toFixed.
 *
 * See https://github.com/phetsims/dot/issues/113
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import dot from './dot.js';

function toFixedPointString( value: number, decimalPlaces: number ): string {
  assert && assert( isFinite( decimalPlaces ) && decimalPlaces >= 0 );

  // If value is not finite, then delegate to Number.toFixed and return immediately.
  if ( !isFinite( value ) ) {
    return value.toFixed( decimalPlaces ); // eslint-disable-line bad-sim-text
  }

  // Convert the value to a string.
  let stringValue = value.toString();

  // Find the decimal point in the string.
  const decimalPointIndex = stringValue.indexOf( '.' );

  if ( decimalPointIndex !== -1 ) {

    // If there is a decimal point...
    const actualDecimalPlaces = stringValue.length - decimalPointIndex - 1;
    if ( actualDecimalPlaces < decimalPlaces ) {

      // There are not enough decimal places, so pad with 0's to the right of decimal point
      for ( let i = 0; i < decimalPlaces - actualDecimalPlaces; i++ ) {
        stringValue += '0';
      }
    }
    else if ( actualDecimalPlaces > decimalPlaces ) {

      // There are too many decimal places, so round symmetric.
      const digit = parseInt( stringValue[ decimalPointIndex + decimalPlaces + 1 ], 10 );
      const delta = ( digit >= 5 ) ? 1 : 0;
      stringValue = stringValue.substring( 0, stringValue.length - ( actualDecimalPlaces - decimalPlaces ) );
      if ( stringValue[ stringValue.length - 1 ] === '.' ) {
        stringValue = stringValue.substring( 0, stringValue.length - 1 );
      }
      const lastDecimal = parseInt( stringValue[ stringValue.length - 1 ], 10 ) + delta;
      stringValue = stringValue.replace( /.$/, lastDecimal.toString() );
    }
  }
  else {

    // There is no decimal point, so add a decimal point and pad with zeros.
    if ( decimalPlaces > 0 ) {
      stringValue += '.';
      for ( let i = 0; i < decimalPlaces; i++ ) {
        stringValue += '0';
      }
    }
  }

  // Remove negative sign from -0 values.
  if ( parseFloat( stringValue ) === 0 && stringValue[ 0 ] === '-' ) {
    stringValue = stringValue.substring( 1, stringValue.length );
  }

  return stringValue;
}

dot.register( 'toFixedPointString', toFixedPointString );
export default toFixedPointString;
