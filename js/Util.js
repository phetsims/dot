// Copyright 2002-2014, University of Colorado Boulder

/**
 * Utility functions for Dot, placed into the dot.X namespace.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  // require( 'DOT/Vector2' ); // Require.js doesn't like the circular reference

  dot.Util = {
    testAssert: function() {
      return 'assert.dot: ' + ( assert ? 'true' : 'false' );
    },

    clamp: function( value, min, max ) {
      if ( value < min ) {
        return min;
      }
      else if ( value > max ) {
        return max;
      }
      else {
        return value;
      }
    },

    // returns a number between [min,max) with the same equivalence class as value mod (max-min)
    moduloBetweenDown: function( value, min, max ) {
      assert && assert( max > min, 'max > min required for moduloBetween' );

      var divisor = max - min;

      // get a partial result of value-min between [0,divisor)
      var partial = ( value - min ) % divisor;
      if ( partial < 0 ) {
        // since if value-min < 0, the remainder will give us a negative number
        partial += divisor;
      }

      return partial + min; // add back in the minimum value
    },

    // returns a number between (min,max] with the same equivalence class as value mod (max-min)
    moduloBetweenUp: function( value, min, max ) {
      return -Util.moduloBetweenDown( -value, -max, -min );
    },

    // Returns an array of integers from A to B (including both A to B)
    rangeInclusive: function( a, b ) {
      if ( b < a ) {
        return [];
      }
      var result = new Array( b - a + 1 );
      for ( var i = a; i <= b; i++ ) {
        result[i - a] = i;
      }
      return result;
    },

    // Returns an array of integers between A and B (excluding both A to B)
    rangeExclusive: function( a, b ) {
      return Util.rangeInclusive( a + 1, b - 1 );
    },

    toRadians: function( degrees ) {
      return Math.PI * degrees / 180;
    },

    toDegrees: function( radians ) {
      return 180 * radians / Math.PI;
    },

    // find the greatest common denominator using the classic algorithm
    gcd: function( a, b ) {
      return b === 0 ? a : this.gcd( b, a % b );
    },

    // intersection between the line from p1-p2 and the line from p3-p4
    lineLineIntersection: function( p1, p2, p3, p4 ) {
      var x12 = p1.x - p2.x;
      var x34 = p3.x - p4.x;
      var y12 = p1.y - p2.y;
      var y34 = p3.y - p4.y;

      var denom = x12 * y34 - y12 * x34;

      var a = p1.x * p2.y - p1.y * p2.x;
      var b = p3.x * p4.y - p3.y * p4.x;

      return new dot.Vector2(
          ( a * x34 - x12 * b ) / denom,
          ( a * y34 - y12 * b ) / denom
      );
    },

    // assumes a sphere with the specified radius, centered at the origin
    sphereRayIntersection: function( radius, ray, epsilon ) {
      epsilon = epsilon === undefined ? 1e-5 : epsilon;

      // center is the origin for now, but leaving in computations so that we can change that in the future. optimize away if needed
      var center = new dot.Vector3();

      var rayDir = ray.dir;
      var pos = ray.pos;
      var centerToRay = pos.minus( center );

      // basically, we can use the quadratic equation to solve for both possible hit points (both +- roots are the hit points)
      var tmp = rayDir.dot( centerToRay );
      var centerToRayDistSq = centerToRay.magnitudeSquared();
      var det = 4 * tmp * tmp - 4 * ( centerToRayDistSq - radius * radius );
      if ( det < epsilon ) {
        // ray misses sphere entirely
        return null;
      }

      var base = rayDir.dot( center ) - rayDir.dot( pos );
      var sqt = Math.sqrt( det ) / 2;

      // the "first" entry point distance into the sphere. if we are inside the sphere, it is behind us
      var ta = base - sqt;

      // the "second" entry point distance
      var tb = base + sqt;

      if ( tb < epsilon ) {
        // sphere is behind ray, so don't return an intersection
        return null;
      }

      var hitPositionB = ray.pointAtDistance( tb );
      var normalB = hitPositionB.minus( center ).normalized();

      if ( ta < epsilon ) {
        // we are inside the sphere
        // in => out
        return {
          distance: tb,
          hitPoint: hitPositionB,
          normal: normalB.negated(),
          fromOutside: false
        };
      }
      else {
        // two possible hits
        var hitPositionA = ray.pointAtDistance( ta );
        var normalA = hitPositionA.minus( center ).normalized();

        // close hit, we have out => in
        return {
          distance: ta,
          hitPoint: hitPositionA,
          normal: normalA,
          fromOutside: true
        };
      }
    },

    // return an array of real roots of ax^2 + bx + c = 0
    solveQuadraticRootsReal: function( a, b, c ) {
      var epsilon = 1E7;

      //We need to test whether a is several orders of magnitude less than b or c. If so, return the result as a solution to the linear (easy) equation
      if ( a === 0 || Math.abs( b / a ) > epsilon || Math.abs( c / a ) > epsilon ) {
        return [ -c / b ];
      }

      var discriminant = b * b - 4 * a * c;
      if ( discriminant < 0 ) {
        return [];
      }
      var sqrt = Math.sqrt( discriminant );
      // TODO: how to handle if discriminant is 0? give unique root or double it?
      // TODO: probably just use Complex for the future
      return [
          ( -b - sqrt ) / ( 2 * a ),
          ( -b + sqrt ) / ( 2 * a )
      ];
    },

    // return an array of real roots of ax^3 + bx^2 + cx + d = 0
    solveCubicRootsReal: function( a, b, c, d ) {
      // TODO: a Complex type!

      //We need to test whether a is several orders of magnitude less than b, c, d
      var epsilon = 1E7;

      if ( a === 0 || Math.abs( b / a ) > epsilon || Math.abs( c / a ) > epsilon || Math.abs( d / a ) > epsilon ) {
        return Util.solveQuadraticRootsReal( b, c, d );
      }
      if ( d === 0 || Math.abs( a / d ) > epsilon || Math.abs( b / d ) > epsilon || Math.abs( c / d ) > epsilon ) {
        return Util.solveQuadraticRootsReal( a, b, c );
      }

      b /= a;
      c /= a;
      d /= a;

      var q = ( 3.0 * c - ( b * b ) ) / 9;
      var r = ( -(27 * d) + b * (9 * c - 2 * (b * b)) ) / 54;
      var discriminant = q * q * q + r * r;
      var b3 = b / 3;

      if ( discriminant > 0 ) {
        // a single real root
        var dsqrt = Math.sqrt( discriminant );
        return [ Util.cubeRoot( r + dsqrt ) + Util.cubeRoot( r - dsqrt ) - b3 ];
      }

      // three real roots
      if ( discriminant === 0 ) {
        // contains a double root
        var rsqrt = Util.cubeRoot( r );
        var doubleRoot = b3 - rsqrt;
        return [ -b3 + 2 * rsqrt, doubleRoot, doubleRoot ];
      }
      else {
        // all unique
        var qX = -q * q * q;
        qX = Math.acos( r / Math.sqrt( qX ) );
        var rr = 2 * Math.sqrt( -q );
        return [
            -b3 + rr * Math.cos( qX / 3 ),
            -b3 + rr * Math.cos( ( qX + 2 * Math.PI ) / 3 ),
            -b3 + rr * Math.cos( ( qX + 4 * Math.PI ) / 3 )
        ];
      }
    },

    cubeRoot: function( x ) {
      return x >= 0 ? Math.pow( x, 1 / 3 ) : -Math.pow( -x, 1 / 3 );
    },

    // Linearly interpolate two points and evaluate the line equation for a third point
    // f( a1 ) = b1, f( a2 ) = b2, f( a3 ) = <linear mapped value>
    linear: function( a1, a2, b1, b2, a3 ) {
      return ( b2 - b1 ) / ( a2 - a1 ) * ( a3 - a1 ) + b1;
    },

    /**
     * A predictable implementation of toFixed.
     * JavaScript's toFixed is notoriously buggy, behavior differs depending on browser,
     * because the spec doesn't specify whether to round or floor.
     * @param {number} number
     * @param {number} decimalPlaces
     * @returns {string}
     */
    toFixed: function( number, decimalPlaces ) {
      var multiplier = Math.pow( 10, decimalPlaces );
      var value = Math.round( number * multiplier ) / multiplier;
      return value.toFixed( decimalPlaces );
    },

    // Convenience for returning a number instead of a string.
    toFixedNumber: function( number, decimalPlaces ) {
      return parseFloat( Util.toFixed( number, decimalPlaces ) );
    },

    isInteger: function( n ) {
      return ( typeof n === 'number' ) && ( n % 1 === 0 );
    },

    /*
     * Computes the intersection of two line segments. Algorithm taked from Paul Bourke, 1989:
     * http://astronomy.swin.edu.au/~pbourke/geometry/lineline2d/
     * Ported from MathUtil.java on 9/20/2013 by @samreid
     * line a goes from point 1->2 and line b goes from 3->4
     * @returns a Vector2 of the intersection point, or null if no intersection
     */
    lineSegmentIntersection: function( x1, y1, x2, y2, x3, y3, x4, y4 ) {
      var numA = ( x4 - x3 ) * ( y1 - y3 ) - ( y4 - y3 ) * ( x1 - x3 );
      var numB = ( x2 - x1 ) * ( y1 - y3 ) - ( y2 - y1 ) * ( x1 - x3 );
      var denom = ( y4 - y3 ) * ( x2 - x1 ) - ( x4 - x3 ) * ( y2 - y1 );

      // If denominator is 0, the lines are parallel or coincident
      if ( denom === 0 ) {
        return null;
      }
      else {
        var ua = numA / denom;
        var ub = numB / denom;

        // ua and ub must both be in the range 0 to 1 for the segments to have an intersection pt.
        if ( !( ua >= 0 && ua <= 1 && ub >= 0 && ub <= 1 ) ) {
          return null;
        }
        else {
          var x = x1 + ua * ( x2 - x1 );
          var y = y1 + ua * ( y2 - y1 );
          return new dot.Vector2( x, y );
        }
      }
    },

    /**
     * Squared distance from a point to a line segment squared.
     * See http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
     *
     * @param point the point
     * @param a start point of a line segment
     * @param b end point of a line segment
     * @returns {Number}
     */
    distToSegmentSquared: function( point, a, b ) {
      var segmentLength = a.distanceSquared( b );
      if ( segmentLength === 0 ) { return point.distanceSquared( a ); }
      var t = ((point.x - a.x) * (b.x - a.x) + (point.y - a.y) * (b.y - a.y)) / segmentLength;
      return t < 0 ? point.distanceSquared( a ) :
             t > 1 ? point.distanceSquared( b ) :
             point.distanceSquared( new dot.Vector2( a.x + t * (b.x - a.x), a.y + t * (b.y - a.y) ) );
    },

    /**
     * Squared distance from a point to a line segment squared.
     * @param point the point
     * @param a start point of a line segment
     * @param b end point of a line segment
     * @returns {Number}
     */
    distToSegment: function( point, a, b ) { return Math.sqrt( this.distToSegmentSquared( point, a, b ) ); },

    arePointsCollinear: function( a, b, c, epsilon ) {
      if ( epsilon === undefined ) {
        epsilon = 0;
      }
      return Util.triangleArea( a, b, c ) <= epsilon;
    },

    triangleArea: function( a, b, c ) {
      return Math.abs( Util.triangleAreaSigned( a, b, c ) );
    },

    // TODO: investigate which way we want the sign (Canvas or WebGL style)
    triangleAreaSigned: function( a, b, c ) {
      return a.x * ( b.y - c.y ) + b.x * ( c.y - a.y ) + c.x * ( a.y - b.y );
    },

    log10: function( val ) {
      return Math.log( val ) / Math.LN10;
    }
  };
  var Util = dot.Util;

  // make these available in the main namespace directly (for now)
  dot.testAssert = Util.testAssert;
  dot.clamp = Util.clamp;
  dot.moduloBetweenDown = Util.moduloBetweenDown;
  dot.moduloBetweenUp = Util.moduloBetweenUp;
  dot.rangeInclusive = Util.rangeInclusive;
  dot.rangeExclusive = Util.rangeExclusive;
  dot.toRadians = Util.toRadians;
  dot.toDegrees = Util.toDegrees;
  dot.lineLineIntersection = Util.lineLineIntersection;
  dot.sphereRayIntersection = Util.sphereRayIntersection;
  dot.solveQuadraticRootsReal = Util.solveQuadraticRootsReal;
  dot.solveCubicRootsReal = Util.solveCubicRootsReal;
  dot.cubeRoot = Util.cubeRoot;
  dot.linear = Util.linear;

  return Util;
} );
