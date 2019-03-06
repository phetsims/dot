// Copyright 2013-2015, University of Colorado Boulder

/**
 * Basic 3-dimensional vector, represented as (x,y,z).
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  var inherit = require( 'PHET_CORE/inherit' );
  var Poolable = require( 'PHET_CORE/Poolable' );

  require( 'DOT/Util' );
  require( 'DOT/Vector2' );
  require( 'DOT/Vector4' );

  /**
   * Creates a 3-dimensional vector with the specified X, Y and Z values.
   * @constructor
   * @public
   *
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {number} z - Z coordinate
   */
  function Vector3( x, y, z ) {

    assert && assert( typeof x === 'number', 'x needs to be a number' );
    assert && assert( typeof y === 'number', 'y needs to be a number' );
    assert && assert( typeof z === 'number', 'z needs to be a number' );

    // @public {number} - The X coordinate of the vector.
    this.x = x;

    // @public {number} - The Y coordinate of the vector.
    this.y = y;

    // @public {number} - The Z coordinate of the vector.
    this.z = z;
  }

  dot.register( 'Vector3', Vector3 );

  inherit( Object, Vector3, {
    // @public (read-only) - Helps to identify the dimension of the vector
    isVector3: true,
    dimension: 3,

    /**
     * The magnitude (Euclidean/L2 Norm) of this vector, i.e. $\sqrt{x^2+y^2+z^2}$.
     * @public
     *
     * @returns {number}
     */
    getMagnitude: function() {
      return Math.sqrt( this.magnitudeSquared );
    },
    get magnitude() {
      return this.getMagnitude();
    },

    /**
     * T squared magnitude (square of the Euclidean/L2 Norm) of this vector, i.e. $x^2+y^2+z^2$.
     * @public
     *
     * @returns {number}
     */
    getMagnitudeSquared: function() {
      return this.dot( this );
    },
    get magnitudeSquared() {
      return this.getMagnitudeSquared();
    },

    /**
     * The Euclidean distance between this vector (treated as a point) and another point.
     * @public
     *
     * @param {Vector3} point
     * @returns {number}
     */
    distance: function( point ) {
      return Math.sqrt( this.distanceSquared( point ) );
    },

    /**
     * The Euclidean distance between this vector (treated as a point) and another point (x,y,z).
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    distanceXYZ: function( x, y, z ) {
      var dx = this.x - x;
      var dy = this.y - y;
      var dz = this.z - z;
      return Math.sqrt( dx * dx + dy * dy + dz * dz );
    },

    /**
     * The squared Euclidean distance between this vector (treated as a point) and another point.
     * @public
     *
     * @param {Vector3} point
     * @returns {number}
     */
    distanceSquared: function( point ) {
      var dx = this.x - point.x;
      var dy = this.y - point.y;
      var dz = this.z - point.z;
      return dx * dx + dy * dy + dz * dz;
    },

    /**
     * The squared Euclidean distance between this vector (treated as a point) and another point (x,y,z).
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    distanceSquaredXYZ: function( x, y, z ) {
      var dx = this.x - x;
      var dy = this.y - y;
      var dz = this.z - z;
      return dx * dx + dy * dy + dz * dz;
    },

    /**
     * The dot-product (Euclidean inner product) between this vector and another vector v.
     * @public
     *
     * @param {Vector3} v
     * @returns {number}
     */
    dot: function( v ) {
      return this.x * v.x + this.y * v.y + this.z * v.z;
    },

    /**
     * The dot-product (Euclidean inner product) between this vector and another vector (x,y,z).
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {number}
     */
    dotXYZ: function( x, y, z ) {
      return this.x * x + this.y * y + this.z * z;
    },

    /**
     * The angle between this vector and another vector, in the range $\theta\in[0, \pi]$.
     * @public
     *
     * Equal to $\theta = \cos^{-1}( \hat{u} \cdot \hat{v} )$ where $\hat{u}$ is this vector (normalized) and $\hat{v}$
     * is the input vector (normalized).
     *
     * @param {Vector3} v
     * @returns {number}
     */
    angleBetween: function( v ) {
      return Math.acos( dot.clamp( this.normalized().dot( v.normalized() ), -1, 1 ) );
    },

    /**
     * Exact equality comparison between this vector and another vector.
     * @public
     *
     * @param {Vector3} other
     * @returns {boolean} - Whether the two vectors have equal components
     */
    equals: function( other ) {
      return this.x === other.x && this.y === other.y && this.z === other.z;
    },

    /**
     * Approximate equality comparison between this vector and another vector.
     * @public
     *
     * @param {Vector3} other
     * @param {number} epsilon
     * @returns {boolean} - Whether difference between the two vectors has no component with an absolute value greater
     *                      than epsilon.
     */
    equalsEpsilon: function( other, epsilon ) {
      if ( !epsilon ) {
        epsilon = 0;
      }
      return Math.abs( this.x - other.x ) + Math.abs( this.y - other.y ) + Math.abs( this.z - other.z ) <= epsilon;
    },

    /**
     * Whether all of the components are numbers (not NaN) that are not infinity or -infinity.
     * @public
     *
     * @returns {boolean}
     */
    isFinite: function() {
      return isFinite( this.x ) && isFinite( this.y ) && isFinite( this.z );
    },

    /*---------------------------------------------------------------------------*
     * Immutables
     *---------------------------------------------------------------------------*/

    /**
     * Creates a copy of this vector, or if a vector is passed in, set that vector's values to ours.
     * @public
     *
     * This is the immutable form of the function set(), if a vector is provided. This will return a new vector, and
     * will not modify this vector.
     *
     * @param {Vector3} [vector] - If not provided, creates a new Vector3 with filled in values. Otherwise, fills in the
     *                             values of the provided vector so that it equals this vector.
     * @returns {Vector3}
     */
    copy: function( vector ) {
      if ( vector ) {
        return vector.set( this );
      }
      else {
        return new Vector3( this.x, this.y, this.z );
      }
    },

    /**
     * The Euclidean 3-dimensional cross-product of this vector by the passed-in vector.
     * @public
     *
     * @param {Vector3} v
     * @returns {Vector3}
     */
    cross: function( v ) {
      return new Vector3(
        this.y * v.z - this.z * v.y,
        this.z * v.x - this.x * v.z,
        this.x * v.y - this.y * v.x
      );
    },

    /**
     * Normalized (re-scaled) copy of this vector such that its magnitude is 1. If its initial magnitude is zero, an
     * error is thrown.
     * @public
     *
     * This is the immutable form of the function normalize(). This will return a new vector, and will not modify this
     * vector.
     *
     * @returns {Vector3}
     */
    normalized: function() {
      var mag = this.magnitude;
      if ( mag === 0 ) {
        throw new Error( 'Cannot normalize a zero-magnitude vector' );
      }
      else {
        return new Vector3( this.x / mag, this.y / mag, this.z / mag );
      }
    },

    /**
     * Returns a copy of this vector with each component rounded by Util.roundSymmetric.
     * @public
     *
     * This is the immutable form of the function roundSymmetric(). This will return a new vector, and will not modify
     * this vector.
     *
     * @returns {Vector3}
     */
    roundedSymmetric: function() {
      return this.copy().roundSymmetric();
    },

    /**
     * Re-scaled copy of this vector such that it has the desired magnitude. If its initial magnitude is zero, an error
     * is thrown. If the passed-in magnitude is negative, the direction of the resulting vector will be reversed.
     * @public
     *
     * This is the immutable form of the function setMagnitude(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {number} magnitude
     * @returns {Vector3}
     */
    withMagnitude: function( magnitude ) {
      return this.copy().setMagnitude( magnitude );
    },

    /**
     * Copy of this vector, scaled by the desired scalar value.
     * @public
     *
     * This is the immutable form of the function multiplyScalar(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    timesScalar: function( scalar ) {
      return new Vector3( this.x * scalar, this.y * scalar, this.z * scalar );
    },

    /**
     * Same as timesScalar.
     * @public
     *
     * This is the immutable form of the function multiply(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    times: function( scalar ) {
      // make sure it's not a vector!
      assert && assert( scalar.dimension === undefined );
      return this.timesScalar( scalar );
    },

    /**
     * Copy of this vector, multiplied component-wise by the passed-in vector v.
     * @public
     *
     * This is the immutable form of the function componentMultiply(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {Vector3} v
     * @returns {Vector3}
     */
    componentTimes: function( v ) {
      return new Vector3( this.x * v.x, this.y * v.y, this.z * v.z );
    },

    /**
     * Addition of this vector and another vector, returning a copy.
     * @public
     *
     * This is the immutable form of the function add(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {Vector3} v
     * @returns {Vector3}
     */
    plus: function( v ) {
      return new Vector3( this.x + v.x, this.y + v.y, this.z + v.z );
    },

    /**
     * Addition of this vector and another vector (x,y,z), returning a copy.
     * @public
     *
     * This is the immutable form of the function addXYZ(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector3}
     */
    plusXYZ: function( x, y, z ) {
      return new Vector3( this.x + x, this.y + y, this.z + z );
    },

    /**
     * Addition of this vector with a scalar (adds the scalar to every component), returning a copy.
     * @public
     *
     * This is the immutable form of the function addScalar(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    plusScalar: function( scalar ) {
      return new Vector3( this.x + scalar, this.y + scalar, this.z + scalar );
    },

    /**
     * Subtraction of this vector by another vector v, returning a copy.
     * @public
     *
     * This is the immutable form of the function subtract(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {Vector3} v
     * @returns {Vector3}
     */
    minus: function( v ) {
      return new Vector3( this.x - v.x, this.y - v.y, this.z - v.z );
    },

    /**
     * Subtraction of this vector by another vector (x,y,z), returning a copy.
     * @public
     *
     * This is the immutable form of the function subtractXYZ(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector3}
     */
    minusXYZ: function( x, y, z ) {
      return new Vector3( this.x - x, this.y - y, this.z - z );
    },

    /**
     * Subtraction of this vector by a scalar (subtracts the scalar from every component), returning a copy.
     * @public
     *
     * This is the immutable form of the function subtractScalar(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    minusScalar: function( scalar ) {
      return new Vector3( this.x - scalar, this.y - scalar, this.z - scalar );
    },

    /**
     * Division of this vector by a scalar (divides every component by the scalar), returning a copy.
     * @public
     *
     * This is the immutable form of the function divideScalar(). This will return a new vector, and will not modify
     * this vector.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    dividedScalar: function( scalar ) {
      return new Vector3( this.x / scalar, this.y / scalar, this.z / scalar );
    },

    /**
     * Negated copy of this vector (multiplies every component by -1).
     * @public
     *
     * This is the immutable form of the function negate(). This will return a new vector, and will not modify
     * this vector.
     *
     * @returns {Vector3}
     */
    negated: function() {
      return new Vector3( -this.x, -this.y, -this.z );
    },

    /**
     * A linear interpolation between this vector (ratio=0) and another vector (ratio=1).
     * @public
     *
     * @param {Vector3} vector
     * @param {number} ratio - Not necessarily constrained in [0, 1]
     * @returns {Vector3}
     */
    blend: function( vector, ratio ) {
      return this.plus( vector.minus( this ).times( ratio ) );
    },

    /**
     * The average (midpoint) between this vector and another vector.
     * @public
     *
     * @param {Vector3} vector
     * @returns {Vector3}
     */
    average: function( vector ) {
      return this.blend( vector, 0.5 );
    },

    /**
     * Debugging string for the vector.
     * @public
     *
     * @returns {string}
     */
    toString: function() {
      return 'Vector3(' + this.x + ', ' + this.y + ', ' + this.z + ')';
    },

    /**
     * Converts this to a 2-dimensional vector, discarding the z-component.
     * @public
     *
     * @returns {Vector2}
     */
    toVector2: function() {
      return new dot.Vector2( this.x, this.y );
    },

    /**
     * Converts this to a 4-dimensional vector, with the z-component equal to 1 (useful for homogeneous coordinates).
     * @public
     *
     * @returns {Vector4}
     */
    toVector4: function() {
      return new dot.Vector4( this.x, this.y, this.z, 1 );
    },

    /*---------------------------------------------------------------------------*
     * Mutables
     * - all mutation should go through setXYZ / setX / setY / setZ
     *---------------------------------------------------------------------------*/

    /**
     * Sets all of the components of this vector, returning this.
     * @public
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector3}
     */
    setXYZ: function( x, y, z ) {
      this.x = x;
      this.y = y;
      this.z = z;
      return this;
    },

    /**
     * Sets the x-component of this vector, returning this.
     * @public
     *
     * @param {number} x
     * @returns {Vector3}
     */
    setX: function( x ) {
      this.x = x;
      return this;
    },

    /**
     * Sets the y-component of this vector, returning this.
     * @public
     *
     * @param {number} y
     * @returns {Vector3}
     */
    setY: function( y ) {
      this.y = y;
      return this;
    },

    /**
     * Sets the z-component of this vector, returning this.
     * @public
     *
     * @param {number} z
     * @returns {Vector3}
     */
    setZ: function( z ) {
      this.z = z;
      return this;
    },

    /**
     * Sets this vector to be a copy of another vector.
     * @public
     *
     * This is the mutable form of the function copy(). This will mutate (change) this vector, in addition to returning
     * this vector itself.
     *
     * @param {Vector3} v
     * @returns {Vector3}
     */
    set: function( v ) {
      return this.setXYZ( v.x, v.y, v.z );
    },

    /**
     * Sets the magnitude of this vector. If the passed-in magnitude is negative, this flips the vector and sets its
     * magnitude to abs( magnitude ).
     * @public
     *
     * This is the mutable form of the function withMagnitude(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {number} magnitude
     * @returns {Vector3}
     */
    setMagnitude: function( magnitude ) {
      var scale = magnitude / this.magnitude;
      return this.multiplyScalar( scale );
    },

    /**
     * Adds another vector to this vector, changing this vector.
     * @public
     *
     * This is the mutable form of the function plus(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {Vector2} v
     * @returns {Vector2}
     */
    add: function( v ) {
      return this.setXYZ( this.x + v.x, this.y + v.y, this.z + v.z );
    },

    /**
     * Adds another vector (x,y,z) to this vector, changing this vector.
     * @public
     *
     * This is the mutable form of the function plusXYZ(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector3}
     */
    addXYZ: function( x, y, z ) {
      return this.setXYZ( this.x + x, this.y + y, this.z + z );
    },

    /**
     * Adds a scalar to this vector (added to every component), changing this vector.
     * @public
     *
     * This is the mutable form of the function plusScalar(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    addScalar: function( scalar ) {
      return this.setXYZ( this.x + scalar, this.y + scalar, this.z + scalar );
    },

    /**
     * Subtracts this vector by another vector, changing this vector.
     * @public
     *
     * This is the mutable form of the function minus(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {Vector3} v
     * @returns {Vector3}
     */
    subtract: function( v ) {
      return this.setXYZ( this.x - v.x, this.y - v.y, this.z - v.z );
    },

    /**
     * Subtracts this vector by another vector (x,y,z), changing this vector.
     * @public
     *
     * This is the mutable form of the function minusXYZ(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {number} x
     * @param {number} y
     * @param {number} z
     * @returns {Vector3}
     */
    subtractXYZ: function( x, y, z ) {
      return this.setXYZ( this.x - x, this.y - y, this.z - z );
    },

    /**
     * Subtracts this vector by a scalar (subtracts each component by the scalar), changing this vector.
     * @public
     *
     * This is the mutable form of the function minusScalar(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    subtractScalar: function( scalar ) {
      return this.setXYZ( this.x - scalar, this.y - scalar, this.z - scalar );
    },

    /**
     * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
     * @public
     *
     * This is the mutable form of the function timesScalar(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    multiplyScalar: function( scalar ) {
      return this.setXYZ( this.x * scalar, this.y * scalar, this.z * scalar );
    },

    /**
     * Multiplies this vector by a scalar (multiplies each component by the scalar), changing this vector.
     * Same as multiplyScalar.
     * @public
     *
     * This is the mutable form of the function times(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    multiply: function( scalar ) {
      // make sure it's not a vector!
      assert && assert( scalar.dimension === undefined );
      return this.multiplyScalar( scalar );
    },

    /**
     * Multiplies this vector by another vector component-wise, changing this vector.
     * @public
     *
     * This is the mutable form of the function componentTimes(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {Vector3} v
     * @returns {Vector3}
     */
    componentMultiply: function( v ) {
      return this.setXYZ( this.x * v.x, this.y * v.y, this.z * v.z );
    },

    /**
     * Divides this vector by a scalar (divides each component by the scalar), changing this vector.
     * @public
     *
     * This is the mutable form of the function dividedScalar(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @param {number} scalar
     * @returns {Vector3}
     */
    divideScalar: function( scalar ) {
      return this.setXYZ( this.x / scalar, this.y / scalar, this.z / scalar );
    },

    /**
     * Negates this vector (multiplies each component by -1), changing this vector.
     * @public
     *
     * This is the mutable form of the function negated(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @returns {Vector3}
     */
    negate: function() {
      return this.setXYZ( -this.x, -this.y, -this.z );
    },

    /**
     * Normalizes this vector (rescales to where the magnitude is 1), changing this vector.
     * @public
     *
     * This is the mutable form of the function normalized(). This will mutate (change) this vector, in addition to
     * returning this vector itself.
     *
     * @returns {Vector3}
     */
    normalize: function() {
      var mag = this.magnitude;
      if ( mag === 0 ) {
        throw new Error( 'Cannot normalize a zero-magnitude vector' );
      }
      else {
        return this.divideScalar( mag );
      }
    },

    /**
     * Rounds each component of this vector with Util.roundSymmetric.
     * @public
     *
     * This is the mutable form of the function roundedSymmetric(). This will mutate (change) this vector, in addition
     * to returning the vector itself.
     *
     * @returns {Vector3}
     */
    roundSymmetric: function() {
      return this.setXYZ( dot.Util.roundSymmetric( this.x ),
        dot.Util.roundSymmetric( this.y ),
        dot.Util.roundSymmetric( this.z ) );
    }
  }, {
    /**
     * Spherical linear interpolation between two unit vectors.
     * @public
     *
     * @param {Vector3} start - Start unit vector
     * @param {Vector3} end - End unit vector
     * @param {number} ratio  - Between 0 (at start vector) and 1 (at end vector)
     * @returns {Vector3} Spherical linear interpolation between the start and end
     */
    slerp: function( start, end, ratio ) {
      // NOTE: we can't create a require() loop here
      return dot.Quaternion.slerp( new dot.Quaternion(), dot.Quaternion.getRotationQuaternion( start, end ), ratio ).timesVector3( start );
    }
  } );

  // Sets up pooling on Vector3
  Poolable.mixInto( Vector3, {
    initialize: Vector3.prototype.setXYZ,
    defaultArguments: [ 0, 0, 0 ]
  } );

  /*---------------------------------------------------------------------------*
   * Immutable Vector form
   *---------------------------------------------------------------------------*/

  // @private
  Vector3.Immutable = function( x, y, z ) {
    this.x = x !== undefined ? x : 0;
    this.y = y !== undefined ? y : 0;
    this.z = z !== undefined ? z : 0;
  };
  var Immutable = Vector3.Immutable;

  inherit( Vector3, Immutable );

  // throw errors whenever a mutable method is called on our immutable vector
  Immutable.mutableOverrideHelper = function( mutableFunctionName ) {
    Immutable.prototype[ mutableFunctionName ] = function() {
      throw new Error( 'Cannot call mutable method \'' + mutableFunctionName + '\' on immutable Vector3' );
    };
  };

  // TODO: better way to handle this list?
  Immutable.mutableOverrideHelper( 'setXYZ' );
  Immutable.mutableOverrideHelper( 'setX' );
  Immutable.mutableOverrideHelper( 'setY' );
  Immutable.mutableOverrideHelper( 'setZ' );

  // @public {Vector3} - helpful immutable constants
  Vector3.ZERO = assert ? new Immutable( 0, 0, 0 ) : new Vector3( 0, 0, 0 );
  Vector3.X_UNIT = assert ? new Immutable( 1, 0, 0 ) : new Vector3( 1, 0, 0 );
  Vector3.Y_UNIT = assert ? new Immutable( 0, 1, 0 ) : new Vector3( 0, 1, 0 );
  Vector3.Z_UNIT = assert ? new Immutable( 0, 0, 1 ) : new Vector3( 0, 0, 1 );

  return Vector3;
} );
