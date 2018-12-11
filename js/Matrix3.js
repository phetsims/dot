// Copyright 2013-2015, University of Colorado Boulder

/**
 * 3-dimensional Matrix
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var Poolable = require( 'PHET_CORE/Poolable' );

  require( 'DOT/Vector2' );
  require( 'DOT/Vector3' );
  require( 'DOT/Matrix4' );

  // Create an identity matrix
  function Matrix3( argumentsShouldNotExist ) {

    //Make sure no clients are expecting to create a matrix with non-identity values
    assert && assert( !argumentsShouldNotExist, 'Matrix3 constructor should not be called with any arguments.  Use Matrix3.createFromPool()/Matrix3.identity()/etc.' );

    // entries stored in column-major format
    this.entries = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];

    this.type = Types.IDENTITY;
  }

  dot.register( 'Matrix3', Matrix3 );

  Matrix3.Types = {
    // NOTE: if an inverted matrix of a type is not that type, change inverted()!
    // NOTE: if two matrices with identical types are multiplied, the result should have the same type. if not, changed timesMatrix()!
    // NOTE: on adding a type, exhaustively check all type usage
    OTHER: 0, // default
    IDENTITY: 1,
    TRANSLATION_2D: 2,
    SCALING: 3,
    AFFINE: 4

    // TODO: possibly add rotations
  };

  var Types = Matrix3.Types;

  Matrix3.identity = function() { return Matrix3.dirtyFromPool().setToIdentity(); };
  Matrix3.translation = function( x, y ) { return Matrix3.dirtyFromPool().setToTranslation( x, y ); };
  Matrix3.translationFromVector = function( v ) { return Matrix3.translation( v.x, v.y ); };
  Matrix3.scaling = function( x, y ) { return Matrix3.dirtyFromPool().setToScale( x, y ); };
  Matrix3.scale = Matrix3.scaling;
  Matrix3.affine = function( m00, m01, m02, m10, m11, m12 ) { return Matrix3.dirtyFromPool().setToAffine( m00, m01, m02, m10, m11, m12 ); };
  Matrix3.rowMajor = function( v00, v01, v02, v10, v11, v12, v20, v21, v22, type ) { return Matrix3.dirtyFromPool().rowMajor( v00, v01, v02, v10, v11, v12, v20, v21, v22, type ); };

  // axis is a normalized Vector3, angle in radians.
  Matrix3.rotationAxisAngle = function( axis, angle ) { return Matrix3.dirtyFromPool().setToRotationAxisAngle( axis, angle ); };

  Matrix3.rotationX = function( angle ) { return Matrix3.dirtyFromPool().setToRotationX( angle ); };
  Matrix3.rotationY = function( angle ) { return Matrix3.dirtyFromPool().setToRotationY( angle ); };
  Matrix3.rotationZ = function( angle ) { return Matrix3.dirtyFromPool().setToRotationZ( angle ); };

  Matrix3.translationRotation = function( x, y, angle ) { return Matrix3.dirtyFromPool().setToTranslationRotation( x, y, angle ); };

  // standard 2d rotation
  Matrix3.rotation2 = Matrix3.rotationZ;

  Matrix3.rotationAround = function( angle, x, y ) {
    return Matrix3.translation( x, y ).timesMatrix( Matrix3.rotation2( angle ) ).timesMatrix( Matrix3.translation( -x, -y ) );
  };

  Matrix3.rotationAroundPoint = function( angle, point ) {
    return Matrix3.rotationAround( angle, point.x, point.y );
  };

  Matrix3.fromSVGMatrix = function( svgMatrix ) { return Matrix3.dirtyFromPool().setToSVGMatrix( svgMatrix ); };

  // a rotation matrix that rotates A to B, by rotating about the axis A.cross( B ) -- Shortest path. ideally should be unit vectors
  Matrix3.rotateAToB = function( a, b ) { return Matrix3.dirtyFromPool().setRotationAToB( a, b ); };

  Matrix3.prototype = {
    constructor: Matrix3,

    /*---------------------------------------------------------------------------*
     * "Properties"
     *----------------------------------------------------------------------------*/

    // convenience getters. inline usages of these when performance is critical? TODO: test performance of inlining these, with / without closure compiler
    m00: function() { return this.entries[ 0 ]; },
    m01: function() { return this.entries[ 3 ]; },
    m02: function() { return this.entries[ 6 ]; },
    m10: function() { return this.entries[ 1 ]; },
    m11: function() { return this.entries[ 4 ]; },
    m12: function() { return this.entries[ 7 ]; },
    m20: function() { return this.entries[ 2 ]; },
    m21: function() { return this.entries[ 5 ]; },
    m22: function() { return this.entries[ 8 ]; },

    isIdentity: function() {
      return this.type === Types.IDENTITY || this.equals( Matrix3.IDENTITY );
    },

    // returning false means "inconclusive, may be identity or not"
    isFastIdentity: function() {
      return this.type === Types.IDENTITY;
    },

    isAffine: function() {
      return this.type === Types.AFFINE || ( this.m20() === 0 && this.m21() === 0 && this.m22() === 1 );
    },

    // if it's an affine matrix where the components of transforms are independent
    // i.e. constructed from arbitrary component scaling and translation.
    isAligned: function() {
      // non-diagonal non-translation entries should all be zero.
      return this.isAffine() && this.m01() === 0 && this.m10() === 0;
    },

    // if it's an affine matrix where the components of transforms are independent, but may be switched (unlike isAligned)
    // i.e. the 2x2 rotational sub-matrix is of one of the two forms:
    // A 0  or  0  A
    // 0 B      B  0
    // This means that moving a transformed point by (x,0) or (0,y) will result in a motion along one of the axes.
    isAxisAligned: function() {
      return this.isAffine() && ( ( this.m01() === 0 && this.m10() === 0 ) || ( this.m00() === 0 && this.m11() === 0 ) );
    },

    isFinite: function() {
      return isFinite( this.m00() ) &&
             isFinite( this.m01() ) &&
             isFinite( this.m02() ) &&
             isFinite( this.m10() ) &&
             isFinite( this.m11() ) &&
             isFinite( this.m12() ) &&
             isFinite( this.m20() ) &&
             isFinite( this.m21() ) &&
             isFinite( this.m22() );
    },

    getDeterminant: function() {
      return this.m00() * this.m11() * this.m22() + this.m01() * this.m12() * this.m20() + this.m02() * this.m10() * this.m21() - this.m02() * this.m11() * this.m20() - this.m01() * this.m10() * this.m22() - this.m00() * this.m12() * this.m21();
    },
    get determinant() { return this.getDeterminant(); },

    // the 2D translation, assuming multiplication with a homogeneous vector
    getTranslation: function() {
      return new dot.Vector2( this.m02(), this.m12() );
    },
    get translation() { return this.getTranslation(); },

    // returns a vector that is equivalent to ( T(1,0).magnitude(), T(0,1).magnitude() ) where T is a relative transform
    getScaleVector: function() {
      return new dot.Vector2(
        Math.sqrt( this.m00() * this.m00() + this.m10() * this.m10() ),
        Math.sqrt( this.m01() * this.m01() + this.m11() * this.m11() ) );
    },
    get scaleVector() { return this.getScaleVector(); },

    // angle in radians for the 2d rotation from this matrix, between pi, -pi
    getRotation: function() {
      return Math.atan2( this.m10(), this.m00() );
    },
    get rotation() { return this.getRotation(); },

    toMatrix4: function() {
      return new dot.Matrix4(
        this.m00(), this.m01(), this.m02(), 0,
        this.m10(), this.m11(), this.m12(), 0,
        this.m20(), this.m21(), this.m22(), 0,
        0, 0, 0, 1 );
    },

    toAffineMatrix4: function() {
      return new dot.Matrix4(
        this.m00(), this.m01(), 0, this.m02(),
        this.m10(), this.m11(), 0, this.m12(),
        0, 0, 1, 0,
        0, 0, 0, 1 );
    },

    toString: function() {
      return this.m00() + ' ' + this.m01() + ' ' + this.m02() + '\n' +
             this.m10() + ' ' + this.m11() + ' ' + this.m12() + '\n' +
             this.m20() + ' ' + this.m21() + ' ' + this.m22();
    },

    toSVGMatrix: function() {
      var result = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGMatrix();

      // top two rows
      result.a = this.m00();
      result.b = this.m10();
      result.c = this.m01();
      result.d = this.m11();
      result.e = this.m02();
      result.f = this.m12();

      return result;
    },

    getCSSTransform: function() {
      // See http://www.w3.org/TR/css3-transforms/, particularly Section 13 that discusses the SVG compatibility

      // We need to prevent the numbers from being in an exponential toString form, since the CSS transform does not support that
      // 20 is the largest guaranteed number of digits according to https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toFixed
      // See https://github.com/phetsims/dot/issues/36

      // the inner part of a CSS3 transform, but remember to add the browser-specific parts!
      // NOTE: the toFixed calls are inlined for performance reasons
      return 'matrix(' + this.entries[ 0 ].toFixed( 20 ) + ',' + this.entries[ 1 ].toFixed( 20 ) + ',' + this.entries[ 3 ].toFixed( 20 ) + ',' + this.entries[ 4 ].toFixed( 20 ) + ',' + this.entries[ 6 ].toFixed( 20 ) + ',' + this.entries[ 7 ].toFixed( 20 ) + ')';
    },
    get cssTransform() { return this.getCSSTransform(); },

    getSVGTransform: function() {
      // SVG transform presentation attribute. See http://www.w3.org/TR/SVG/coords.html#TransformAttribute

      // we need to prevent the numbers from being in an exponential toString form, since the CSS transform does not support that
      function svgNumber( number ) {
        // Largest guaranteed number of digits according to https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toFixed
        // See https://github.com/phetsims/dot/issues/36
        return number.toFixed( 20 );
      }

      switch( this.type ) {
        case Types.IDENTITY:
          return '';
        case Types.TRANSLATION_2D:
          return 'translate(' + svgNumber( this.entries[ 6 ] ) + ',' + svgNumber( this.entries[ 7 ] ) + ')';
        case Types.SCALING:
          return 'scale(' + svgNumber( this.entries[ 0 ] ) + ( this.entries[ 0 ] === this.entries[ 4 ] ? '' : ',' + svgNumber( this.entries[ 4 ] ) ) + ')';
        default:
          return 'matrix(' + svgNumber( this.entries[ 0 ] ) + ',' + svgNumber( this.entries[ 1 ] ) + ',' + svgNumber( this.entries[ 3 ] ) + ',' + svgNumber( this.entries[ 4 ] ) + ',' + svgNumber( this.entries[ 6 ] ) + ',' + svgNumber( this.entries[ 7 ] ) + ')';
      }
    },
    get svgTransform() { return this.getSVGTransform(); },

    // returns a parameter object suitable for use with jQuery's .css()
    getCSSTransformStyles: function() {
      var transformCSS = this.getCSSTransform();

      // notes on triggering hardware acceleration: http://creativejs.com/2011/12/day-2-gpu-accelerate-your-dom-elements/
      return {
        // force iOS hardware acceleration
        '-webkit-perspective': 1000,
        '-webkit-backface-visibility': 'hidden',

        '-webkit-transform': transformCSS + ' translateZ(0)', // trigger hardware acceleration if possible
        '-moz-transform': transformCSS + ' translateZ(0)', // trigger hardware acceleration if possible
        '-ms-transform': transformCSS,
        '-o-transform': transformCSS,
        'transform': transformCSS,
        'transform-origin': 'top left', // at the origin of the component. consider 0px 0px instead. Critical, since otherwise this defaults to 50% 50%!!! see https://developer.mozilla.org/en-US/docs/CSS/transform-origin
        '-ms-transform-origin': 'top left' // TODO: do we need other platform-specific transform-origin styles?
      };
    },
    get cssTransformStyles() { return this.getCSSTransformStyles(); },

    // exact equality
    equals: function( m ) {
      return this.m00() === m.m00() && this.m01() === m.m01() && this.m02() === m.m02() &&
             this.m10() === m.m10() && this.m11() === m.m11() && this.m12() === m.m12() &&
             this.m20() === m.m20() && this.m21() === m.m21() && this.m22() === m.m22();
    },

    // equality within a margin of error
    equalsEpsilon: function( m, epsilon ) {
      return Math.abs( this.m00() - m.m00() ) < epsilon && Math.abs( this.m01() - m.m01() ) < epsilon && Math.abs( this.m02() - m.m02() ) < epsilon &&
             Math.abs( this.m10() - m.m10() ) < epsilon && Math.abs( this.m11() - m.m11() ) < epsilon && Math.abs( this.m12() - m.m12() ) < epsilon &&
             Math.abs( this.m20() - m.m20() ) < epsilon && Math.abs( this.m21() - m.m21() ) < epsilon && Math.abs( this.m22() - m.m22() ) < epsilon;
    },

    /*---------------------------------------------------------------------------*
     * Immutable operations (returns a new matrix)
     *----------------------------------------------------------------------------*/

    copy: function() {
      return Matrix3.createFromPool(
        this.m00(), this.m01(), this.m02(),
        this.m10(), this.m11(), this.m12(),
        this.m20(), this.m21(), this.m22(),
        this.type
      );
    },

    plus: function( m ) {
      return Matrix3.createFromPool(
        this.m00() + m.m00(), this.m01() + m.m01(), this.m02() + m.m02(),
        this.m10() + m.m10(), this.m11() + m.m11(), this.m12() + m.m12(),
        this.m20() + m.m20(), this.m21() + m.m21(), this.m22() + m.m22()
      );
    },

    minus: function( m ) {
      return Matrix3.createFromPool(
        this.m00() - m.m00(), this.m01() - m.m01(), this.m02() - m.m02(),
        this.m10() - m.m10(), this.m11() - m.m11(), this.m12() - m.m12(),
        this.m20() - m.m20(), this.m21() - m.m21(), this.m22() - m.m22()
      );
    },

    transposed: function() {
      return Matrix3.createFromPool(
        this.m00(), this.m10(), this.m20(),
        this.m01(), this.m11(), this.m21(),
        this.m02(), this.m12(), this.m22(), ( this.type === Types.IDENTITY || this.type === Types.SCALING ) ? this.type : undefined
      );
    },

    negated: function() {
      return Matrix3.createFromPool(
        -this.m00(), -this.m01(), -this.m02(),
        -this.m10(), -this.m11(), -this.m12(),
        -this.m20(), -this.m21(), -this.m22()
      );
    },

    inverted: function() {
      var det;

      switch( this.type ) {
        case Types.IDENTITY:
          return this;
        case Types.TRANSLATION_2D:
          return Matrix3.createFromPool(
            1, 0, -this.m02(),
            0, 1, -this.m12(),
            0, 0, 1, Types.TRANSLATION_2D );
        case Types.SCALING:
          return Matrix3.createFromPool(
            1 / this.m00(), 0, 0,
            0, 1 / this.m11(), 0,
            0, 0, 1 / this.m22(), Types.SCALING );
        case Types.AFFINE:
          det = this.getDeterminant();
          if ( det !== 0 ) {
            return Matrix3.createFromPool(
              ( -this.m12() * this.m21() + this.m11() * this.m22() ) / det,
              ( this.m02() * this.m21() - this.m01() * this.m22() ) / det,
              ( -this.m02() * this.m11() + this.m01() * this.m12() ) / det,
              ( this.m12() * this.m20() - this.m10() * this.m22() ) / det,
              ( -this.m02() * this.m20() + this.m00() * this.m22() ) / det,
              ( this.m02() * this.m10() - this.m00() * this.m12() ) / det,
              0, 0, 1, Types.AFFINE
            );
          }
          else {
            throw new Error( 'Matrix could not be inverted, determinant === 0' );
          }
        case Types.OTHER:
          det = this.getDeterminant();
          if ( det !== 0 ) {
            return Matrix3.createFromPool(
              ( -this.m12() * this.m21() + this.m11() * this.m22() ) / det,
              ( this.m02() * this.m21() - this.m01() * this.m22() ) / det,
              ( -this.m02() * this.m11() + this.m01() * this.m12() ) / det,
              ( this.m12() * this.m20() - this.m10() * this.m22() ) / det,
              ( -this.m02() * this.m20() + this.m00() * this.m22() ) / det,
              ( this.m02() * this.m10() - this.m00() * this.m12() ) / det,
              ( -this.m11() * this.m20() + this.m10() * this.m21() ) / det,
              ( this.m01() * this.m20() - this.m00() * this.m21() ) / det,
              ( -this.m01() * this.m10() + this.m00() * this.m11() ) / det,
              Types.OTHER
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
      // I * M === M * I === M (the identity)
      if ( this.type === Types.IDENTITY || m.type === Types.IDENTITY ) {
        return this.type === Types.IDENTITY ? m : this;
      }

      if ( this.type === m.type ) {
        // currently two matrices of the same type will result in the same result type
        if ( this.type === Types.TRANSLATION_2D ) {
          // faster combination of translations
          return Matrix3.createFromPool(
            1, 0, this.m02() + m.m02(),
            0, 1, this.m12() + m.m12(),
            0, 0, 1, Types.TRANSLATION_2D );
        }
        else if ( this.type === Types.SCALING ) {
          // faster combination of scaling
          return Matrix3.createFromPool(
            this.m00() * m.m00(), 0, 0,
            0, this.m11() * m.m11(), 0,
            0, 0, 1, Types.SCALING );
        }
      }

      if ( this.type !== Types.OTHER && m.type !== Types.OTHER ) {
        // currently two matrices that are anything but "other" are technically affine, and the result will be affine

        // affine case
        return Matrix3.createFromPool(
          this.m00() * m.m00() + this.m01() * m.m10(),
          this.m00() * m.m01() + this.m01() * m.m11(),
          this.m00() * m.m02() + this.m01() * m.m12() + this.m02(),
          this.m10() * m.m00() + this.m11() * m.m10(),
          this.m10() * m.m01() + this.m11() * m.m11(),
          this.m10() * m.m02() + this.m11() * m.m12() + this.m12(),
          0, 0, 1, Types.AFFINE );
      }

      // general case
      return Matrix3.createFromPool(
        this.m00() * m.m00() + this.m01() * m.m10() + this.m02() * m.m20(),
        this.m00() * m.m01() + this.m01() * m.m11() + this.m02() * m.m21(),
        this.m00() * m.m02() + this.m01() * m.m12() + this.m02() * m.m22(),
        this.m10() * m.m00() + this.m11() * m.m10() + this.m12() * m.m20(),
        this.m10() * m.m01() + this.m11() * m.m11() + this.m12() * m.m21(),
        this.m10() * m.m02() + this.m11() * m.m12() + this.m12() * m.m22(),
        this.m20() * m.m00() + this.m21() * m.m10() + this.m22() * m.m20(),
        this.m20() * m.m01() + this.m21() * m.m11() + this.m22() * m.m21(),
        this.m20() * m.m02() + this.m21() * m.m12() + this.m22() * m.m22() );
    },

    /*---------------------------------------------------------------------------*
     * Immutable operations (returns new form of a parameter)
     *----------------------------------------------------------------------------*/

    timesVector2: function( v ) {
      var x = this.m00() * v.x + this.m01() * v.y + this.m02();
      var y = this.m10() * v.x + this.m11() * v.y + this.m12();
      return new dot.Vector2( x, y );
    },

    timesVector3: function( v ) {
      var x = this.m00() * v.x + this.m01() * v.y + this.m02() * v.z;
      var y = this.m10() * v.x + this.m11() * v.y + this.m12() * v.z;
      var z = this.m20() * v.x + this.m21() * v.y + this.m22() * v.z;
      return new dot.Vector3( x, y, z );
    },

    timesTransposeVector2: function( v ) {
      var x = this.m00() * v.x + this.m10() * v.y;
      var y = this.m01() * v.x + this.m11() * v.y;
      return new dot.Vector2( x, y );
    },

    // TODO: this operation seems to not work for transformDelta2, should be vetted
    timesRelativeVector2: function( v ) {
      var x = this.m00() * v.x + this.m01() * v.y;
      var y = this.m10() * v.y + this.m11() * v.y;
      return new dot.Vector2( x, y );
    },

    /*---------------------------------------------------------------------------*
     * Mutable operations (changes this matrix)
     *----------------------------------------------------------------------------*/

    // every mutable method goes through rowMajor
    rowMajor: function( v00, v01, v02, v10, v11, v12, v20, v21, v22, type ) {
      this.entries[ 0 ] = v00;
      this.entries[ 1 ] = v10;
      this.entries[ 2 ] = v20;
      this.entries[ 3 ] = v01;
      this.entries[ 4 ] = v11;
      this.entries[ 5 ] = v21;
      this.entries[ 6 ] = v02;
      this.entries[ 7 ] = v12;
      this.entries[ 8 ] = v22;

      // TODO: consider performance of the affine check here
      this.type = type === undefined ? ( ( v20 === 0 && v21 === 0 && v22 === 1 ) ? Types.AFFINE : Types.OTHER ) : type;
      return this;
    },

    set: function( matrix ) {
      return this.rowMajor(
        matrix.m00(), matrix.m01(), matrix.m02(),
        matrix.m10(), matrix.m11(), matrix.m12(),
        matrix.m20(), matrix.m21(), matrix.m22(),
        matrix.type );
    },

    setArray: function( array ) {
      return this.rowMajor(
        array[ 0 ], array[ 3 ], array[ 6 ],
        array[ 1 ], array[ 4 ], array[ 7 ],
        array[ 2 ], array[ 5 ], array[ 8 ] );
    },

    // component setters
    set00: function( value ) {
      this.entries[ 0 ] = value;
      return this;
    },
    set01: function( value ) {
      this.entries[ 3 ] = value;
      return this;
    },
    set02: function( value ) {
      this.entries[ 6 ] = value;
      return this;
    },
    set10: function( value ) {
      this.entries[ 1 ] = value;
      return this;
    },
    set11: function( value ) {
      this.entries[ 4 ] = value;
      return this;
    },
    set12: function( value ) {
      this.entries[ 7 ] = value;
      return this;
    },
    set20: function( value ) {
      this.entries[ 2 ] = value;
      return this;
    },
    set21: function( value ) {
      this.entries[ 5 ] = value;
      return this;
    },
    set22: function( value ) {
      this.entries[ 8 ] = value;
      return this;
    },

    makeImmutable: function() {
      this.rowMajor = function() {
        throw new Error( 'Cannot modify immutable matrix' );
      };
      return this;
    },

    columnMajor: function( v00, v10, v20, v01, v11, v21, v02, v12, v22, type ) {
      return this.rowMajor( v00, v01, v02, v10, v11, v12, v20, v21, v22, type );
    },

    add: function( m ) {
      return this.rowMajor(
        this.m00() + m.m00(), this.m01() + m.m01(), this.m02() + m.m02(),
        this.m10() + m.m10(), this.m11() + m.m11(), this.m12() + m.m12(),
        this.m20() + m.m20(), this.m21() + m.m21(), this.m22() + m.m22()
      );
    },

    subtract: function( m ) {
      return this.rowMajor(
        this.m00() - m.m00(), this.m01() - m.m01(), this.m02() - m.m02(),
        this.m10() - m.m10(), this.m11() - m.m11(), this.m12() - m.m12(),
        this.m20() - m.m20(), this.m21() - m.m21(), this.m22() - m.m22()
      );
    },

    transpose: function() {
      return this.rowMajor(
        this.m00(), this.m10(), this.m20(),
        this.m01(), this.m11(), this.m21(),
        this.m02(), this.m12(), this.m22(),
        ( this.type === Types.IDENTITY || this.type === Types.SCALING ) ? this.type : undefined
      );
    },

    negate: function() {
      return this.rowMajor(
        -this.m00(), -this.m01(), -this.m02(),
        -this.m10(), -this.m11(), -this.m12(),
        -this.m20(), -this.m21(), -this.m22()
      );
    },

    invert: function() {
      var det;

      switch( this.type ) {
        case Types.IDENTITY:
          return this;
        case Types.TRANSLATION_2D:
          return this.rowMajor(
            1, 0, -this.m02(),
            0, 1, -this.m12(),
            0, 0, 1, Types.TRANSLATION_2D );
        case Types.SCALING:
          return this.rowMajor(
            1 / this.m00(), 0, 0,
            0, 1 / this.m11(), 0,
            0, 0, 1 / this.m22(), Types.SCALING );
        case Types.AFFINE:
          det = this.getDeterminant();
          if ( det !== 0 ) {
            return this.rowMajor(
              ( -this.m12() * this.m21() + this.m11() * this.m22() ) / det,
              ( this.m02() * this.m21() - this.m01() * this.m22() ) / det,
              ( -this.m02() * this.m11() + this.m01() * this.m12() ) / det,
              ( this.m12() * this.m20() - this.m10() * this.m22() ) / det,
              ( -this.m02() * this.m20() + this.m00() * this.m22() ) / det,
              ( this.m02() * this.m10() - this.m00() * this.m12() ) / det,
              0, 0, 1, Types.AFFINE
            );
          }
          else {
            throw new Error( 'Matrix could not be inverted, determinant === 0' );
          }
        case Types.OTHER:
          det = this.getDeterminant();
          if ( det !== 0 ) {
            return this.rowMajor(
              ( -this.m12() * this.m21() + this.m11() * this.m22() ) / det,
              ( this.m02() * this.m21() - this.m01() * this.m22() ) / det,
              ( -this.m02() * this.m11() + this.m01() * this.m12() ) / det,
              ( this.m12() * this.m20() - this.m10() * this.m22() ) / det,
              ( -this.m02() * this.m20() + this.m00() * this.m22() ) / det,
              ( this.m02() * this.m10() - this.m00() * this.m12() ) / det,
              ( -this.m11() * this.m20() + this.m10() * this.m21() ) / det,
              ( this.m01() * this.m20() - this.m00() * this.m21() ) / det,
              ( -this.m01() * this.m10() + this.m00() * this.m11() ) / det,
              Types.OTHER
            );
          }
          else {
            throw new Error( 'Matrix could not be inverted, determinant === 0' );
          }
        default:
          throw new Error( 'Matrix3.inverted with unknown type: ' + this.type );
      }
    },

    multiplyMatrix: function( m ) {
      // M * I === M (the identity)
      if ( m.type === Types.IDENTITY ) {
        // no change needed
        return this;
      }

      // I * M === M (the identity)
      if ( this.type === Types.IDENTITY ) {
        // copy the other matrix to us
        return this.set( m );
      }

      if ( this.type === m.type ) {
        // currently two matrices of the same type will result in the same result type
        if ( this.type === Types.TRANSLATION_2D ) {
          // faster combination of translations
          return this.rowMajor(
            1, 0, this.m02() + m.m02(),
            0, 1, this.m12() + m.m12(),
            0, 0, 1, Types.TRANSLATION_2D );
        }
        else if ( this.type === Types.SCALING ) {
          // faster combination of scaling
          return this.rowMajor(
            this.m00() * m.m00(), 0, 0,
            0, this.m11() * m.m11(), 0,
            0, 0, 1, Types.SCALING );
        }
      }

      if ( this.type !== Types.OTHER && m.type !== Types.OTHER ) {
        // currently two matrices that are anything but "other" are technically affine, and the result will be affine

        // affine case
        return this.rowMajor(
          this.m00() * m.m00() + this.m01() * m.m10(),
          this.m00() * m.m01() + this.m01() * m.m11(),
          this.m00() * m.m02() + this.m01() * m.m12() + this.m02(),
          this.m10() * m.m00() + this.m11() * m.m10(),
          this.m10() * m.m01() + this.m11() * m.m11(),
          this.m10() * m.m02() + this.m11() * m.m12() + this.m12(),
          0, 0, 1, Types.AFFINE );
      }

      // general case
      return this.rowMajor(
        this.m00() * m.m00() + this.m01() * m.m10() + this.m02() * m.m20(),
        this.m00() * m.m01() + this.m01() * m.m11() + this.m02() * m.m21(),
        this.m00() * m.m02() + this.m01() * m.m12() + this.m02() * m.m22(),
        this.m10() * m.m00() + this.m11() * m.m10() + this.m12() * m.m20(),
        this.m10() * m.m01() + this.m11() * m.m11() + this.m12() * m.m21(),
        this.m10() * m.m02() + this.m11() * m.m12() + this.m12() * m.m22(),
        this.m20() * m.m00() + this.m21() * m.m10() + this.m22() * m.m20(),
        this.m20() * m.m01() + this.m21() * m.m11() + this.m22() * m.m21(),
        this.m20() * m.m02() + this.m21() * m.m12() + this.m22() * m.m22() );
    },

    prependTranslation: function( x, y ) {
      this.set02( this.m02() + x );
      this.set12( this.m12() + y );

      if ( this.type === Types.IDENTITY || this.type === Types.TRANSLATION_2D ) {
        this.type = Types.TRANSLATION_2D;
      }
      else if ( this.type === Types.OTHER ) {
        this.type = Types.OTHER;
      }
      else {
        this.type = Types.AFFINE;
      }
      return this; // for chaining
    },

    setToIdentity: function() {
      return this.rowMajor(
        1, 0, 0,
        0, 1, 0,
        0, 0, 1,
        Types.IDENTITY );
    },

    setToTranslation: function( x, y ) {
      return this.rowMajor(
        1, 0, x,
        0, 1, y,
        0, 0, 1,
        Types.TRANSLATION_2D );
    },

    setToScale: function( x, y ) {
      // allow using one parameter to scale everything
      y = y === undefined ? x : y;

      return this.rowMajor(
        x, 0, 0,
        0, y, 0,
        0, 0, 1,
        Types.SCALING );
    },

    // row major
    setToAffine: function( m00, m01, m02, m10, m11, m12 ) {
      return this.rowMajor( m00, m01, m02, m10, m11, m12, 0, 0, 1, Types.AFFINE );
    },

    // axis is a normalized Vector3, angle in radians.
    setToRotationAxisAngle: function( axis, angle ) {
      var c = Math.cos( angle );
      var s = Math.sin( angle );
      var C = 1 - c;

      return this.rowMajor(
        axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s,
        axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s,
        axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c,
        Types.OTHER );
    },

    setToRotationX: function( angle ) {
      var c = Math.cos( angle );
      var s = Math.sin( angle );

      return this.rowMajor(
        1, 0, 0,
        0, c, -s,
        0, s, c,
        Types.OTHER );
    },

    setToRotationY: function( angle ) {
      var c = Math.cos( angle );
      var s = Math.sin( angle );

      return this.rowMajor(
        c, 0, s,
        0, 1, 0,
        -s, 0, c,
        Types.OTHER );
    },

    setToRotationZ: function( angle ) {
      var c = Math.cos( angle );
      var s = Math.sin( angle );

      return this.rowMajor(
        c, -s, 0,
        s, c, 0,
        0, 0, 1,
        Types.AFFINE );
    },

    setToTranslationRotation: function( x, y, angle ) {
      var c = Math.cos( angle );
      var s = Math.sin( angle );

      return this.rowMajor(
        c, -s, x,
        s, c, y,
        0, 0, 1,
        Types.AFFINE );
    },

    setToTranslationRotationPoint: function( translation, angle ) {
      return this.setToTranslationRotation( translation.x, translation.y, angle );
    },

    setToSVGMatrix: function( svgMatrix ) {
      return this.rowMajor(
        svgMatrix.a, svgMatrix.c, svgMatrix.e,
        svgMatrix.b, svgMatrix.d, svgMatrix.f,
        0, 0, 1,
        Types.AFFINE );
    },

    // a rotation matrix that rotates A to B (Vector3 instances), by rotating about the axis A.cross( B ) -- Shortest path. ideally should be unit vectors
    setRotationAToB: function( a, b ) {
      // see http://graphics.cs.brown.edu/~jfh/papers/Moller-EBA-1999/paper.pdf for information on this implementation
      var start = a;
      var end = b;

      var epsilon = 0.0001;

      var e;
      var h;
      var f;

      var v = start.cross( end );
      e = start.dot( end );
      f = ( e < 0 ) ? -e : e;

      // if "from" and "to" vectors are nearly parallel
      if ( f > 1.0 - epsilon ) {
        var c1;
        var c2;
        var c3;

        var x = new dot.Vector3(
          ( start.x > 0.0 ) ? start.x : -start.x,
          ( start.y > 0.0 ) ? start.y : -start.y,
          ( start.z > 0.0 ) ? start.z : -start.z
        );

        if ( x.x < x.y ) {
          if ( x.x < x.z ) {
            x = dot.Vector3.X_UNIT;
          }
          else {
            x = dot.Vector3.Z_UNIT;
          }
        }
        else {
          if ( x.y < x.z ) {
            x = dot.Vector3.Y_UNIT;
          }
          else {
            x = dot.Vector3.Z_UNIT;
          }
        }

        var u = x.minus( start );
        v = x.minus( end );

        c1 = 2.0 / u.dot( u );
        c2 = 2.0 / v.dot( v );
        c3 = c1 * c2 * u.dot( v );

        return this.rowMajor(
          -c1 * u.x * u.x - c2 * v.x * v.x + c3 * v.x * u.x + 1,
          -c1 * u.x * u.y - c2 * v.x * v.y + c3 * v.x * u.y,
          -c1 * u.x * u.z - c2 * v.x * v.z + c3 * v.x * u.z,
          -c1 * u.y * u.x - c2 * v.y * v.x + c3 * v.y * u.x,
          -c1 * u.y * u.y - c2 * v.y * v.y + c3 * v.y * u.y + 1,
          -c1 * u.y * u.z - c2 * v.y * v.z + c3 * v.y * u.z,
          -c1 * u.z * u.x - c2 * v.z * v.x + c3 * v.z * u.x,
          -c1 * u.z * u.y - c2 * v.z * v.y + c3 * v.z * u.y,
          -c1 * u.z * u.z - c2 * v.z * v.z + c3 * v.z * u.z + 1
        );
      }
      else {
        // the most common case, unless "start"="end", or "start"=-"end"
        var hvx;
        var hvz;
        var hvxy;
        var hvxz;
        var hvyz;
        h = 1.0 / ( 1.0 + e );
        hvx = h * v.x;
        hvz = h * v.z;
        hvxy = hvx * v.y;
        hvxz = hvx * v.z;
        hvyz = hvz * v.y;

        return this.rowMajor(
          e + hvx * v.x, hvxy - v.z, hvxz + v.y,
          hvxy + v.z, e + h * v.y * v.y, hvyz - v.x,
          hvxz - v.y, hvyz + v.x, e + hvz * v.z
        );
      }
    },

    /*---------------------------------------------------------------------------*
     * Mutable operations (changes the parameter)
     *----------------------------------------------------------------------------*/

    multiplyVector2: function( v ) {
      return v.setXY(
        this.m00() * v.x + this.m01() * v.y + this.m02(),
        this.m10() * v.x + this.m11() * v.y + this.m12() );
    },

    multiplyVector3: function( v ) {
      return v.setXYZ(
        this.m00() * v.x + this.m01() * v.y + this.m02() * v.z,
        this.m10() * v.x + this.m11() * v.y + this.m12() * v.z,
        this.m20() * v.x + this.m21() * v.y + this.m22() * v.z );
    },

    multiplyTransposeVector2: function( v ) {
      return v.setXY(
        this.m00() * v.x + this.m10() * v.y,
        this.m01() * v.x + this.m11() * v.y );
    },

    multiplyRelativeVector2: function( v ) {
      return v.setXY(
        this.m00() * v.x + this.m01() * v.y,
        this.m10() * v.y + this.m11() * v.y );
    },

    // sets the transform of a Canvas 2D rendering context to the affine part of this matrix
    canvasSetTransform: function( context ) {
      context.setTransform(
        // inlined array entries
        this.entries[ 0 ],
        this.entries[ 1 ],
        this.entries[ 3 ],
        this.entries[ 4 ],
        this.entries[ 6 ],
        this.entries[ 7 ]
      );
    },

    // appends the affine part of this matrix to the Canvas 2D rendering context
    canvasAppendTransform: function( context ) {
      if ( this.type !== Types.IDENTITY ) {
        context.transform(
          // inlined array entries
          this.entries[ 0 ],
          this.entries[ 1 ],
          this.entries[ 3 ],
          this.entries[ 4 ],
          this.entries[ 6 ],
          this.entries[ 7 ]
        );
      }
    },

    /**
     * Copies the entries of this matrix over to an arbitrary array (typed or normal).
     * @public
     *
     * @param {Array|Float32Array|Float64Array} array
     * @returns {Array|Float32Array|Float64Array} - Returned for chaining
     */
    copyToArray: function( array ) {
      array[ 0 ] = this.m00();
      array[ 1 ] = this.m10();
      array[ 2 ] = this.m20();
      array[ 3 ] = this.m01();
      array[ 4 ] = this.m11();
      array[ 5 ] = this.m21();
      array[ 6 ] = this.m02();
      array[ 7 ] = this.m12();
      array[ 8 ] = this.m22();
      return array;
    }
  };

  Poolable.mixInto( Matrix3, {
    initialize: Matrix3.prototype.rowMajor,
    useDefaultConstruction: true,
    maxSize: 300
  } );

  // create an immutable
  Matrix3.IDENTITY = Matrix3.identity();
  Matrix3.IDENTITY.makeImmutable();

  Matrix3.X_REFLECTION = Matrix3.createFromPool(
    -1, 0, 0,
    0, 1, 0,
    0, 0, 1,
    Types.AFFINE );
  Matrix3.X_REFLECTION.makeImmutable();

  Matrix3.Y_REFLECTION = Matrix3.createFromPool(
    1, 0, 0,
    0, -1, 0,
    0, 0, 1,
    Types.AFFINE );
  Matrix3.Y_REFLECTION.makeImmutable();

  //Shortcut for translation times a matrix (without allocating a translation matrix), see scenery#119
  Matrix3.translationTimesMatrix = function( x, y, m ) {
    var type;
    if ( m.type === Types.IDENTITY || m.type === Types.TRANSLATION_2D ) {
      return Matrix3.createFromPool(
        1, 0, m.m02() + x,
        0, 1, m.m12() + y,
        0, 0, 1,
        Types.TRANSLATION_2D );
    }
    else if ( m.type === Types.OTHER ) {
      type = Types.OTHER;
    }
    else {
      type = Types.AFFINE;
    }
    return Matrix3.createFromPool(
      m.m00(), m.m01(), m.m02() + x,
      m.m10(), m.m11(), m.m12() + y,
      m.m20(), m.m21(), m.m22(),
      type );
  };

  Matrix3.printer = {
    print: function( matrix ) {
      console.log( matrix.toString() );
    }
  };

  return Matrix3;
} );
