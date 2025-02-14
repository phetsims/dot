// Copyright 2025, University of Colorado Boulder

/**
 * Rounds a value to a multiple of a specified interval.
 * Examples:
 * roundToInterval( 0.567, 0.01 ) -> 0.57
 * roundToInterval( 0.567, 0.02 ) -> 0.56
 * roundToInterval( 5.67, 0.5 ) -> 5.5
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */

import dot from '../dot.js';
import { roundSymmetric } from './roundSymmetric.js';
import { toFixedNumber } from './toFixedNumber.js';
import { numberOfDecimalPlaces } from './numberOfDecimalPlaces.js';

export function roundToInterval( value: number, interval: number ): number {
  return toFixedNumber( roundSymmetric( value / interval ) * interval,
    numberOfDecimalPlaces( interval ) );
}
dot.register( 'roundToInterval', roundToInterval );