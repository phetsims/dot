// Copyright 2025, University of Colorado Boulder

/**
 * Returns the distance between 2 points, given by (x,y) coordinates.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 */

import dot from '../dot.js';

export default function distanceXY( x1: number, y1: number, x2: number, y2: number ): number {
  const dx = x1 - x2;
  const dy = y1 - y2;
  return Math.sqrt( dx * dx + dy * dy );
}
dot.register( 'distanceXY', distanceXY );