// Copyright 2013-2023, University of Colorado Boulder

/**
 * Construction of 2D convex hulls from a list of points.
 *
 * For example:
 * #begin canvasExample grahamScan 256x128
 * #on
 * var points = _.range( 50 ).map( function() {
 *   return new phet.dot.Vector2( 5 + ( 256 - 10 ) * Math.random(), 5 + ( 128 - 10 ) * Math.random() );
 * } );
 * var hullPoints = phet.dot.ConvexHull2.grahamScan( points, false );
 * #off
 * context.beginPath();
 * hullPoints.forEach( function( point ) {
 *   context.lineTo( point.x, point.y );
 * } );
 * context.closePath();
 * context.fillStyle = '#eee';
 * context.fill();
 * context.strokeStyle = '#f00';
 * context.stroke();
 *
 * context.beginPath();
 * points.forEach( function( point ) {
 *   context.arc( point.x, point.y, 2, 0, Math.PI * 2, false );
 *   context.closePath();
 * } );
 * context.fillStyle = '#00f';
 * context.fill();
 * #end canvasExample
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';

/**
 * counter-clockwise turn if > 0, clockwise turn if < 0, collinear if === 0.
 * @param {Vector2} p1
 * @param {Vector2} p2
 * @param {Vector2} p3
 * @returns {number}
 */
function ccw( p1, p2, p3 ) {
  return p2.minus( p1 ).crossScalar( p3.minus( p1 ) );
}

const ConvexHull2 = {
  // TODO testing: all collinear, multiple ways of having same angle, etc.

  /**
   * Given multiple points, this performs a Graham Scan (http://en.wikipedia.org/wiki/Graham_scan) to identify an
   * ordered list of points which define the minimal polygon that contains all of the points.
   * @public
   *
   * @param {Array.<Vector2>} points
   * @param {boolean} includeCollinear - If a point is along an edge of the convex hull (not at one of its vertices),
   *                                     should it be included?
   * @returns {Array.<Vector2>}
   */
  grahamScan: ( points, includeCollinear ) => {
    if ( points.length <= 2 ) {
      return points;
    }

    // find the point 'p' with the lowest y value
    let minY = Number.POSITIVE_INFINITY;
    let p = null;
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
      return point.minus( p ).angle;
    } );

    // remove p from points (relies on the above statement making a defensive copy)
    points.splice( _.indexOf( points, p ), 1 );

    // our result array
    const result = [ p ];

    _.each( points, point => {
      // ignore points equal to our starting point
      if ( p.x === point.x && p.y === point.y ) { return; }

      function isRightTurn() {
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