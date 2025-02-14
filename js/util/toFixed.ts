// Copyright 2025, University of Colorado Boulder

/**
 * A predictable implementation of toFixed.
 *
 * JavaScript's toFixed is notoriously buggy, behavior differs depending on browser,
 * because the spec doesn't specify whether to round or floor.
 * Rounding is symmetric for positive and negative values, see roundSymmetric.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import dot from '../dot.js';
// @ts-expect-error - Big import requires this for some reason, but it works
import Big from '../../../sherpa/lib/big-6.2.1.js'; // eslint-disable-line phet/default-import-match-filename

export function toFixed( value: number, decimalPlaces: number ): string {
  assert && assert( Number.isInteger( decimalPlaces ), `decimal places must be an integer: ${decimalPlaces}` );
  if ( isNaN( value ) ) {
    return 'NaN';
  }
  else if ( value === Number.POSITIVE_INFINITY ) {
    return 'Infinity';
  }
  else if ( value === Number.NEGATIVE_INFINITY ) {
    return '-Infinity';
  }

  // eslint-disable-next-line phet/bad-sim-text
  const result = new Big( value ).toFixed( decimalPlaces );

  // Avoid reporting -0.000
  if ( result.startsWith( '-0.' ) && Number.parseFloat( result ) === 0 ) {
    return '0' + result.slice( 2 );
  }
  else {
    return result;
  }
}
dot.register( 'toFixed', toFixed );