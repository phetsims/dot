// Copyright 2013-2025, University of Colorado Boulder

/**
 * Construction of 2D convex hulls from a list of points.
 *
 * For example:
 * #begin sandbox
 * #on
 * const points = [ ...Array( 50 ).keys() ].map( () => {
 *   return new Vector2( 5 + ( 256 - 10 ) * Math.random(), 5 + ( 128 - 10 ) * Math.random() );
 * } );
 * const hullPoints = ConvexHull2.grahamScan( points, false );
 * #off
 *
 * const content = new Node( {
 *   children: [
 *     new Path( Shape.polygon( hullPoints ), { fill: '#eee', stroke: 'f00' } ),
 *     ...points.map( point => new Circle( 2, {
 *       fill: '#00f',
 *       translation: point
 *     } ) )
 *   ]
 * } );
 * #end sandbox
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';
import Vector2 from './Vector2.js';

/**
 * counter-clockwise turn if > 0, clockwise turn if < 0, collinear if === 0.
 */
function ccw( p1: Vector2, p2: Vector2, p3: Vector2 ): number {
  return p2.minus( p1 ).crossScalar( p3.minus( p1 ) );
}

const ConvexHull2 = {
  // TODO testing: all collinear, multiple ways of having same angle, etc. https://github.com/phetsims/dot/issues/96

  /**
   * Given multiple points, this performs a Graham Scan (http://en.wikipedia.org/wiki/Graham_scan) to identify an
   * ordered list of points which define the minimal polygon that contains all of the points.
   *
   * @param points
   * @param includeCollinear - If a point is along an edge of the convex hull (not at one of its vertices),
   *                                     should it be included?
   */
  grahamScan: ( points: Vector2[], includeCollinear: boolean ): Vector2[] => {
    if ( points.length <= 2 ) {
      return points;
    }

    // find the point 'p' with the lowest y value
    let minY = Number.POSITIVE_INFINITY;
    let p: Vector2 | null = null;
    _.each( points, point => {
      if ( point.y <= minY ) {
        // if two points have the same y value, take the one with the lowest x
        if ( point.y === minY && p ) {
          if ( point.x < p.x ) {
            p = point;
          }
        }
        else {
          minY = point.y;
          p = point;
        }
      }
    } );

    // sorts the points by their angle. Between 0 and PI
    points = _.sortBy( points, point => {
      return point.minus( p! ).angle;
    } );

    // remove p from points (relies on the above statement making a defensive copy)
    points.splice( _.indexOf( points, p ), 1 );

    // our result array
    const result: Vector2[] = [ p! ];

    _.each( points, point => {
      // ignore points equal to our starting point
      if ( p!.x === point.x && p!.y === point.y ) { return; }

      function isRightTurn(): boolean {
        if ( result.length < 2 ) {
          return false;
        }
        const cross = ccw( result[ result.length - 2 ], result[ result.length - 1 ], point );
        return includeCollinear ? ( cross < 0 ) : ( cross <= 0 );
      }

      while ( isRightTurn() ) {
        result.pop();
      }
      result.push( point );
    } );

    return result;
  }
};

dot.register( 'ConvexHull2', ConvexHull2 );

export default ConvexHull2;