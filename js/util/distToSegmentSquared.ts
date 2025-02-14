// Copyright 2025, University of Colorado Boulder

/**
 * Squared distance from a point to a line segment squared.
 * See http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
 *
 * @param point - The point
 * @param a - Starting point of the line segment
 * @param b - Ending point of the line segment
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Martin Veillette (Berea College)
 */

import dot from '../dot.js';
import Vector2 from '../Vector2.js';

export function distToSegmentSquared( point: Vector2, a: Vector2, b: Vector2 ): number {
  // the square of the distance between a and b,
  const segmentSquaredLength = a.distanceSquared( b );

  // if the segment length is zero, the a and b point are coincident. return the squared distance between a and point
  if ( segmentSquaredLength === 0 ) { return point.distanceSquared( a ); }

  // the t value parametrize the projection of the point onto the a b line
  const t = ( ( point.x - a.x ) * ( b.x - a.x ) + ( point.y - a.y ) * ( b.y - a.y ) ) / segmentSquaredLength;

  let distanceSquared;

  if ( t < 0 ) {
    // if t<0, the projection point is outside the ab line, beyond a
    distanceSquared = point.distanceSquared( a );
  }
  else if ( t > 1 ) {
    // if t>1, the projection past is outside the ab segment, beyond b,
    distanceSquared = point.distanceSquared( b );
  }
  else {
    // if 0<t<1, the projection point lies along the line joining a and b.
    distanceSquared = point.distanceSquared( new Vector2( a.x + t * ( b.x - a.x ), a.y + t * ( b.y - a.y ) ) );
  }

  return distanceSquared;

}
dot.register( 'distToSegmentSquared', distToSegmentSquared );