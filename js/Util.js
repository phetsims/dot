// Copyright 2013-2015, University of Colorado Boulder
/* eslint-disable bad-sim-text */ // Needs Math.round to implement the symmetric rounding

/**
 * Utility functions for Dot, placed into the dot.X namespace.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  // require( 'DOT/Vector2' ); // Require.js doesn't like the circular reference

  // constants
  var EPSILON = Number.MIN_VALUE;
  var TWO_PI = 2 * Math.PI;

  // "static" variables used in boxMullerTransform
  var generate;
  var z0;
  var z1;

  var Util = {
    /**
     * Returns the original value if it is inclusively within the [max,min] range. If it's below the range, min is
     * returned, and if it's above the range, max is returned.
     * @public
     *
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
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

    /**
     * Returns a number in the range $n\in[\mathrm{min},\mathrm{max})$ with the same equivalence class as the input
     * value mod (max-min), i.e. for a value $m$, $m\equiv n\ (\mathrm{mod}\ \mathrm{max}-\mathrm{min})$.
     * @public
     *
     * The 'down' indicates that if the value is equal to min or max, the max is returned.
     *
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
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

    /**
     * Returns a number in the range $n\in(\mathrm{min},\mathrm{max}]$ with the same equivalence class as the input
     * value mod (max-min), i.e. for a value $m$, $m\equiv n\ (\mathrm{mod}\ \mathrm{max}-\mathrm{min})$.
     * @public
     *
     * The 'up' indicates that if the value is equal to min or max, the min is returned.
     *
     * @param {number} value
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    moduloBetweenUp: function( value, min, max ) {
      return -Util.moduloBetweenDown( -value, -max, -min );
    },

    /**
     * Returns an array of integers from A to B (inclusive), e.g. rangeInclusive( 4, 7 ) maps to [ 4, 5, 6, 7 ].
     * @public
     *
     * @param {number} a
     * @param {number} b
     * @returns {Array.<number>}
     */
    rangeInclusive: function( a, b ) {
      if ( b < a ) {
        return [];
      }
      var result = new Array( b - a + 1 );
      for ( var i = a; i <= b; i++ ) {
        result[ i - a ] = i;
      }
      return result;
    },

    /**
     * Returns an array of integers from A to B (exclusive), e.g. rangeExclusive( 4, 7 ) maps to [ 5, 6 ].
     * @public
     *
     * @param {number} a
     * @param {number} b
     * @returns {Array.<number>}
     */
    rangeExclusive: function( a, b ) {
      return Util.rangeInclusive( a + 1, b - 1 );
    },

    /**
     * Converts degrees to radians.
     * @public
     *
     * @param {number} degrees
     * @returns {number}
     */
    toRadians: function( degrees ) {
      return Math.PI * degrees / 180;
    },

    /**
     * Converts radians to degrees.
     * @public
     *
     * @param {number} radians
     * @returns {number}
     */
    toDegrees: function( radians ) {
      return 180 * radians / Math.PI;
    },

    /**
     * Workaround for broken modulo operator.
     * E.g. on iOS9, 1e10 % 1e10 -> 2.65249474e-315
     * See https://github.com/phetsims/dot/issues/75
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    mod: function( a, b ) {
      if ( a / b % 1 === 0 ) {
        return 0; // a is a multiple of b
      }
      else {
        return a % b;
      }
    },

    /**
     * Greatest Common Divisor, using https://en.wikipedia.org/wiki/Euclidean_algorithm. See
     * https://en.wikipedia.org/wiki/Greatest_common_divisor
     * @public
     *
     * @param {number} a
     * @param {number} b
     * @returns {number}
     */
    gcd: function( a, b ) {
      return Math.abs( b === 0 ? a : this.gcd( b, Util.mod( a, b ) ) );
    },

    /**
     * Least Common Multiple, https://en.wikipedia.org/wiki/Least_common_multiple
     * @public
     *
     * @param {number} a
     * @param {number} b
     * @returns {number} lcm, an integer
     */
    lcm: function( a, b ) {
      return Util.roundSymmetric( Math.abs( a * b ) / Util.gcd( a, b ) );
    },

    /**
     * Intersection point between the lines defined by the line segments p1-2 and p3-p4. If the
     * lines are not properly defined, null is returned. If there are no intersections or infinitely many,
     * e.g. parallel lines, null is returned.
     * @public
     *
     * @param {Vector2} p1
     * @param {Vector2} p2
     * @param {Vector2} p3
     * @param {Vector2} p4
     * @returns {Vector2|null}
     */
    lineLineIntersection: function( p1, p2, p3, p4 ) {
      var epsilon = 1e-10;

      // If the endpoints are the same, they don't properly define a line
      if ( p1.equals( p2 ) || p3.equals( p4 ) ) {
        return null;
      }

      // Taken from an answer in
      // http://stackoverflow.com/questions/385305/efficient-maths-algorithm-to-calculate-intersections
      var x12 = p1.x - p2.x;
      var x34 = p3.x - p4.x;
      var y12 = p1.y - p2.y;
      var y34 = p3.y - p4.y;

      var denom = x12 * y34 - y12 * x34;

      // If the denominator is 0, lines are parallel or coincident
      if ( Math.abs( denom ) < epsilon ) {
        return null;
      }

      // define intersection using determinants, see https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
      var a = p1.x * p2.y - p1.y * p2.x;
      var b = p3.x * p4.y - p3.y * p4.x;

      return new dot.Vector2(
        ( a * x34 - x12 * b ) / denom,
        ( a * y34 - y12 * b ) / denom
      );
    },

    /**
     * Returns the center of a circle that will lie on 3 points (if it exists), otherwise null (if collinear).
     * @public
     *
     * @param {Vector2} p1
     * @param {Vector2} p2
     * @param {Vector2} p3
     * @returns {Vector2|null}
     */
    circleCenterFromPoints: function( p1, p2, p3 ) {
      // TODO: Can we make scratch vectors here, avoiding the circular reference?

      // midpoints between p1-p2 and p2-p3
      var p12 = new dot.Vector2( ( p1.x + p2.x ) / 2, ( p1.y + p2.y ) / 2 );
      var p23 = new dot.Vector2( ( p2.x + p3.x ) / 2, ( p2.y + p3.y ) / 2 );

      // perpendicular points from the minpoints
      var p12x = new dot.Vector2( p12.x + ( p2.y - p1.y ), p12.y - ( p2.x - p1.x ) );
      var p23x = new dot.Vector2( p23.x + ( p3.y - p2.y ), p23.y - ( p3.x - p2.x ) );

      return Util.lineLineIntersection( p12, p12x, p23, p23x );
    },

    /**
     * Returns whether the point p is inside the circle defined by the other three points (p1, p2, p3).
     * @public
     *
     * NOTE: p1,p2,p3 should be specified in a counterclockwise (mathematically) order, and thus should have a positive
     * signed area.
     *
     * See notes in https://en.wikipedia.org/wiki/Delaunay_triangulation.
     *
     * @param {Vector2} p1
     * @param {Vector2} p2
     * @param {Vector2} p3
     * @param {Vector2} p
     * @returns {boolean}
     */
    pointInCircleFromPoints: function( p1, p2, p3, p ) {
      assert && assert( Util.triangleAreaSigned( p1, p2, p3 ) > 0,
        'Defined points should be in a counterclockwise order' );

      var m00 = p1.x - p.x;
      var m01 = p1.y - p.y;
      var m02 = ( p1.x - p.x ) * ( p1.x - p.x ) + ( p1.y - p.y ) * ( p1.y - p.y );
      var m10 = p2.x - p.x;
      var m11 = p2.y - p.y;
      var m12 = ( p2.x - p.x ) * ( p2.x - p.x ) + ( p2.y - p.y ) * ( p2.y - p.y );
      var m20 = p3.x - p.x;
      var m21 = p3.y - p.y;
      var m22 = ( p3.x - p.x ) * ( p3.x - p.x ) + ( p3.y - p.y ) * ( p3.y - p.y );

      var determinant = m00 * m11 * m22 + m01 * m12 * m20 + m02 * m10 * m21 - m02 * m11 * m20 - m01 * m10 * m22 - m00 * m12 * m21;
      return determinant > 0;
    },

    /**
     * Ray-sphere intersection, returning information about the closest intersection. Assumes the sphere is centered
     * at the origin (for ease of computation), transform the ray to compensate if needed.
     * @public
     *
     * If there is no intersection, null is returned. Otherwise an object will be returned like:
     * <pre class="brush: js">
     * {
     *   distance: {number}, // distance from the ray position to the intersection
     *   hitPoint: {Vector3}, // location of the intersection
     *   normal: {Vector3}, // the normal of the sphere's surface at the intersection
     *   fromOutside: {boolean}, // whether the ray intersected the sphere from outside the sphere first
     * }
     * </pre>
     *
     * @param {number} radius
     * @param {Ray3} ray
     * @param {number} epsilon
     * @returns {Object}
     */
    // assumes a sphere with the specified radius, centered at the origin
    sphereRayIntersection: function( radius, ray, epsilon ) {
      epsilon = epsilon === undefined ? 1e-5 : epsilon;

      // center is the origin for now, but leaving in computations so that we can change that in the future. optimize away if needed
      var center = new dot.Vector3( 0, 0, 0 );

      var rayDir = ray.direction;
      var pos = ray.position;
      var centerToRay = pos.minus( center );

      // basically, we can use the quadratic equation to solve for both possible hit points (both +- roots are the hit points)
      var tmp = rayDir.dot( centerToRay );
      var centerToRayDistSq = centerToRay.magnitudeSquared;
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

    /**
     * Returns an array of the real roots of the quadratic equation $ax + b=0$, or null if every value is a solution.
     * @public
     *
     * @param {number} a
     * @param {number} b
     * @returns {Array.<number>|null} - The real roots of the equation, or null if all values are roots. If the root has
     *                                  a multiplicity larger than 1, it will be repeated that many times.
     */
    solveLinearRootsReal: function( a, b ) {
      if ( a === 0 ) {
        if ( b === 0 ) {
          return null;
        }
        else {
          return [];
        }
      }
      else {
        return [ -b / a ];
      }
    },

    /**
     * Returns an array of the real roots of the quadratic equation $ax^2 + bx + c=0$, or null if every value is a
     * solution. If a is nonzero, there should be between 0 and 2 (inclusive) values returned.
     * @public
     *
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @returns {Array.<number>|null} - The real roots of the equation, or null if all values are roots. If the root has
     *                                  a multiplicity larger than 1, it will be repeated that many times.
     */
    solveQuadraticRootsReal: function( a, b, c ) {
      // Check for a degenerate case where we don't have a quadratic, or if the order of magnitude is such where the
      // linear solution would be expected
      var epsilon = 1E7;
      if ( a === 0 || Math.abs( b / a ) > epsilon || Math.abs( c / a ) > epsilon ) {
        return Util.solveLinearRootsReal( b, c );
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

    /**
     * Returns an array of the real roots of the quadratic equation $ax^3 + bx^2 + cx + d=0$, or null if every value is a
     * solution. If a is nonzero, there should be between 0 and 3 (inclusive) values returned.
     * @public
     *
     * @param {number} a
     * @param {number} b
     * @param {number} c
     * @param {number} d
     * @returns {Array.<number>|null} - The real roots of the equation, or null if all values are roots. If the root has
     *                                  a multiplicity larger than 1, it will be repeated that many times.
     */
    solveCubicRootsReal: function( a, b, c, d ) {
      // TODO: a Complex type!

      // Check for a degenerate case where we don't have a cubic
      if ( a === 0 ) {
        return Util.solveQuadraticRootsReal( b, c, d );
      }

      //We need to test whether a is several orders of magnitude less than b, c, d
      var epsilon = 1E7;

      if ( a === 0 || Math.abs( b / a ) > epsilon || Math.abs( c / a ) > epsilon || Math.abs( d / a ) > epsilon ) {
        return Util.solveQuadraticRootsReal( b, c, d );
      }
      if ( d === 0 || Math.abs( a / d ) > epsilon || Math.abs( b / d ) > epsilon || Math.abs( c / d ) > epsilon ) {
        return [ 0 ].concat( Util.solveQuadraticRootsReal( a, b, c ) );
      }

      b /= a;
      c /= a;
      d /= a;

      var q = ( 3.0 * c - ( b * b ) ) / 9;
      var r = ( -( 27 * d ) + b * ( 9 * c - 2 * ( b * b ) ) ) / 54;
      var discriminant = q * q * q + r * r;
      var b3 = b / 3;

      if ( discriminant > 1e-7 ) {
        // a single real root
        var dsqrt = Math.sqrt( discriminant );
        return [ Util.cubeRoot( r + dsqrt ) + Util.cubeRoot( r - dsqrt ) - b3 ];
      }

      // three real roots
      if ( discriminant === 0 ) {
        // contains a double root
        var rsqrt = Util.cubeRoot( r );
        var doubleRoot = -b3 - rsqrt;
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

    /**
     * Returns the unique real cube root of x, such that $y^3=x$.
     * @public
     *
     * @param {number} x
     * @returns {number}
     */
    cubeRoot: function( x ) {
      return x >= 0 ? Math.pow( x, 1 / 3 ) : -Math.pow( -x, 1 / 3 );
    },

    /**
     * Defines and evaluates a linear mapping. The mapping is defined so that $f(a_1)=b_1$ and $f(a_2)=b_2$, and other
     * values are interpolated along the linear equation. The returned value is $f(a_3)$.
     * @public
     *
     * @param {number} a1
     * @param {number} a2
     * @param {number} b1
     * @param {number} b2
     * @param {number} a3
     * @returns {number}
     */
    linear: function( a1, a2, b1, b2, a3 ) {
      assert && assert( typeof a3 === 'number', 'linear requires a number to evaluate' );
      return ( b2 - b1 ) / ( a2 - a1 ) * ( a3 - a1 ) + b1;
    },

    /**
     * Rounds using "Round half away from zero" algorithm. See dot#35.
     * @public
     *
     * JavaScript's Math.round is not symmetric for positive and negative numbers, it uses IEEE 754 "Round half up".
     * See https://en.wikipedia.org/wiki/Rounding#Round_half_up.
     * For sims, we want to treat positive and negative values symmetrically, which is IEEE 754 "Round half away from zero",
     * See https://en.wikipedia.org/wiki/Rounding#Round_half_away_from_zero
     *
     * Note that -0 is rounded to 0, since we typically do not want to display -0 in sims.
     *
     * @param {number} value                               `
     * @returns {number}
     */
    roundSymmetric: function( value ) {
      return ( ( value < 0 ) ? -1 : 1 ) * Math.round( Math.abs( value ) );
    },

    /**
     * A predictable implementation of toFixed.
     * @public
     *
     * JavaScript's toFixed is notoriously buggy, behavior differs depending on browser,
     * because the spec doesn't specify whether to round or floor.
     * Rounding is symmetric for positive and negative values, see Util.roundSymmetric.
     *
     * @param {number} value
     * @param {number} decimalPlaces
     * @returns {string}
     */
    toFixed: function( value, decimalPlaces ) {
      var multiplier = Math.pow( 10, decimalPlaces );
      var newValue = Util.roundSymmetric( value * multiplier ) / multiplier;
      return newValue.toFixed( decimalPlaces );
    },

    /**
     * A predictable implementation of toFixed, where the result is returned as a number instead of a string.
     * @public
     *
     * JavaScript's toFixed is notoriously buggy, behavior differs depending on browser,
     * because the spec doesn't specify whether to round or floor.
     * Rounding is symmetric for positive and negative values, see Util.roundSymmetric.
     *
     * @param {number} value
     * @param {number} decimalPlaces
     * @returns {number}
     */
    toFixedNumber: function( value, decimalPlaces ) {
      return parseFloat( Util.toFixed( value, decimalPlaces ) );
    },

    /**
     * Returns whether the input is a number that is an integer (no fractional part).
     * @public
     *
     * @param {number} n
     * @returns {boolean}
     */
    isInteger: function( n ) {
      assert && assert( typeof n === 'number', 'isInteger requires its argument to be a number: ' + n );
      return n % 1 === 0;
    },

    /**
     * Returns true if two numbers are within epsilon of each other.
     *
     * @param {number} a
     * @param {number} b
     * @param {number} epsilon
     * @returns {boolean}
     */
    equalsEpsilon: function( a, b, epsilon ) {
      return Math.abs( a - b ) <= epsilon;
    },

    /**
     * Computes the intersection of the two line segments $(x_1,y_1)(x_2,y_2)$ and $(x_3,y_3)(x_4,y_4)$. If there is no
     * intersection, null is returned.
     * @public
     *
     * @param {number} x1
     * @param {number} y1
     * @param {number} x2
     * @param {number} y2
     * @param {number} x3
     * @param {number} y3
     * @param {number} x4
     * @param {number} y4
     * @returns {Vector2|null}
     */
    lineSegmentIntersection: function( x1, y1, x2, y2, x3, y3, x4, y4 ) {

      // @private
      // Determines counterclockwiseness. Positive if counterclockwise, negative if clockwise, zero if straight line
      // Point1(a,b), Point2(c,d), Point3(e,f)
      // See http://jeffe.cs.illinois.edu/teaching/373/notes/x05-convexhull.pdf
      // @returns {number}
      var ccw = function( a, b, c, d, e, f ) {
        return ( f - b ) * ( c - a ) - ( d - b ) * ( e - a );
      };

      // Check if intersection doesn't exist. See http://jeffe.cs.illinois.edu/teaching/373/notes/x06-sweepline.pdf
      // If point1 and point2 are on opposite sides of line 3 4, exactly one of the two triples 1, 3, 4 and 2, 3, 4
      // is in counterclockwise order.
      if ( ccw( x1, y1, x3, y3, x4, y4 ) * ccw( x2, y2, x3, y3, x4, y4 ) > 0 ||
           ccw( x3, y3, x1, y1, x2, y2 ) * ccw( x4, y4, x1, y1, x2, y2 ) > 0
      ) {
        return null;
      }

      var denom = ( x1 - x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 - x4 );
      // If denominator is 0, the lines are parallel or coincident
      if ( Math.abs( denom ) < 1e-10 ) {
        return null;
      }

      // Check if there is an exact endpoint overlap (and then return an exact answer).
      if ( ( x1 === x3 && y1 === y3 ) || ( x1 === x4 && y1 === y4 ) ) {
        return new dot.Vector2( x1, y1 );
      }
      else if ( ( x2 === x3 && y2 === y3 ) || ( x2 === x4 && y2 === y4 ) ) {
        return new dot.Vector2( x2, y2 );
      }

      // Use determinants to calculate intersection, see https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection
      var intersectionX = ( ( x1 * y2 - y1 * x2 ) * ( x3 - x4 ) - ( x1 - x2 ) * ( x3 * y4 - y3 * x4 ) ) / denom;
      var intersectionY = ( ( x1 * y2 - y1 * x2 ) * ( y3 - y4 ) - ( y1 - y2 ) * ( x3 * y4 - y3 * x4 ) ) / denom;
      return new dot.Vector2( intersectionX, intersectionY );
    },


    /**
     * Squared distance from a point to a line segment squared.
     * See http://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
     * @public
     *
     * @param {Vector2} point - The point
     * @param {Vector2} a - Starting point of the line segment
     * @param {Vector2} b - Ending point of the line segment
     * @returns {number}
     */
    distToSegmentSquared: function( point, a, b ) {
      // the square of the distance between a and b,
      var segmentSquaredLength = a.distanceSquared( b );

      // if the segment length is zero, the a and b point are coincident. return the squared distance between a and point
      if ( segmentSquaredLength === 0 ) { return point.distanceSquared( a ); }

      // the t value parametrize the projection of the point onto the a b line
      var t = ( ( point.x - a.x ) * ( b.x - a.x ) + ( point.y - a.y ) * ( b.y - a.y ) ) / segmentSquaredLength;

      var distanceSquared;

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
        distanceSquared = point.distanceSquared( new dot.Vector2( a.x + t * ( b.x - a.x ), a.y + t * ( b.y - a.y ) ) );
      }

      return distanceSquared;

    },

    /**
     * distance from a point to a line segment squared.
     * @public
     *
     * @param {Vector2} point - The point
     * @param {Vector2} a - Starting point of the line segment
     * @param {Vector2} b - Ending point of the line segment
     * @returns {number}
     */
    distToSegment: function( point, a, b ) {
      return Math.sqrt( this.distToSegmentSquared( point, a, b ) );
    },

    /**
     * Determines whether the three points are approximately collinear.
     * @public
     *
     * @param {Vector2} a
     * @param {Vector2} b
     * @param {Vector2} c
     * @param {number} epsilon
     * @returns {boolean}
     */
    arePointsCollinear: function( a, b, c, epsilon ) {
      if ( epsilon === undefined ) {
        epsilon = 0;
      }
      return Util.triangleArea( a, b, c ) <= epsilon;
    },

    /**
     * The area inside the triangle defined by the three vertices.
     * @public
     *
     * @param {Vector2} a
     * @param {Vector2} b
     * @param {Vector2} c
     * @returns {number}
     */
    triangleArea: function( a, b, c ) {
      return Math.abs( Util.triangleAreaSigned( a, b, c ) );
    },

    /**
     * The area inside the triangle defined by the three vertices, but with the sign determined by whether the vertices
     * provided are clockwise or counter-clockwise.
     * @public
     *
     * If the vertices are counterclockwise (in a right-handed coordinate system), then the signed area will be
     * positive.
     *
     * @param {Vector2} a
     * @param {Vector2} b
     * @param {Vector2} c
     * @returns {number}
     */
    triangleAreaSigned: function( a, b, c ) {
      return a.x * ( b.y - c.y ) + b.x * ( c.y - a.y ) + c.x * ( a.y - b.y );
    },

    /**
     * Polyfill for Math.sign from MDN, see
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/sign
     * @public
     *
     * We cannot use Math.sign because it is not supported on IE
     *
     * @param {number} x
     * @returns {number}
     */
    sign: function( x ) {
      return ( ( x > 0 ) - ( x < 0 ) ) || +x;
    },

    /**
     * Function that returns the hyperbolic cosine of a number
     * @public
     *
     * @param {number} value
     * @returns {number}
     */
    cosh: function( value ) {
      return ( Math.exp( value ) + Math.exp( -value ) ) / 2;
    },

    /**
     * Function that returns the hyperbolic sine of a number
     * @public
     *
     * @param {number} value
     * @returns {number}
     */
    sinh: function( value ) {
      return ( Math.exp( value ) - Math.exp( -value ) ) / 2;
    },

    /**
     * Log base-10, since it wasn't included in every supported browser.
     * @public
     *
     * @param {number} val
     * @returns {number}
     */
    log10: function( val ) {
      return Math.log( val ) / Math.LN10;
    },

    /**
     * Generates a random Gaussian sample with the given mean and standard deviation.
     * This method relies on the "static" variables generate, z0, and z1 defined above.
     * Random.js is the primary client of this function, but it is defined here so it can be
     * used other places more easily if need be.
     * Code inspired by example here: https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform.
     * @public
     *
     * @param {number} mu - The mean of the Gaussian
     * @param {number} sigma - The standard deviation of the Gaussian
     * @param {Random} random - the source of randomness
     * @returns {number}
     */
    boxMullerTransform: function( mu, sigma, random ) {
      generate = !generate;

      if ( !generate ) {
        return z1 * sigma + mu;
      }

      var u1;
      var u2;
      do {
        u1 = random.nextDouble();
        u2 = random.nextDouble();
      }
      while ( u1 <= EPSILON );

      z0 = Math.sqrt( -2.0 * Math.log( u1 ) ) * Math.cos( TWO_PI * u2 );
      z1 = Math.sqrt( -2.0 * Math.log( u1 ) ) * Math.sin( TWO_PI * u2 );
      return z0 * sigma + mu;
    },

    /**
     * Determines the number of decimal places in a value.
     * @param {number} value
     * @returns {number}
     */
    numberOfDecimalPlaces: function( value ) {
      var count = 0;
      var multiplier = 1;
      while ( ( value * multiplier ) % 1 !== 0 ) {
        count++;
        multiplier *= 10;
      }
      return count;
    },

    /**
     * Rounds a value to a multiple of a specified interval.
     * Examples:
     * roundToInterval( 0.567, 0.01 ) -> 0.57
     * roundToInterval( 0.567, 0.02 ) -> 0.56
     * roundToInterval( 5.67, 0.5 ) -> 5.5
     *
     * @param {number} value
     * @param {number} interval
     * @returns {number}
     */
    roundToInterval: function( value, interval ) {
      return Util.toFixedNumber( Util.roundSymmetric( value / interval ) * interval,
        Util.numberOfDecimalPlaces( interval ) );
    }
  };
  dot.register( 'Util', Util );

  // make these available in the main namespace directly (for now)
  dot.clamp = Util.clamp;
  dot.moduloBetweenDown = Util.moduloBetweenDown;
  dot.moduloBetweenUp = Util.moduloBetweenUp;
  dot.rangeInclusive = Util.rangeInclusive;
  dot.rangeExclusive = Util.rangeExclusive;
  dot.toRadians = Util.toRadians;
  dot.toDegrees = Util.toDegrees;
  dot.lineLineIntersection = Util.lineLineIntersection;
  dot.lineSegmentIntersection = Util.lineSegmentIntersection;
  dot.sphereRayIntersection = Util.sphereRayIntersection;
  dot.solveQuadraticRootsReal = Util.solveQuadraticRootsReal;
  dot.solveCubicRootsReal = Util.solveCubicRootsReal;
  dot.cubeRoot = Util.cubeRoot;
  dot.linear = Util.linear;
  dot.boxMullerTransform = Util.boxMullerTransform;

  return Util;
} );
