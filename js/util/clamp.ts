// Copyright 2025-2026, University of Colorado Boulder

/**
 * Returns the original value if it is inclusively within the [max,min] range. If it's below the range, min is
 * returned, and if it's above the range, max is returned.
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import dot from '../dot.js';

export function clamp( value: number, min: number, max: number ): number {
  if ( value < min ) {
    return min;
  }
  else if ( value > max ) {
    return max;
  }
  else {
    return value;
  }
}
dot.register( 'clamp', clamp );