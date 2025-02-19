// Copyright 2013-2025, University of Colorado Boulder

/**
 * Utility functions for Dot, placed into the phet.dot.X namespace.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';
import { arePointsCollinear } from './util/arePointsCollinear.js';
import { boxMullerTransform } from './util/boxMullerTransform.js';
import { centroidOfPolygon } from './util/centroidOfPolygon.js';
import { circleCenterFromPoints } from './util/circleCenterFromPoints.js';
import { clamp } from './util/clamp.js';
import { cosh } from './util/cosh.js';
import { cubeRoot } from './util/cubeRoot.js';
import { distToSegment } from './util/distToSegment.js';
import { distToSegmentSquared } from './util/distToSegmentSquared.js';
import { equalsEpsilon } from './util/equalsEpsilon.js';
import { gcd } from './util/gcd.js';
import { lcm } from './util/lcm.js';
import { linear } from './util/linear.js';
import { lineLineIntersection } from './util/lineLineIntersection.js';
import { lineSegmentIntersection } from './util/lineSegmentIntersection.js';
import { log10 } from './util/log10.js';
import { mod } from './util/mod.js';
import { moduloBetweenDown } from './util/moduloBetweenDown.js';
import { moduloBetweenUp } from './util/moduloBetweenUp.js';
import { numberOfDecimalPlaces } from './util/numberOfDecimalPlaces.js';
import { pointInCircleFromPoints } from './util/pointInCircleFromPoints.js';
import { rangeExclusive } from './util/rangeExclusive.js';
import { rangeInclusive } from './util/rangeInclusive.js';
import { roundSymmetric } from './util/roundSymmetric.js';
import { roundToInterval } from './util/roundToInterval.js';
import { sinh } from './util/sinh.js';
import { solveCubicRootsReal } from './util/solveCubicRootsReal.js';
import { solveLinearRootsReal } from './util/solveLinearRootsReal.js';
import { solveQuadraticRootsReal } from './util/solveQuadraticRootsReal.js';
import { sphereRayIntersection } from './util/sphereRayIntersection.js';
import { toDegrees } from './util/toDegrees.js';
import { toFixed } from './util/toFixed.js';
import { toFixedNumber } from './util/toFixedNumber.js';
import { toRadians } from './util/toRadians.js';
import { triangleArea } from './util/triangleArea.js';
import { triangleAreaSigned } from './util/triangleAreaSigned.js';

/**
 * @deprecated - please use individual file functions in js/util/*
 */
