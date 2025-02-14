// Copyright 2025, University of Colorado Boulder

/**
 * A predictable implementation of toFixed, where the result is returned as a number instead of a string.
 *
 * JavaScript's toFixed is notoriously buggy, behavior differs depending on browser,
 * because the spec doesn't specify whether to round or floor.
 * Rounding is symmetric for positive and negative values, see roundSymmetric.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import dot from '../dot.js';
import { toFixed } from './toFixed.js';

export function toFixedNumber( value: number, decimalPlaces: number ): number {
  return parseFloat( toFixed( value, decimalPlaces ) );
}
dot.register( 'toFixedNumber', toFixedNumber );