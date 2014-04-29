// Copyright 2002-2014, University of Colorado Boulder

/**
 * Quaternion, see http://en.wikipedia.org/wiki/Quaternion
 *
 * TODO: convert from JME-style parameterization into classical mathematical description?
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  var Poolable = require( 'PHET_CORE/Poolable' );
  require( 'DOT/Vector3' );
  require( 'DOT/Matrix3' );
  require( 'DOT/Util' );

  dot.Quaternion = function Quaternion( x, y, z, w ) {
    this.setXYZW( x, y, z, w );

    phetAllocation && phetAllocation( 'Quaternion' );
  };
  var Quaternion = dot.Quaternion;

  Quaternion.prototype = {
    constructor: Quaternion,

    isQuaternion: true,

    setXYZW: function( x, y, z, w ) {
      this.x = x || 0;
      this.y = y || 0;
      this.z = z || 0;
      this.w = w !== undefined ? w : 1;
    },

    /*---------------------------------------------------------------------------*
     * Immutables
     *----------------------------------------------------------------------------*/

    plus: function( quat ) {
      return new Quaternion( this.x + quat.x, this.y + quat.y, this.z + quat.z, this.w + quat.w );
    },

    timesScalar: function( s ) {
      return new Quaternion( this.x * s, this.y * s, this.z * s, this.w * s );
    },

    // standard quaternion multiplication (hamilton product)
    timesQuaternion: function( quat ) {
      // TODO: note why this is the case? product noted everywhere is the other one mentioned!
      // mathematica-style
//        return new Quaternion(
//                this.x * quat.x - this.y * quat.y - this.z * quat.z - this.w * quat.w,
//                this.x * quat.y + this.y * quat.x + this.z * quat.w - this.w * quat.z,
//                this.x * quat.z - this.y * quat.w + this.z * quat.x + this.w * quat.y,
//                this.x * quat.w + this.y * quat.z - this.z * quat.y + this.w * quat.x
//        );

      // JME-style
      return new Quaternion(
          this.x * quat.w - this.z * quat.y + this.y * quat.z + this.w * quat.x,
          -this.x * quat.z + this.y * quat.w + this.z * quat.x + this.w * quat.y,
          this.x * quat.y - this.y * quat.x + this.z * quat.w + this.w * quat.z,
          -this.x * quat.x - this.y * quat.y - this.z * quat.z + this.w * quat.w
      );

      /*
       Mathematica!
       In[13]:= Quaternion[-0.0, -0.0024999974, 0.0, 0.9999969] ** Quaternion[-0.9864071, 0.0016701065, -0.0050373166, 0.16423558]
       Out[13]= Quaternion[-0.164231, 0.00750332, 0.00208069, -0.986391]

       In[17]:= Quaternion[-0.0024999974, 0.0, 0.9999969, 0] ** Quaternion[0.0016701065, -0.0050373166, 0.16423558, -0.9864071]
       Out[17]= Quaternion[-0.164239, -0.986391, 0.00125951, 0.00750332]

       JME contains the rearrangement of what is typically called {w,x,y,z}
       */
    },

    timesVector3: function( v ) {
      if ( v.magnitude() === 0 ) {
        return new dot.Vector3();
      }

      // TODO: optimization?
      return new dot.Vector3F(
          this.w * this.w * v.x + 2 * this.y * this.w * v.z - 2 * this.z * this.w * v.y + this.x * this.x * v.x + 2 * this.y * this.x * v.y + 2 * this.z * this.x * v.z - this.z * this.z * v.x - this.y * this.y * v.x,
          2 * this.x * this.y * v.x + this.y * this.y * v.y + 2 * this.z * this.y * v.z + 2 * this.w * this.z * v.x - this.z * this.z * v.y + this.w * this.w * v.y - 2 * this.x * this.w * v.z - this.x * this.x * v.y,
          2 * this.x * this.z * v.x + 2 * this.y * this.z * v.y + this.z * this.z * v.z - 2 * this.w * this.y * v.x - this.y * this.y * v.z + 2 * this.w * this.x * v.y - this.x * this.x * v.z + this.w * this.w * v.z
      );
    },

    magnitude: function() {
      return Math.sqrt( this.magnitudeSquared() );
    },

    magnitudeSquared: function() {
      return this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w;
    },

    normalized: function() {
      var magnitude = this.magnitude();
      assert && assert( magnitude !== 0, 'Cannot normalize a zero-magnitude quaternion' );
      return this.timesScalar( 1 / magnitude );
    },

    negated: function() {
      return new Quaternion( -this.x, -this.y, -this.z, -this.w );
    },

    toRotationMatrix: function() {
      // see http://en.wikipedia.org/wiki/Rotation_matrix#Quaternion

      var norm = this.magnitudeSquared();
      var flip = ( norm === 1 ) ? 2 : ( norm > 0 ) ? 2 / norm : 0;

      var xx = this.x * this.x * flip;
      var xy = this.x * this.y * flip;
      var xz = this.x * this.z * flip;
      var xw = this.w * this.x * flip;
      var yy = this.y * this.y * flip;
      var yz = this.y * this.z * flip;
      var yw = this.w * this.y * flip;
      var zz = this.z * this.z * flip;
      var zw = this.w * this.z * flip;

      return dot.Matrix3.dirtyFromPool().columnMajor(
          1 - ( yy + zz ),
        ( xy + zw ),
        ( xz - yw ),
        ( xy - zw ),
          1 - ( xx + zz ),
        ( yz + xw ),
        ( xz + yw ),
        ( yz - xw ),
          1 - ( xx + yy )
      );
    }
  };

  Quaternion.fromEulerAngles = function( yaw, roll, pitch ) {
    var sinPitch = Math.sin( pitch * 0.5 );
    var cosPitch = Math.cos( pitch * 0.5 );
    var sinRoll = Math.sin( roll * 0.5 );
    var cosRoll = Math.cos( roll * 0.5 );
    var sinYaw = Math.sin( yaw * 0.5 );
    var cosYaw = Math.cos( yaw * 0.5 );

    var a = cosRoll * cosPitch;
    var b = sinRoll * sinPitch;
    var c = cosRoll * sinPitch;
    var d = sinRoll * cosPitch;

    return new Quaternion(
        a * sinYaw + b * cosYaw,
        d * cosYaw + c * sinYaw,
        c * cosYaw - d * sinYaw,
        a * cosYaw - b * sinYaw
    );
  };

  Quaternion.fromRotationMatrix = function( matrix ) {
    var v00 = matrix.m00();
    var v01 = matrix.m01();
    var v02 = matrix.m02();
    var v10 = matrix.m10();
    var v11 = matrix.m11();
    var v12 = matrix.m12();
    var v20 = matrix.m20();
    var v21 = matrix.m21();
    var v22 = matrix.m22();

    // from graphics gems code
    var trace = v00 + v11 + v22;
    var sqt;

    // we protect the division by s by ensuring that s>=1
    if ( trace >= 0 ) {
      sqt = Math.sqrt( trace + 1 );
      return new Quaternion(
          ( v21 - v12 ) * 0.5 / sqt,
          ( v02 - v20 ) * 0.5 / sqt,
          ( v10 - v01 ) * 0.5 / sqt,
          0.5 * sqt
      );
    }
    else if ( ( v00 > v11 ) && ( v00 > v22 ) ) {
      sqt = Math.sqrt( 1 + v00 - v11 - v22 );
      return new Quaternion(
          sqt * 0.5,
          ( v10 + v01 ) * 0.5 / sqt,
          ( v02 + v20 ) * 0.5 / sqt,
          ( v21 - v12 ) * 0.5 / sqt
      );
    }
    else if ( v11 > v22 ) {
      sqt = Math.sqrt( 1 + v11 - v00 - v22 );
      return new Quaternion(
          ( v10 + v01 ) * 0.5 / sqt,
          sqt * 0.5,
          ( v21 + v12 ) * 0.5 / sqt,
          ( v02 - v20 ) * 0.5 / sqt
      );
    }
    else {
      sqt = Math.sqrt( 1 + v22 - v00 - v11 );
      return new Quaternion(
          ( v02 + v20 ) * 0.5 / sqt,
          ( v21 + v12 ) * 0.5 / sqt,
          sqt * 0.5,
          ( v10 - v01 ) * 0.5 / sqt
      );
    }
  };

  /**
   * Find a quaternion that transforms a unit vector A into a unit vector B. There
   * are technically multiple solutions, so this only picks one.
   *
   * @param a Unit vector A
   * @param b Unit vector B
   * @return A quaternion s.t. Q * A = B
   */
  Quaternion.getRotationQuaternion = function( a, b ) {
    return Quaternion.fromRotationMatrix( dot.Matrix3.rotateAToB( a, b ) );
  };

  // spherical linear interpolation - blending two quaternions
  Quaternion.slerp = function( a, b, t ) {
    // if they are identical, just return one of them
    if ( a.x === b.x && a.y === b.y && a.z === b.z && a.w === b.w ) {
      return a;
    }

    var dot = a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;

    if ( dot < 0 ) {
      b = b.negated();
      dot = -dot;
    }

    // how much of each quaternion should be contributed
    var ratioA = 1 - t;
    var ratioB = t;

    // tweak them if necessary
    if ( ( 1 - dot ) > 0.1 ) {
      var theta = Math.acos( dot );
      var invSinTheta = ( 1 / Math.sin( theta ) );

      ratioA = ( Math.sin( ( 1 - t ) * theta ) * invSinTheta );
      ratioB = ( Math.sin( ( t * theta ) ) * invSinTheta );
    }

    return new Quaternion(
        ratioA * a.x + ratioB * b.x,
        ratioA * a.y + ratioB * b.y,
        ratioA * a.z + ratioB * b.z,
        ratioA * a.w + ratioB * b.w
    );
  };

  // experimental object pooling
  /* jshint -W064 */
  Poolable( Quaternion, {
    defaultFactory: function() { return new Quaternion(); },
    constructorDuplicateFactory: function( pool ) {
      return function( x, y, z, w ) {
        if ( pool.length ) {
          return pool.pop().set( x, y, z, w );
        }
        else {
          return new Quaternion( x, y, z, w );
        }
      };
    }
  } );

  return Quaternion;
} );
