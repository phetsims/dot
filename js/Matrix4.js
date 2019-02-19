// Copyright 2013-2015, University of Colorado Boulder

/**
 * 4-dimensional Matrix
 *
 * TODO: consider adding affine flag if it will help performance (a la Matrix3)
 * TODO: get rotation angles
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );

  require( 'DOT/Vector3' );
  require( 'DOT/Vector4' );

  var Float32Array = window.Float32Array || Array;

  function Matrix4( v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, type ) {

    // entries stored in column-major format
    this.entries = new Float32Array( 16 );

    this.rowMajor(
      v00 !== undefined ? v00 : 1, v01 !== undefined ? v01 : 0, v02 !== undefined ? v02 : 0, v03 !== undefined ? v03 : 0,
      v10 !== undefined ? v10 : 0, v11 !== undefined ? v11 : 1, v12 !== undefined ? v12 : 0, v13 !== undefined ? v13 : 0,
      v20 !== undefined ? v20 : 0, v21 !== undefined ? v21 : 0, v22 !== undefined ? v22 : 1, v23 !== undefined ? v23 : 0,
      v30 !== undefined ? v30 : 0, v31 !== undefined ? v31 : 0, v32 !== undefined ? v32 : 0, v33 !== undefined ? v33 : 1,
      type );
  }

  dot.register( 'Matrix4', Matrix4 );

  Matrix4.Types = {
    OTHER: 0, // default
    IDENTITY: 1,
    TRANSLATION_3D: 2,
    SCALING: 3,
    AFFINE: 4

    // TODO: possibly add rotations
  };

  var Types = Matrix4.Types;

  Matrix4.identity = function() {
    return new Matrix4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
      Types.IDENTITY );
  };

  Matrix4.translation = function( x, y, z ) {
    return new Matrix4(
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1,
      Types.TRANSLATION_3D );
  };

  Matrix4.translationFromVector = function( v ) { return Matrix4.translation( v.x, v.y, v.z ); };

  Matrix4.scaling = function( x, y, z ) {
    // allow using one parameter to scale everything
    y = y === undefined ? x : y;
    z = z === undefined ? x : z;

    return new Matrix4(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
      Types.SCALING );
  };

  // axis is a normalized Vector3, angle in radians.
  Matrix4.rotationAxisAngle = function( axis, angle ) {
    var c = Math.cos( angle );
    var s = Math.sin( angle );
    var C = 1 - c;

    return new Matrix4(
      axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s, 0,
      axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s, 0,
      axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c, 0,
      0, 0, 0, 1,
      Types.AFFINE );
  };

  // TODO: add in rotation from quaternion, and from quat + translation

  Matrix4.rotationX = function( angle ) {
    var c = Math.cos( angle );
    var s = Math.sin( angle );

    return new Matrix4(
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1,
      Types.AFFINE );
  };

  Matrix4.rotationY = function( angle ) {
    var c = Math.cos( angle );
    var s = Math.sin( angle );

    return new Matrix4(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1,
      Types.AFFINE );
  };

  Matrix4.rotationZ = function( angle ) {
    var c = Math.cos( angle );
    var s = Math.sin( angle );

    return new Matrix4(
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
      Types.AFFINE );
  };

  // aspect === width / height
  Matrix4.gluPerspective = function( fovYRadians, aspect, zNear, zFar ) {
    var cotangent = Math.cos( fovYRadians ) / Math.sin( fovYRadians );

    return new Matrix4(
      cotangent / aspect, 0, 0, 0,
      0, cotangent, 0, 0,
      0, 0, ( zFar + zNear ) / ( zNear - zFar ), ( 2 * zFar * zNear ) / ( zNear - zFar ),
      0, 0, -1, 0 );
  };

  Matrix4.prototype = {
    constructor: Matrix4,

    rowMajor: function( v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, type ) {
      this.entries[ 0 ] = v00;
      this.entries[ 1 ] = v10;
      this.entries[ 2 ] = v20;
      this.entries[ 3 ] = v30;
      this.entries[ 4 ] = v01;
      this.entries[ 5 ] = v11;
      this.entries[ 6 ] = v21;
      this.entries[ 7 ] = v31;
      this.entries[ 8 ] = v02;
      this.entries[ 9 ] = v12;
      this.entries[ 10 ] = v22;
      this.entries[ 11 ] = v32;
      this.entries[ 12 ] = v03;
      this.entries[ 13 ] = v13;
      this.entries[ 14 ] = v23;
      this.entries[ 15 ] = v33;

      // TODO: consider performance of the affine check here
      this.type = type === undefined ? ( ( v30 === 0 && v31 === 0 && v32 === 0 && v33 === 1 ) ? Types.AFFINE : Types.OTHER ) : type;
      return this;
    },

    columnMajor: function( v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23, v33, type ) {
      return this.rowMajor( v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, type );
    },

    set: function( matrix ) {
      return this.rowMajor(
        matrix.m00(), matrix.m01(), matrix.m02(), matrix.m03(),
        matrix.m10(), matrix.m11(), matrix.m12(), matrix.m13(),
        matrix.m20(), matrix.m21(), matrix.m22(), matrix.m23(),
        matrix.m30(), matrix.m31(), matrix.m32(), matrix.m33(),
        matrix.type );
    },

    // convenience getters. inline usages of these when performance is critical? TODO: test performance of inlining these, with / without closure compiler
    m00: function() { return this.entries[ 0 ]; },
    m01: function() { return this.entries[ 4 ]; },
    m02: function() { return this.entries[ 8 ]; },
    m03: function() { return this.entries[ 12 ]; },
    m10: function() { return this.entries[ 1 ]; },
    m11: function() { return this.entries[ 5 ]; },
    m12: function() { return this.entries[ 9 ]; },
    m13: function() { return this.entries[ 13 ]; },
    m20: function() { return this.entries[ 2 ]; },
    m21: function() { return this.entries[ 6 ]; },
    m22: function() { return this.entries[ 10 ]; },
    m23: function() { return this.entries[ 14 ]; },
    m30: function() { return this.entries[ 3 ]; },
    m31: function() { return this.entries[ 7 ]; },
    m32: function() { return this.entries[ 11 ]; },
    m33: function() { return this.entries[ 15 ]; },

    isFinite: function() {
      return isFinite( this.m00() ) &&
             isFinite( this.m01() ) &&
             isFinite( this.m02() ) &&
             isFinite( this.m03() ) &&
             isFinite( this.m10() ) &&
             isFinite( this.m11() ) &&
             isFinite( this.m12() ) &&
             isFinite( this.m13() ) &&
             isFinite( this.m20() ) &&
             isFinite( this.m21() ) &&
             isFinite( this.m22() ) &&
             isFinite( this.m23() ) &&
             isFinite( this.m30() ) &&
             isFinite( this.m31() ) &&
             isFinite( this.m32() ) &&
             isFinite( this.m33() );
    },

    // the 3D translation, assuming multiplication with a homogeneous vector
    getTranslation: function() {
      return new dot.Vector3( this.m03(), this.m13(), this.m23() );
    },
    get translation() { return this.getTranslation(); },

    // returns a vector that is equivalent to ( T(1,0,0).magnitude, T(0,1,0).magnitude, T(0,0,1).magnitude )
    // where T is a relative transform
    getScaleVector: function() {
      var m0003 = this.m00() + this.m03();
      var m1013 = this.m10() + this.m13();
      var m2023 = this.m20() + this.m23();
      var m3033 = this.m30() + this.m33();
      var m0103 = this.m01() + this.m03();
      var m1113 = this.m11() + this.m13();
      var m2123 = this.m21() + this.m23();
      var m3133 = this.m31() + this.m33();
      var m0203 = this.m02() + this.m03();
      var m1213 = this.m12() + this.m13();
      var m2223 = this.m22() + this.m23();
      var m3233 = this.m32() + this.m33();
      return new dot.Vector3(
        Math.sqrt( m0003 * m0003 + m1013 * m1013 + m2023 * m2023 + m3033 * m3033 ),
        Math.sqrt( m0103 * m0103 + m1113 * m1113 + m2123 * m2123 + m3133 * m3133 ),
        Math.sqrt( m0203 * m0203 + m1213 * m1213 + m2223 * m2223 + m3233 * m3233 ) );
    },
    get scaleVector() { return this.getScaleVector(); },

    getCSSTransform: function() {
      // See http://www.w3.org/TR/css3-transforms/, particularly Section 13 that discusses the SVG compatibility

      // We need to prevent the numbers from being in an exponential toString form, since the CSS transform does not support that
      // 20 is the largest guaranteed number of digits according to https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toFixed
      // See https://github.com/phetsims/dot/issues/36

      // the inner part of a CSS3 transform, but remember to add the browser-specific parts!
      // NOTE: the toFixed calls are inlined for performance reasons
      return 'matrix3d(' +
             this.entries[ 0 ].toFixed( 20 ) + ',' +
             this.entries[ 1 ].toFixed( 20 ) + ',' +
             this.entries[ 2 ].toFixed( 20 ) + ',' +
             this.entries[ 3 ].toFixed( 20 ) + ',' +
             this.entries[ 4 ].toFixed( 20 ) + ',' +
             this.entries[ 5 ].toFixed( 20 ) + ',' +
             this.entries[ 6 ].toFixed( 20 ) + ',' +
             this.entries[ 7 ].toFixed( 20 ) + ',' +
             this.entries[ 8 ].toFixed( 20 ) + ',' +
             this.entries[ 9 ].toFixed( 20 ) + ',' +
             this.entries[ 10 ].toFixed( 20 ) + ',' +
             this.entries[ 11 ].toFixed( 20 ) + ',' +
             this.entries[ 12 ].toFixed( 20 ) + ',' +
             this.entries[ 13 ].toFixed( 20 ) + ',' +
             this.entries[ 14 ].toFixed( 20 ) + ',' +
             this.entries[ 15 ].toFixed( 20 ) + ')';
    },
    get cssTransform() { return this.getCSSTransform(); },

    // exact equality
    equals: function( m ) {
      return this.m00() === m.m00() && this.m01() === m.m01() && this.m02() === m.m02() && this.m03() === m.m03() &&
             this.m10() === m.m10() && this.m11() === m.m11() && this.m12() === m.m12() && this.m13() === m.m13() &&
             this.m20() === m.m20() && this.m21() === m.m21() && this.m22() === m.m22() && this.m23() === m.m23() &&
             this.m30() === m.m30() && this.m31() === m.m31() && this.m32() === m.m32() && this.m33() === m.m33();
    },

    // equality within a margin of error
    equalsEpsilon: function( m, epsilon ) {
      return Math.abs( this.m00() - m.m00() ) < epsilon &&
             Math.abs( this.m01() - m.m01() ) < epsilon &&
             Math.abs( this.m02() - m.m02() ) < epsilon &&
             Math.abs( this.m03() - m.m03() ) < epsilon &&
             Math.abs( this.m10() - m.m10() ) < epsilon &&
             Math.abs( this.m11() - m.m11() ) < epsilon &&
             Math.abs( this.m12() - m.m12() ) < epsilon &&
             Math.abs( this.m13() - m.m13() ) < epsilon &&
             Math.abs( this.m20() - m.m20() ) < epsilon &&
             Math.abs( this.m21() - m.m21() ) < epsilon &&
             Math.abs( this.m22() - m.m22() ) < epsilon &&
             Math.abs( this.m23() - m.m23() ) < epsilon &&
             Math.abs( this.m30() - m.m30() ) < epsilon &&
             Math.abs( this.m31() - m.m31() ) < epsilon &&
             Math.abs( this.m32() - m.m32() ) < epsilon &&
             Math.abs( this.m33() - m.m33() ) < epsilon;
    },

    /*---------------------------------------------------------------------------*
     * Immutable operations (returning a new matrix)
     *----------------------------------------------------------------------------*/

    copy: function() {
      return new Matrix4(
        this.m00(), this.m01(), this.m02(), this.m03(),
        this.m10(), this.m11(), this.m12(), this.m13(),
        this.m20(), this.m21(), this.m22(), this.m23(),
        this.m30(), this.m31(), this.m32(), this.m33(),
        this.type
      );
    },

    plus: function( m ) {
      return new Matrix4(
        this.m00() + m.m00(), this.m01() + m.m01(), this.m02() + m.m02(), this.m03() + m.m03(),
        this.m10() + m.m10(), this.m11() + m.m11(), this.m12() + m.m12(), this.m13() + m.m13(),
        this.m20() + m.m20(), this.m21() + m.m21(), this.m22() + m.m22(), this.m23() + m.m23(),
        this.m30() + m.m30(), this.m31() + m.m31(), this.m32() + m.m32(), this.m33() + m.m33()
      );
    },

    minus: function( m ) {
      return new Matrix4(
        this.m00() - m.m00(), this.m01() - m.m01(), this.m02() - m.m02(), this.m03() - m.m03(),
        this.m10() - m.m10(), this.m11() - m.m11(), this.m12() - m.m12(), this.m13() - m.m13(),
        this.m20() - m.m20(), this.m21() - m.m21(), this.m22() - m.m22(), this.m23() - m.m23(),
        this.m30() - m.m30(), this.m31() - m.m31(), this.m32() - m.m32(), this.m33() - m.m33()
      );
    },

    transposed: function() {
      return new Matrix4(
        this.m00(), this.m10(), this.m20(), this.m30(),
        this.m01(), this.m11(), this.m21(), this.m31(),
        this.m02(), this.m12(), this.m22(), this.m32(),
        this.m03(), this.m13(), this.m23(), this.m33() );
    },

    negated: function() {
      return new Matrix4(
        -this.m00(), -this.m01(), -this.m02(), -this.m03(),
        -this.m10(), -this.m11(), -this.m12(), -this.m13(),
        -this.m20(), -this.m21(), -this.m22(), -this.m23(),
        -this.m30(), -this.m31(), -this.m32(), -this.m33() );
    },

    inverted: function() {
      switch( this.type ) {
        case Types.IDENTITY:
          return this;
        case Types.TRANSLATION_3D:
          return new Matrix4(
            1, 0, 0, -this.m03(),
            0, 1, 0, -this.m13(),
            0, 0, 1, -this.m23(),
            0, 0, 0, 1, Types.TRANSLATION_3D );
        case Types.SCALING:
          return new Matrix4(
            1 / this.m00(), 0, 0, 0,
            0, 1 / this.m11(), 0, 0,
            0, 0, 1 / this.m22(), 0,
            0, 0, 0, 1 / this.m33(), Types.SCALING );
        case Types.AFFINE:
        case Types.OTHER:
          var det = this.getDeterminant();
          if ( det !== 0 ) {
            return new Matrix4(
              ( -this.m31() * this.m22() * this.m13() + this.m21() * this.m32() * this.m13() + this.m31() * this.m12() * this.m23() - this.m11() * this.m32() * this.m23() - this.m21() * this.m12() * this.m33() + this.m11() * this.m22() * this.m33() ) / det,
              ( this.m31() * this.m22() * this.m03() - this.m21() * this.m32() * this.m03() - this.m31() * this.m02() * this.m23() + this.m01() * this.m32() * this.m23() + this.m21() * this.m02() * this.m33() - this.m01() * this.m22() * this.m33() ) / det,
              ( -this.m31() * this.m12() * this.m03() + this.m11() * this.m32() * this.m03() + this.m31() * this.m02() * this.m13() - this.m01() * this.m32() * this.m13() - this.m11() * this.m02() * this.m33() + this.m01() * this.m12() * this.m33() ) / det,
              ( this.m21() * this.m12() * this.m03() - this.m11() * this.m22() * this.m03() - this.m21() * this.m02() * this.m13() + this.m01() * this.m22() * this.m13() + this.m11() * this.m02() * this.m23() - this.m01() * this.m12() * this.m23() ) / det,
              ( this.m30() * this.m22() * this.m13() - this.m20() * this.m32() * this.m13() - this.m30() * this.m12() * this.m23() + this.m10() * this.m32() * this.m23() + this.m20() * this.m12() * this.m33() - this.m10() * this.m22() * this.m33() ) / det,
              ( -this.m30() * this.m22() * this.m03() + this.m20() * this.m32() * this.m03() + this.m30() * this.m02() * this.m23() - this.m00() * this.m32() * this.m23() - this.m20() * this.m02() * this.m33() + this.m00() * this.m22() * this.m33() ) / det,
              ( this.m30() * this.m12() * this.m03() - this.m10() * this.m32() * this.m03() - this.m30() * this.m02() * this.m13() + this.m00() * this.m32() * this.m13() + this.m10() * this.m02() * this.m33() - this.m00() * this.m12() * this.m33() ) / det,
              ( -this.m20() * this.m12() * this.m03() + this.m10() * this.m22() * this.m03() + this.m20() * this.m02() * this.m13() - this.m00() * this.m22() * this.m13() - this.m10() * this.m02() * this.m23() + this.m00() * this.m12() * this.m23() ) / det,
              ( -this.m30() * this.m21() * this.m13() + this.m20() * this.m31() * this.m13() + this.m30() * this.m11() * this.m23() - this.m10() * this.m31() * this.m23() - this.m20() * this.m11() * this.m33() + this.m10() * this.m21() * this.m33() ) / det,
              ( this.m30() * this.m21() * this.m03() - this.m20() * this.m31() * this.m03() - this.m30() * this.m01() * this.m23() + this.m00() * this.m31() * this.m23() + this.m20() * this.m01() * this.m33() - this.m00() * this.m21() * this.m33() ) / det,
              ( -this.m30() * this.m11() * this.m03() + this.m10() * this.m31() * this.m03() + this.m30() * this.m01() * this.m13() - this.m00() * this.m31() * this.m13() - this.m10() * this.m01() * this.m33() + this.m00() * this.m11() * this.m33() ) / det,
              ( this.m20() * this.m11() * this.m03() - this.m10() * this.m21() * this.m03() - this.m20() * this.m01() * this.m13() + this.m00() * this.m21() * this.m13() + this.m10() * this.m01() * this.m23() - this.m00() * this.m11() * this.m23() ) / det,
              ( this.m30() * this.m21() * this.m12() - this.m20() * this.m31() * this.m12() - this.m30() * this.m11() * this.m22() + this.m10() * this.m31() * this.m22() + this.m20() * this.m11() * this.m32() - this.m10() * this.m21() * this.m32() ) / det,
              ( -this.m30() * this.m21() * this.m02() + this.m20() * this.m31() * this.m02() + this.m30() * this.m01() * this.m22() - this.m00() * this.m31() * this.m22() - this.m20() * this.m01() * this.m32() + this.m00() * this.m21() * this.m32() ) / det,
              ( this.m30() * this.m11() * this.m02() - this.m10() * this.m31() * this.m02() - this.m30() * this.m01() * this.m12() + this.m00() * this.m31() * this.m12() + this.m10() * this.m01() * this.m32() - this.m00() * this.m11() * this.m32() ) / det,
              ( -this.m20() * this.m11() * this.m02() + this.m10() * this.m21() * this.m02() + this.m20() * this.m01() * this.m12() - this.m00() * this.m21() * this.m12() - this.m10() * this.m01() * this.m22() + this.m00() * this.m11() * this.m22() ) / det
            );
          }
          else {
            throw new Error( 'Matrix could not be inverted, determinant === 0' );
          }
        default:
          throw new Error( 'Matrix3.inverted with unknown type: ' + this.type );
      }
    },

    timesMatrix: function( m ) {
      // I * M === M * I === I (the identity)
      if ( this.type === Types.IDENTITY || m.type === Types.IDENTITY ) {
        return this.type === Types.IDENTITY ? m : this;
      }

      if ( this.type === m.type ) {
        // currently two matrices of the same type will result in the same result type
        if ( this.type === Types.TRANSLATION_3D ) {
          // faster combination of translations
          return new Matrix4(
            1, 0, 0, this.m03() + m.m02(),
            0, 1, 0, this.m13() + m.m12(),
            0, 0, 1, this.m23() + m.m23(),
            0, 0, 0, 1, Types.TRANSLATION_3D );
        }
        else if ( this.type === Types.SCALING ) {
          // faster combination of scaling
          return new Matrix4(
            this.m00() * m.m00(), 0, 0, 0,
            0, this.m11() * m.m11(), 0, 0,
            0, 0, this.m22() * m.m22(), 0,
            0, 0, 0, 1, Types.SCALING );
        }
      }

      if ( this.type !== Types.OTHER && m.type !== Types.OTHER ) {
        // currently two matrices that are anything but "other" are technically affine, and the result will be affine

        // affine case
        return new Matrix4(
          this.m00() * m.m00() + this.m01() * m.m10() + this.m02() * m.m20(),
          this.m00() * m.m01() + this.m01() * m.m11() + this.m02() * m.m21(),
          this.m00() * m.m02() + this.m01() * m.m12() + this.m02() * m.m22(),
          this.m00() * m.m03() + this.m01() * m.m13() + this.m02() * m.m23() + this.m03(),
          this.m10() * m.m00() + this.m11() * m.m10() + this.m12() * m.m20(),
          this.m10() * m.m01() + this.m11() * m.m11() + this.m12() * m.m21(),
          this.m10() * m.m02() + this.m11() * m.m12() + this.m12() * m.m22(),
          this.m10() * m.m03() + this.m11() * m.m13() + this.m12() * m.m23() + this.m13(),
          this.m20() * m.m00() + this.m21() * m.m10() + this.m22() * m.m20(),
          this.m20() * m.m01() + this.m21() * m.m11() + this.m22() * m.m21(),
          this.m20() * m.m02() + this.m21() * m.m12() + this.m22() * m.m22(),
          this.m20() * m.m03() + this.m21() * m.m13() + this.m22() * m.m23() + this.m23(),
          0, 0, 0, 1, Types.AFFINE );
      }

      // general case
      return new Matrix4(
        this.m00() * m.m00() + this.m01() * m.m10() + this.m02() * m.m20() + this.m03() * m.m30(),
        this.m00() * m.m01() + this.m01() * m.m11() + this.m02() * m.m21() + this.m03() * m.m31(),
        this.m00() * m.m02() + this.m01() * m.m12() + this.m02() * m.m22() + this.m03() * m.m32(),
        this.m00() * m.m03() + this.m01() * m.m13() + this.m02() * m.m23() + this.m03() * m.m33(),
        this.m10() * m.m00() + this.m11() * m.m10() + this.m12() * m.m20() + this.m13() * m.m30(),
        this.m10() * m.m01() + this.m11() * m.m11() + this.m12() * m.m21() + this.m13() * m.m31(),
        this.m10() * m.m02() + this.m11() * m.m12() + this.m12() * m.m22() + this.m13() * m.m32(),
        this.m10() * m.m03() + this.m11() * m.m13() + this.m12() * m.m23() + this.m13() * m.m33(),
        this.m20() * m.m00() + this.m21() * m.m10() + this.m22() * m.m20() + this.m23() * m.m30(),
        this.m20() * m.m01() + this.m21() * m.m11() + this.m22() * m.m21() + this.m23() * m.m31(),
        this.m20() * m.m02() + this.m21() * m.m12() + this.m22() * m.m22() + this.m23() * m.m32(),
        this.m20() * m.m03() + this.m21() * m.m13() + this.m22() * m.m23() + this.m23() * m.m33(),
        this.m30() * m.m00() + this.m31() * m.m10() + this.m32() * m.m20() + this.m33() * m.m30(),
        this.m30() * m.m01() + this.m31() * m.m11() + this.m32() * m.m21() + this.m33() * m.m31(),
        this.m30() * m.m02() + this.m31() * m.m12() + this.m32() * m.m22() + this.m33() * m.m32(),
        this.m30() * m.m03() + this.m31() * m.m13() + this.m32() * m.m23() + this.m33() * m.m33() );
    },

    timesVector4: function( v ) {
      var x = this.m00() * v.x + this.m01() * v.y + this.m02() * v.z + this.m03() * v.w;
      var y = this.m10() * v.x + this.m11() * v.y + this.m12() * v.z + this.m13() * v.w;
      var z = this.m20() * v.x + this.m21() * v.y + this.m22() * v.z + this.m23() * v.w;
      var w = this.m30() * v.x + this.m31() * v.y + this.m32() * v.z + this.m33() * v.w;
      return new dot.Vector4( x, y, z, w );
    },

    timesVector3: function( v ) {
      return this.timesVector4( v.toVector4() ).toVector3();
    },

    timesTransposeVector4: function( v ) {
      var x = this.m00() * v.x + this.m10() * v.y + this.m20() * v.z + this.m30() * v.w;
      var y = this.m01() * v.x + this.m11() * v.y + this.m21() * v.z + this.m31() * v.w;
      var z = this.m02() * v.x + this.m12() * v.y + this.m22() * v.z + this.m32() * v.w;
      var w = this.m03() * v.x + this.m13() * v.y + this.m23() * v.z + this.m33() * v.w;
      return new dot.Vector4( x, y, z, w );
    },

    timesTransposeVector3: function( v ) {
      return this.timesTransposeVector4( v.toVector4() ).toVector3();
    },

    timesRelativeVector3: function( v ) {
      var x = this.m00() * v.x + this.m10() * v.y + this.m20() * v.z;
      var y = this.m01() * v.y + this.m11() * v.y + this.m21() * v.z;
      var z = this.m02() * v.z + this.m12() * v.y + this.m22() * v.z;
      return new dot.Vector3( x, y, z );
    },

    getDeterminant: function() {
      return this.m03() * this.m12() * this.m21() * this.m30() -
             this.m02() * this.m13() * this.m21() * this.m30() -
             this.m03() * this.m11() * this.m22() * this.m30() +
             this.m01() * this.m13() * this.m22() * this.m30() +
             this.m02() * this.m11() * this.m23() * this.m30() -
             this.m01() * this.m12() * this.m23() * this.m30() -
             this.m03() * this.m12() * this.m20() * this.m31() +
             this.m02() * this.m13() * this.m20() * this.m31() +
             this.m03() * this.m10() * this.m22() * this.m31() -
             this.m00() * this.m13() * this.m22() * this.m31() -
             this.m02() * this.m10() * this.m23() * this.m31() +
             this.m00() * this.m12() * this.m23() * this.m31() +
             this.m03() * this.m11() * this.m20() * this.m32() -
             this.m01() * this.m13() * this.m20() * this.m32() -
             this.m03() * this.m10() * this.m21() * this.m32() +
             this.m00() * this.m13() * this.m21() * this.m32() +
             this.m01() * this.m10() * this.m23() * this.m32() -
             this.m00() * this.m11() * this.m23() * this.m32() -
             this.m02() * this.m11() * this.m20() * this.m33() +
             this.m01() * this.m12() * this.m20() * this.m33() +
             this.m02() * this.m10() * this.m21() * this.m33() -
             this.m00() * this.m12() * this.m21() * this.m33() -
             this.m01() * this.m10() * this.m22() * this.m33() +
             this.m00() * this.m11() * this.m22() * this.m33();
    },
    get determinant() { return this.getDeterminant(); },

    toString: function() {
      return this.m00() + ' ' + this.m01() + ' ' + this.m02() + ' ' + this.m03() + '\n' +
             this.m10() + ' ' + this.m11() + ' ' + this.m12() + ' ' + this.m13() + '\n' +
             this.m20() + ' ' + this.m21() + ' ' + this.m22() + ' ' + this.m23() + '\n' +
             this.m30() + ' ' + this.m31() + ' ' + this.m32() + ' ' + this.m33();
    },

    makeImmutable: function() {
      this.rowMajor = function() {
        throw new Error( 'Cannot modify immutable matrix' );
      };
    }
  };

  // create an immutable
  Matrix4.IDENTITY = new Matrix4();
  Matrix4.IDENTITY.makeImmutable();

  return Matrix4;
} );
