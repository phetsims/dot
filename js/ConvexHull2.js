// Copyright 2002-2014, University of Colorado Boulder

/**
 * 2D convex hulls
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  // counter-clockwise turn if > 0, clockwise turn if < 0, collinear if === 0.
  function ccw( p1, p2, p3 ) {
    return p2.minus( p1 ).crossScalar( p3.minus( p1 ) );
  }

  dot.ConvexHull2 = {
    // test: all collinear, multiple ways of having same angle, etc.

    // points is an array of Vector2 instances. see http://en.wikipedia.org/wiki/Graham_scan
    grahamScan: function( points, includeCollinear ) {
      if ( points.length <= 2 ) {
        return points;
      }

      // find the point 'p' with the lowest y value
      var minY = Number.POSITIVE_INFINITY;
      var p = null;
      _.each( points, function( point ) {
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
      points = _.sortBy( points, function( point ) {
        return point.minus( p ).angle();
      } );

      // remove p from points (relies on the above statement making a defensive copy)
      points.splice( _.indexOf( points, p ), 1 );

      // our result array
      var result = [p];

      _.each( points, function( point ) {
        // ignore points equal to our starting point
        if ( p.x === point.x && p.y === point.y ) { return; }

        function isRightTurn() {
          if ( result.length < 2 ) {
            return false;
          }
          var cross = ccw( result[result.length - 2], result[result.length - 1], point );
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

  return dot.ConvexHull2;
} );