const Utils = {
  /**
   * Returns the original value if it is inclusively within the [max,min] range. If it's below the range, min is
   * returned, and if it's above the range, max is returned.
   * @public
   *
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/clamp.ts
   */
  clamp( value, min, max ) {
    return clamp( value, min, max );
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
   *
   * @deprecated - please use the separate file function directly, js/util/moduloBetweenDown.ts
   */
  moduloBetweenDown( value, min, max ) {
    return moduloBetweenDown( value, min, max );
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
   *
   * @deprecated - please use the separate file function directly, js/util/moduloBetweenUp.ts
   */
  moduloBetweenUp( value, min, max ) {
    return moduloBetweenUp( value, min, max );
  },

  /**
   * Returns an array of integers from A to B (inclusive), e.g. rangeInclusive( 4, 7 ) maps to [ 4, 5, 6, 7 ].
   * @public
   *
   * @param {number} a
   * @param {number} b
   * @returns {Array.<number>}
   *
   * @deprecated - please use the separate file function directly, js/util/rangeInclusive.ts
   */
  rangeInclusive( a, b ) {
    return rangeInclusive( a, b );
  },

  /**
   * Returns an array of integers from A to B (exclusive), e.g. rangeExclusive( 4, 7 ) maps to [ 5, 6 ].
   * @public
   *
   * @param {number} a
   * @param {number} b
   * @returns {Array.<number>}
   *
   * @deprecated - please use the separate file function directly, js/util/rangeExclusive.ts
   */
  rangeExclusive( a, b ) {
    return rangeExclusive( a, b );
  },

  /**
   * Converts degrees to radians.
   * @public
   *
   * @param {number} degrees
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/toRadians.ts
   */
  toRadians( degrees ) {
    return toRadians( degrees );
  },

  /**
   * Converts radians to degrees.
   * @public
   *
   * @param {number} radians
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/toDegrees.ts
   */
  toDegrees( radians ) {
    return toDegrees( radians );
  },

  /**
   * Workaround for broken modulo operator.
   * E.g. on iOS9, 1e10 % 1e10 -> 2.65249474e-315
   * See https://github.com/phetsims/dot/issues/75
   * @param {number} a
   * @param {number} b
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/mod.ts
   */
  mod( a, b ) {
    return mod( a, b );
  },

  /**
   * Greatest Common Divisor, using https://en.wikipedia.org/wiki/Euclidean_algorithm. See
   * https://en.wikipedia.org/wiki/Greatest_common_divisor
   * @public
   *
   * @param {number} a
   * @param {number} b
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/gcd.ts
   */
  gcd( a, b ) {
    return gcd( a, b );
  },

  /**
   * Least Common Multiple, https://en.wikipedia.org/wiki/Least_common_multiple
   * @public
   *
   * @param {number} a
   * @param {number} b
   * @returns {number} lcm, an integer
   *
   * @deprecated - please use the separate file function directly, js/util/lcm.ts
   */
  lcm( a, b ) {
    return lcm( a, b );
  },

  /**
   * Intersection point between the lines defined by the line segments p1-p2 and p3-p4. If the
   * lines are not properly defined, null is returned. If there are no intersections or infinitely many,
   * e.g. parallel lines, null is returned.
   * @public
   *
   * @param {Vector2} p1
   * @param {Vector2} p2
   * @param {Vector2} p3
   * @param {Vector2} p4
   * @returns {Vector2|null}
   *
   * @deprecated - please use the separate file function directly, js/util/lineLineIntersection.ts
   */
  lineLineIntersection( p1, p2, p3, p4 ) {
    return lineLineIntersection( p1, p2, p3, p4 );
  },

  /**
   * Returns the center of a circle that will lie on 3 points (if it exists), otherwise null (if collinear).
   * @public
   *
   * @param {Vector2} p1
   * @param {Vector2} p2
   * @param {Vector2} p3
   * @returns {Vector2|null}
   *
   * @deprecated - please use the separate file function directly, js/util/circleCenterFromPoints.ts
   */
  circleCenterFromPoints( p1, p2, p3 ) {
    return circleCenterFromPoints( p1, p2, p3 );
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
   *
   * @deprecated - please use the separate file function directly, js/util/pointInCircleFromPoints.ts
   */
  pointInCircleFromPoints( p1, p2, p3, p ) {
    return pointInCircleFromPoints( p1, p2, p3, p );
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
   *
   * @deprecated - please use the separate file function directly, js/util/sphereRayIntersection.ts
   */
  // assumes a sphere with the specified radius, centered at the origin
  sphereRayIntersection( radius, ray, epsilon ) {
    return sphereRayIntersection( radius, ray, epsilon );
  },

  /**
   * Returns an array of the real roots of the quadratic equation $ax + b=0$, or null if every value is a solution.
   * @public
   *
   * @param {number} a
   * @param {number} b
   * @returns {Array.<number>|null} - The real roots of the equation, or null if all values are roots. If the root has
   *                                  a multiplicity larger than 1, it will be repeated that many times.
   *
   * @deprecated - please use the separate file function directly, js/util/solveLinearRootsReal.ts
   */
  solveLinearRootsReal( a, b ) {
    return solveLinearRootsReal( a, b );
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
   *
   * @deprecated - please use the separate file function directly, js/util/solveQuadraticRootsReal.ts
   */
  solveQuadraticRootsReal( a, b, c ) {
    return solveQuadraticRootsReal( a, b, c );
  },

  /**
   * Returns an array of the real roots of the cubic equation $ax^3 + bx^2 + cx + d=0$, or null if every value is a
   * solution. If a is nonzero, there should be between 0 and 3 (inclusive) values returned.
   * @public
   *
   * @param {number} a
   * @param {number} b
   * @param {number} c
   * @param {number} d
   * @param {number} [discriminantThreshold] - for determining whether we have a single real root
   * @returns {Array.<number>|null} - The real roots of the equation, or null if all values are roots. If the root has
   *                                  a multiplicity larger than 1, it will be repeated that many times.
   *
   * @deprecated - please use the separate file function directly, js/util/solveCubicRootsReal.ts
   */
  solveCubicRootsReal( a, b, c, d, discriminantThreshold ) {
    return solveCubicRootsReal( a, b, c, d, discriminantThreshold );
  },

  /**
   * Returns the unique real cube root of x, such that $y^3=x$.
   * @public
   *
   * @param {number} x
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/cubeRoot.ts
   */
  cubeRoot( x ) {
    return cubeRoot( x );
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
   *
   * @deprecated - please use the separate file function directly, js/util/linear.ts
   */
  linear( a1, a2, b1, b2, a3 ) {
    return linear( a1, a2, b1, b2, a3 );
  },

  /**
   * Rounds using "Round half away from zero" algorithm. See dot#35.
   *
   * @param {number} value                               `
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/roundSymmetric.ts
   */
  roundSymmetric( value ) {
    return roundSymmetric( value );
  },

  /**
   * A predictable implementation of toFixed.
   * @public
   *
   * JavaScript's toFixed is notoriously buggy, behavior differs depending on browser,
   * because the spec doesn't specify whether to round or floor.
   * Rounding is symmetric for positive and negative values, see roundSymmetric.
   *
   * @param {number} value
   * @param {number} decimalPlaces
   * @returns {string}
   *
   * @deprecated - please use the separate file function directly, js/util/toFixed.ts
   */
  toFixed( value, decimalPlaces ) {
    return toFixed( value, decimalPlaces );
  },

  /**
   * A predictable implementation of toFixed, where the result is returned as a number instead of a string.
   * @public
   *
   * JavaScript's toFixed is notoriously buggy, behavior differs depending on browser,
   * because the spec doesn't specify whether to round or floor.
   * Rounding is symmetric for positive and negative values, see roundSymmetric.
   *
   * @param {number} value
   * @param {number} decimalPlaces
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/toFixed.ts
   */
  toFixedNumber( value, decimalPlaces ) {
    return toFixedNumber( value, decimalPlaces );
  },

  /**
   * Returns true if two numbers are within epsilon of each other.
   *
   * @param {number} a
   * @param {number} b
   * @param {number} epsilon
   * @returns {boolean}
   *
   * @deprecated - please use the separate file function directly, js/util/equalsEpsilon.ts
   */
  equalsEpsilon( a, b, epsilon ) {
    return equalsEpsilon( a, b, epsilon );
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
   *
   * @deprecated - please use the separate file function directly, js/util/lineSegmentIntersection.ts
   */
  lineSegmentIntersection( x1, y1, x2, y2, x3, y3, x4, y4 ) {
    return lineSegmentIntersection( x1, y1, x2, y2, x3, y3, x4, y4 );
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
   *
   * @deprecated - please use the separate file function directly, js/util/distToSegmentSquared.ts
   */
  distToSegmentSquared( point, a, b ) {
    return distToSegmentSquared( point, a, b );
  },

  /**
   * distance from a point to a line segment squared.
   * @public
   *
   * @param {Vector2} point - The point
   * @param {Vector2} a - Starting point of the line segment
   * @param {Vector2} b - Ending point of the line segment
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/distToSegmentSquared.ts
   */
  distToSegment( point, a, b ) {
    return distToSegment( point, a, b );
  },

  /**
   * Determines whether the three points are approximately collinear.
   * @public
   *
   * @param {Vector2} a
   * @param {Vector2} b
   * @param {Vector2} c
   * @param {number} [epsilon]
   * @returns {boolean}
   *
   * @deprecated - please use the separate file function directly, js/util/arePointsCollinear.ts
   */
  arePointsCollinear( a, b, c, epsilon ) {
    return arePointsCollinear( a, b, c, epsilon );
  },

  /**
   * The area inside the triangle defined by the three vertices.
   * @public
   *
   * @param {Vector2} a
   * @param {Vector2} b
   * @param {Vector2} c
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/triangleArea.ts
   */
  triangleArea( a, b, c ) {
    return triangleArea( a, b, c );
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
   *
   * @deprecated - please use the separate file function directly, js/util/triangleAreaSigned.ts
   */
  triangleAreaSigned( a, b, c ) {
    return triangleAreaSigned( a, b, c );
  },

  /**
   * Returns the centroid of the simple planar polygon using Green's Theorem P=-y/2, Q=x/2 (similar to how kite
   * computes areas). See also https://en.wikipedia.org/wiki/Shoelace_formula.
   * @public
   *
   * @param {Array.<Vector2>} vertices
   * @returns {Vector2}
   *
   * @deprecated - please use the separate file function directly, js/util/centroidOfPolygon.ts
   */
  centroidOfPolygon( vertices ) {
    return centroidOfPolygon( vertices );
  },

  /**
   * Function that returns the hyperbolic cosine of a number
   * @public
   *
   * @param {number} value
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/cosh.ts
   */
  cosh( value ) {
    return cosh( value );
  },

  /**
   * Function that returns the hyperbolic sine of a number
   * @public
   *
   * @param {number} value
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/sinh.ts
   */
  sinh( value ) {
    return sinh( value );
  },

  /**
   * Log base-10, since it wasn't included in every supported browser.
   * @public
   *
   * @param {number} val
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/log10.ts
   */
  log10( val ) {
    return log10( val );
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
   *
   * @deprecated - please use the separate file function directly, js/util/boxMullerTransform.ts
   */
  boxMullerTransform( mu, sigma, random ) {
    return boxMullerTransform( mu, sigma, random );
  },

  /**
   * Determines the number of decimal places in a value.
   * @public
   *
   * @param {number} value - a finite number, scientific notation is not supported for decimal numbers
   * @returns {number}
   *
   * @deprecated - please use the separate file function directly, js/util/numberOfDecimalPlaces.ts
   */
  numberOfDecimalPlaces( value ) {
    return numberOfDecimalPlaces( value );
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
   *
   * @deprecated - please use the separate file function directly, js/util/roundToInterval.ts
   */
  roundToInterval( value, interval ) {
    return roundToInterval( value, interval );
  }
};
dot.register( 'Utils', Utils );

export default Utils;