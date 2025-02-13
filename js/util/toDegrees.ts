// Copyright 2025, University of Colorado Boulder

/**
 * Converts radians to degrees.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from '../dot.js';

export function toDegrees( radians: number ): number {
  return 180 * radians / Math.PI;
}
dot.register( 'toDegrees', toDegrees );