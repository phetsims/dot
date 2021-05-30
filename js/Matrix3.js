// Copyright 2013-2021, University of Colorado Boulder

/**
 * 3-dimensional Matrix
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Enumeration from '../../phet-core/js/Enumeration.js';
import EnumerationIO from '../../phet-core/js/EnumerationIO.js';
import Poolable from '../../phet-core/js/Poolable.js';
import ArrayIO from '../../tandem/js/types/ArrayIO.js';
import IOType from '../../tandem/js/types/IOType.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import dot from './dot.js';
import Matrix4 from './Matrix4.js';
import toSVGNumber from './toSVGNumber.js';
import Vector2 from './Vector2.js';
import Vector3 from './Vector3.js';

class Matrix3 {
  /**
   * Creates an identity matrix, that can then be mutated into the proper form.
   */
  constructor() {

    //Make sure no clients are expecting to create a matrix with non-identity values
    assert && assert( arguments.length === 0, 'Matrix3 constructor should not be called with any arguments.  Use Matrix3.createFromPool()/Matrix3.identity()/etc.' );

    // @public {Array.<number>} - Entries stored in column-major format
    this.entries = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];

    // @public {Matrix3.Types}
    this.type = Types.IDENTITY;
  }

  /**
   * Convenience getter for the individual 0,0 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m00() {
    return this.entries[ 0 ];
  }

  /**
   * Convenience getter for the individual 0,1 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m01() {
    return this.entries[ 3 ];
  }

  /**
   * Convenience getter for the individual 0,2 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m02() {
    return this.entries[ 6 ];
  }

  /**
   * Convenience getter for the individual 1,0 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m10() {
    return this.entries[ 1 ];
  }

  /**
   * Convenience getter for the individual 1,1 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m11() {
    return this.entries[ 4 ];
  }

  /**
   * Convenience getter for the individual 1,2 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m12() {
    return this.entries[ 7 ];
  }

  /**
   * Convenience getter for the individual 2,0 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m20() {
    return this.entries[ 2 ];
  }

  /**
   * Convenience getter for the individual 2,1 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m21() {
    return this.entries[ 5 ];
  }

  /**
   * Convenience getter for the individual 2,2 entry of the matrix.
   * @public
   *
   * @returns {number}
   */
  m22() {
    return this.entries[ 8 ];
  }

  /**
   * Returns whether this matrix is an identity matrix.
   * @public
   *
   * @returns {boolean}
   */
  isIdentity() {
    return this.type === Types.IDENTITY || this.equals( Matrix3.IDENTITY );
  }

  /**
   * Returns whether this matrix is likely to be an identity matrix (returning false means "inconclusive, may be
   * identity or not"), but true is guaranteed to be an identity matrix.
   * @public
   *
   * @returns {boolean}
   */
  isFastIdentity() {
    return this.type === Types.IDENTITY;
  }

  /**
   * Returns whether this matrix is an affine matrix (e.g. no shear).
   * @public
   *
   * @returns {boolean}
   */
  isAffine() {
    return this.type === Types.AFFINE || ( this.m20() === 0 && this.m21() === 0 && this.m22() === 1 );
  }

  /**
   * Returns whether it's an affine matrix where the components of transforms are independent, i.e. constructed from
   * arbitrary component scaling and translation.
   * @public
   *
   * @returns {boolean}
   */
  isAligned() {
    // non-diagonal non-translation entries should all be zero.
    return this.isAffine() && this.m01() === 0 && this.m10() === 0;
  }


  /**
   * Returns if it's an affine matrix where the components of transforms are independent, but may be switched (unlike isAligned)
   * @public
   *
   * i.e. the 2x2 rotational sub-matrix is of one of the two forms:
   * A 0  or  0  A
   * 0 B      B  0
   * This means that moving a transformed point by (x,0) or (0,y) will result in a motion along one of the axes.
   *
   * @returns {boolean}
   */
  isAxisAligned() {
    return this.isAffine() && ( ( this.m01() === 0 && this.m10() === 0 ) || ( this.m00() === 0 && this.m11() === 0 ) );
  }

  /**
   * Returns whether every single entry in this matrix is a finite number (non-NaN, non-infinite).
   * @public
   *
   * @returns {boolean}
   */
  isFinite() {
    return isFinite( this.m00() ) &&
           isFinite( this.m01() ) &&
           isFinite( this.m02() ) &&
           isFinite( this.m10() ) &&
           isFinite( this.m11() ) &&
           isFinite( this.m12() ) &&
           isFinite( this.m20() ) &&
           isFinite( this.m21() ) &&
           isFinite( this.m22() );
  }

  /**
   * Returns the determinant of this matrix.
   * @public
   *
   * @returns {number}
   */
  getDeterminant() {
    return this.m00() * this.m11() * this.m22() + this.m01() * this.m12() * this.m20() + this.m02() * this.m10() * this.m21() - this.m02() * this.m11() * this.m20() - this.m01() * this.m10() * this.m22() - this.m00() * this.m12() * this.m21();
  }

  get determinant() { return this.getDeterminant(); }

  /**
   * Returns the 2D translation, assuming multiplication with a homogeneous vector
   * @public
   *
   * @returns {Vector2}
   */
  getTranslation() {
    return new Vector2( this.m02(), this.m12() );
  }

  get translation() { return this.getTranslation(); }

  /**
   * Returns a vector that is equivalent to ( T(1,0).magnitude(), T(0,1).magnitude() ) where T is a relative transform
   * @public
   *
   * @returns {Vector2}
   */
  getScaleVector() {
    return new Vector2(
      Math.sqrt( this.m00() * this.m00() + this.m10() * this.m10() ),
      Math.sqrt( this.m01() * this.m01() + this.m11() * this.m11() ) );
  }

  get scaleVector() { return this.getScaleVector(); }

  /**
   * Returns the angle in radians for the 2d rotation from this matrix, between pi, -pi
   * @public
   *
   * @returns {number}
   */
  getRotation() {
    return Math.atan2( this.m10(), this.m00() );
  }

  get rotation() { return this.getRotation(); }

  /**
   * Returns an identity-padded copy of this matrix with an increased dimension.
   * @public
   *
   * @returns {Matrix4}
   */
  toMatrix4() {
    return new Matrix4(
      this.m00(), this.m01(), this.m02(), 0,
      this.m10(), this.m11(), this.m12(), 0,
      this.m20(), this.m21(), this.m22(), 0,
      0, 0, 0, 1 );
  }

  /**
   * Returns an identity-padded copy of this matrix with an increased dimension, treating this matrix's affine
   * components only.
   * @public
   *
   * @returns {Matrix4}
   */
  toAffineMatrix4() {
    return new Matrix4(
      this.m00(), this.m01(), 0, this.m02(),
      this.m10(), this.m11(), 0, this.m12(),
      0, 0, 1, 0,
      0, 0, 0, 1 );
  }

  /**
   * Returns a string form of this object
   * @public
   *
   * @returns {string}
   */
  toString() {
    return `${this.m00()} ${this.m01()} ${this.m02()}\n${
      this.m10()} ${this.m11()} ${this.m12()}\n${
      this.m20()} ${this.m21()} ${this.m22()}`;
  }

  /**
   * Creates an SVG form of this matrix, for high-performance processing in SVG output.
   * @public
   *
   * @returns {SVGMatrix}
   */
  toSVGMatrix() {
    const result = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' ).createSVGMatrix();

    // top two rows
    result.a = this.m00();
    result.b = this.m10();
    result.c = this.m01();
    result.d = this.m11();
    result.e = this.m02();
    result.f = this.m12();

    return result;
  }

  /**
   * Returns the CSS form (simplified if possible) for this transformation matrix.
   * @public
   *
   * @returns {string}
   */
  getCSSTransform() {
    // See http://www.w3.org/TR/css3-transforms/, particularly Section 13 that discusses the SVG compatibility

    // We need to prevent the numbers from being in an exponential toString form, since the CSS transform does not support that
    // 20 is the largest guaranteed number of digits according to https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toFixed
    // See https://github.com/phetsims/dot/issues/36

    // the inner part of a CSS3 transform, but remember to add the browser-specific parts!
    // NOTE: the toFixed calls are inlined for performance reasons
    return `matrix(${this.entries[ 0 ].toFixed( 20 )},${this.entries[ 1 ].toFixed( 20 )},${this.entries[ 3 ].toFixed( 20 )},${this.entries[ 4 ].toFixed( 20 )},${this.entries[ 6 ].toFixed( 20 )},${this.entries[ 7 ].toFixed( 20 )})`; // eslint-disable-line bad-sim-text
  }

  get cssTransform() { return this.getCSSTransform(); }

  /**
   * Returns the CSS-like SVG matrix form for this transformation matrix.
   * @public
   *
   * @returns {string}
   */
  getSVGTransform() {
    // SVG transform presentation attribute. See http://www.w3.org/TR/SVG/coords.html#TransformAttribute
    switch( this.type ) {
      case Types.IDENTITY:
        return '';
      case Types.TRANSLATION_2D:
        return `translate(${toSVGNumber( this.entries[ 6 ] )},${toSVGNumber( this.entries[ 7 ] )})`;
      case Types.SCALING:
        return `scale(${toSVGNumber( this.entries[ 0 ] )}${this.entries[ 0 ] === this.entries[ 4 ] ? '' : `,${toSVGNumber( this.entries[ 4 ] )}`})`;
      default:
        return `matrix(${toSVGNumber( this.entries[ 0 ] )},${toSVGNumber( this.entries[ 1 ] )},${toSVGNumber( this.entries[ 3 ] )},${toSVGNumber( this.entries[ 4 ] )},${toSVGNumber( this.entries[ 6 ] )},${toSVGNumber( this.entries[ 7 ] )})`;
    }
  }

  get svgTransform() { return this.getSVGTransform(); }

  /**
   * Returns a parameter object suitable for use with jQuery's .css()
   * @public
   *
   * @returns {Object}
   */
  getCSSTransformStyles() {
    const transformCSS = this.getCSSTransform();

    // notes on triggering hardware acceleration: http://creativejs.com/2011/12/day-2-gpu-accelerate-your-dom-elements/
    return {
      // force iOS hardware acceleration
      '-webkit-perspective': 1000,
      '-webkit-backface-visibility': 'hidden',

      '-webkit-transform': `${transformCSS} translateZ(0)`, // trigger hardware acceleration if possible
      '-moz-transform': `${transformCSS} translateZ(0)`, // trigger hardware acceleration if possible
      '-ms-transform': transformCSS,
      '-o-transform': transformCSS,
      transform: transformCSS,
      'transform-origin': 'top left', // at the origin of the component. consider 0px 0px instead. Critical, since otherwise this defaults to 50% 50%!!! see https://developer.mozilla.org/en-US/docs/CSS/transform-origin
      '-ms-transform-origin': 'top left' // TODO: do we need other platform-specific transform-origin styles?
    };
  }

  get cssTransformStyles() { return this.getCSSTransformStyles(); }

  /**
   * Returns exact equality with another matrix
   * @public
   *
   * @param {Matrix3} matrix
   * @returns {boolean}
   */
  equals( matrix ) {
    return this.m00() === matrix.m00() && this.m01() === matrix.m01() && this.m02() === matrix.m02() &&
           this.m10() === matrix.m10() && this.m11() === matrix.m11() && this.m12() === matrix.m12() &&
           this.m20() === matrix.m20() && this.m21() === matrix.m21() && this.m22() === matrix.m22();
  }

  /**
   * Returns equality within a margin of error with another matrix
   * @public
   *
   * @param {Matrix3} matrix
   * @param {number} epsilon
   * @returns {boolean}
   */
  equalsEpsilon( matrix, epsilon ) {
    return Math.abs( this.m00() - matrix.m00() ) < epsilon &&
           Math.abs( this.m01() - matrix.m01() ) < epsilon &&
           Math.abs( this.m02() - matrix.m02() ) < epsilon &&
           Math.abs( this.m10() - matrix.m10() ) < epsilon &&
           Math.abs( this.m11() - matrix.m11() ) < epsilon &&
           Math.abs( this.m12() - matrix.m12() ) < epsilon &&
           Math.abs( this.m20() - matrix.m20() ) < epsilon &&
           Math.abs( this.m21() - matrix.m21() ) < epsilon &&
           Math.abs( this.m22() - matrix.m22() ) < epsilon;
  }

  /*---------------------------------------------------------------------------*
   * Immutable operations (returns a new matrix)
   *----------------------------------------------------------------------------*/

  /**
   * Returns a copy of this matrix
   * @public
   *
   * @returns {Matrix3}
   */
  copy() {
    return Matrix3.createFromPool(
      this.m00(), this.m01(), this.m02(),
      this.m10(), this.m11(), this.m12(),
      this.m20(), this.m21(), this.m22(),
      this.type
    );
  }

  /**
   * Returns a new matrix, defined by this matrix plus the provided matrix
   * @public
   *
   * @param {Matrix3} matrix
   * @returns {Matrix3}
   */
  plus( matrix ) {
    return Matrix3.createFromPool(
      this.m00() + matrix.m00(), this.m01() + matrix.m01(), this.m02() + matrix.m02(),
      this.m10() + matrix.m10(), this.m11() + matrix.m11(), this.m12() + matrix.m12(),
      this.m20() + matrix.m20(), this.m21() + matrix.m21(), this.m22() + matrix.m22()
    );
  }

  /**
   * Returns a new matrix, defined by this matrix plus the provided matrix
   * @public
   *
   * @param {Matrix3} matrix
   * @returns {Matrix3}
   */
  minus( matrix ) {
    return Matrix3.createFromPool(
      this.m00() - matrix.m00(), this.m01() - matrix.m01(), this.m02() - matrix.m02(),
      this.m10() - matrix.m10(), this.m11() - matrix.m11(), this.m12() - matrix.m12(),
      this.m20() - matrix.m20(), this.m21() - matrix.m21(), this.m22() - matrix.m22()
    );
  }

  /**
   * Returns a transposed copy of this matrix
   * @public
   *
   * @returns {Matrix3}
   */
  transposed() {
    return Matrix3.createFromPool(
      this.m00(), this.m10(), this.m20(),
      this.m01(), this.m11(), this.m21(),
      this.m02(), this.m12(), this.m22(), ( this.type === Types.IDENTITY || this.type === Types.SCALING ) ? this.type : undefined
    );
  }

  /**
   * Returns a negated copy of this matrix
   * @public
   *
   * @returns {Matrix3}
   */
  negated() {
    return Matrix3.createFromPool(
      -this.m00(), -this.m01(), -this.m02(),
      -this.m10(), -this.m11(), -this.m12(),
      -this.m20(), -this.m21(), -this.m22()
    );
  }

  /**
   * Returns an inverted copy of this matrix
   * @public
   *
   * @returns {Matrix3}
   */
  inverted() {
    let det;

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
        throw new Error( `Matrix3.inverted with unknown type: ${this.type}` );
    }
  }

  /**
   * Returns a matrix, defined by the multiplication of this * matrix.
   * @public
   *
   * @param {Matrix3} matrix
   * @returns {Matrix3} - NOTE: this may be the same matrix!
   */
  timesMatrix( matrix ) {
    // I * M === M * I === M (the identity)
    if ( this.type === Types.IDENTITY || matrix.type === Types.IDENTITY ) {
      return this.type === Types.IDENTITY ? matrix : this;
    }

    if ( this.type === matrix.type ) {
      // currently two matrices of the same type will result in the same result type
      if ( this.type === Types.TRANSLATION_2D ) {
        // faster combination of translations
        return Matrix3.createFromPool(
          1, 0, this.m02() + matrix.m02(),
          0, 1, this.m12() + matrix.m12(),
          0, 0, 1, Types.TRANSLATION_2D );
      }
      else if ( this.type === Types.SCALING ) {
        // faster combination of scaling
        return Matrix3.createFromPool(
          this.m00() * matrix.m00(), 0, 0,
          0, this.m11() * matrix.m11(), 0,
          0, 0, 1, Types.SCALING );
      }
    }

    if ( this.type !== Types.OTHER && matrix.type !== Types.OTHER ) {
      // currently two matrices that are anything but "other" are technically affine, and the result will be affine

      // affine case
      return Matrix3.createFromPool(
        this.m00() * matrix.m00() + this.m01() * matrix.m10(),
        this.m00() * matrix.m01() + this.m01() * matrix.m11(),
        this.m00() * matrix.m02() + this.m01() * matrix.m12() + this.m02(),
        this.m10() * matrix.m00() + this.m11() * matrix.m10(),
        this.m10() * matrix.m01() + this.m11() * matrix.m11(),
        this.m10() * matrix.m02() + this.m11() * matrix.m12() + this.m12(),
        0, 0, 1, Types.AFFINE );
    }

    // general case
    return Matrix3.createFromPool(
      this.m00() * matrix.m00() + this.m01() * matrix.m10() + this.m02() * matrix.m20(),
      this.m00() * matrix.m01() + this.m01() * matrix.m11() + this.m02() * matrix.m21(),
      this.m00() * matrix.m02() + this.m01() * matrix.m12() + this.m02() * matrix.m22(),
      this.m10() * matrix.m00() + this.m11() * matrix.m10() + this.m12() * matrix.m20(),
      this.m10() * matrix.m01() + this.m11() * matrix.m11() + this.m12() * matrix.m21(),
      this.m10() * matrix.m02() + this.m11() * matrix.m12() + this.m12() * matrix.m22(),
      this.m20() * matrix.m00() + this.m21() * matrix.m10() + this.m22() * matrix.m20(),
      this.m20() * matrix.m01() + this.m21() * matrix.m11() + this.m22() * matrix.m21(),
      this.m20() * matrix.m02() + this.m21() * matrix.m12() + this.m22() * matrix.m22() );
  }

  /*---------------------------------------------------------------------------*
   * Immutable operations (returns new form of a parameter)
   *----------------------------------------------------------------------------*/

  /**
   * Returns the multiplication of this matrix times the provided vector (treating this matrix as homogeneous, so that
   * it is the technical multiplication of (x,y,1)).
   * @public
   *
   * @param {Vector2} vector2
   * @returns {Vector2}
   */
  timesVector2( vector2 ) {
    const x = this.m00() * vector2.x + this.m01() * vector2.y + this.m02();
    const y = this.m10() * vector2.x + this.m11() * vector2.y + this.m12();
    return new Vector2( x, y );
  }

  /**
   * Returns the multiplication of this matrix times the provided vector
   * @public
   *
   * @param {Vector3} vector3
   * @returns {Vector3}
   */
  timesVector3( vector3 ) {
    const x = this.m00() * vector3.x + this.m01() * vector3.y + this.m02() * vector3.z;
    const y = this.m10() * vector3.x + this.m11() * vector3.y + this.m12() * vector3.z;
    const z = this.m20() * vector3.x + this.m21() * vector3.y + this.m22() * vector3.z;
    return new Vector3( x, y, z );
  }

  /**
   * Returns the multiplication of the transpose of this matrix times the provided vector (assuming the 2x2 quadrant)
   * @public
   *
   * @param {Vector2} vector2
   * @returns {Vector2}
   */
  timesTransposeVector2( vector2 ) {
    const x = this.m00() * vector2.x + this.m10() * vector2.y;
    const y = this.m01() * vector2.x + this.m11() * vector2.y;
    return new Vector2( x, y );
  }

  /**
   * TODO: this operation seems to not work for transformDelta2, should be vetted
   * @public
   *
   * @param {Vector2} vector2
   * @returns {Vector2}
   */
  timesRelativeVector2( vector2 ) {
    const x = this.m00() * vector2.x + this.m01() * vector2.y;
    const y = this.m10() * vector2.y + this.m11() * vector2.y;
    return new Vector2( x, y );
  }

  /*---------------------------------------------------------------------------*
   * Mutable operations (changes this matrix)
   *----------------------------------------------------------------------------*/

  /**
   * Sets the entire state of the matrix, in row-major order.
   * @public
   *
   * NOTE: Every mutable method goes through rowMajor
   *
   * @param {number} v00
   * @param {number} v01
   * @param {number} v02
   * @param {number} v10
   * @param {number} v11
   * @param {number} v12
   * @param {number} v20
   * @param {number} v21
   * @param {number} v22
   * @param {number} [type]
   * @returns {Matrix3} - Self reference
   */
  rowMajor( v00, v01, v02, v10, v11, v12, v20, v21, v22, type ) {
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
  }

  /**
   * Sets this matrix to be a copy of another matrix.
   * @public
   *
   * @param {Matrix3} matrix
   * @returns {Matrix3} - Self reference
   */
  set( matrix ) {
    return this.rowMajor(
      matrix.m00(), matrix.m01(), matrix.m02(),
      matrix.m10(), matrix.m11(), matrix.m12(),
      matrix.m20(), matrix.m21(), matrix.m22(),
      matrix.type );
  }

  /**
   * Sets this matrix to be a copy of the column-major data stored in an array (e.g. WebGL).
   * @public
   *
   * @param {Array.<number>|Float32Array|Float64Array} array
   * @returns {Matrix3} - Self reference
   */
  setArray( array ) {
    return this.rowMajor(
      array[ 0 ], array[ 3 ], array[ 6 ],
      array[ 1 ], array[ 4 ], array[ 7 ],
      array[ 2 ], array[ 5 ], array[ 8 ] );
  }

  /**
   * Sets the individual 0,0 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set00( value ) {
    this.entries[ 0 ] = value;
    return this;
  }

  /**
   * Sets the individual 0,1 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set01( value ) {
    this.entries[ 3 ] = value;
    return this;
  }

  /**
   * Sets the individual 0,2 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set02( value ) {
    this.entries[ 6 ] = value;
    return this;
  }

  /**
   * Sets the individual 1,0 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set10( value ) {
    this.entries[ 1 ] = value;
    return this;
  }

  /**
   * Sets the individual 1,1 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set11( value ) {
    this.entries[ 4 ] = value;
    return this;
  }

  /**
   * Sets the individual 1,2 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set12( value ) {
    this.entries[ 7 ] = value;
    return this;
  }

  /**
   * Sets the individual 2,0 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set20( value ) {
    this.entries[ 2 ] = value;
    return this;
  }

  /**
   * Sets the individual 2,1 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set21( value ) {
    this.entries[ 5 ] = value;
    return this;
  }

  /**
   * Sets the individual 2,2 component of this matrix.
   * @public
   *
   * @param {number} value
   * @returns {Matrix3} - Self reference
   */
  set22( value ) {
    this.entries[ 8 ] = value;
    return this;
  }

  /**
   * Makes this matrix effectively immutable to the normal methods (except direct setters?)
   * @public
   *
   * @returns {Matrix3} - Self reference
   */
  makeImmutable() {
    if ( assert ) {
      this.rowMajor = () => {
        throw new Error( 'Cannot modify immutable matrix' );
      };
    }
    return this;
  }

  /**
   * Sets the entire state of the matrix, in column-major order.
   * @public
   *
   * @param {number} v00
   * @param {number} v10
   * @param {number} v20
   * @param {number} v01
   * @param {number} v11
   * @param {number} v21
   * @param {number} v02
   * @param {number} v12
   * @param {number} v22
   * @param {number} type - TODO replace with enumeration
   * @returns {Matrix3} - Self reference
   */
  columnMajor( v00, v10, v20, v01, v11, v21, v02, v12, v22, type ) {
    return this.rowMajor( v00, v01, v02, v10, v11, v12, v20, v21, v22, type );
  }

  /**
   * Sets this matrix to itself plus the given matrix.
   * @public
   *
   * @param {Matrix3} matrix
   * @returns {Matrix3} - Self reference
   */
  add( matrix ) {
    return this.rowMajor(
      this.m00() + matrix.m00(), this.m01() + matrix.m01(), this.m02() + matrix.m02(),
      this.m10() + matrix.m10(), this.m11() + matrix.m11(), this.m12() + matrix.m12(),
      this.m20() + matrix.m20(), this.m21() + matrix.m21(), this.m22() + matrix.m22()
    );
  }

  /**
   * Sets this matrix to itself minus the given matrix.
   * @public
   *
   * @param {Matrix3} matrix
   * @returns {Matrix3} - Self reference
   */
  subtract( m ) {
    return this.rowMajor(
      this.m00() - m.m00(), this.m01() - m.m01(), this.m02() - m.m02(),
      this.m10() - m.m10(), this.m11() - m.m11(), this.m12() - m.m12(),
      this.m20() - m.m20(), this.m21() - m.m21(), this.m22() - m.m22()
    );
  }

  /**
   * Sets this matrix to its own transpose.
   * @public
   *
   * @returns {Matrix3} - Self reference
   */
  transpose() {
    return this.rowMajor(
      this.m00(), this.m10(), this.m20(),
      this.m01(), this.m11(), this.m21(),
      this.m02(), this.m12(), this.m22(),
      ( this.type === Types.IDENTITY || this.type === Types.SCALING ) ? this.type : undefined
    );
  }

  /**
   * Sets this matrix to its own negation.
   * @public
   *
   * @returns {Matrix3} - Self reference
   */
  negate() {
    return this.rowMajor(
      -this.m00(), -this.m01(), -this.m02(),
      -this.m10(), -this.m11(), -this.m12(),
      -this.m20(), -this.m21(), -this.m22()
    );
  }

  /**
   * Sets this matrix to its own inverse.
   * @public
   *
   * @returns {Matrix3} - Self reference
   */
  invert() {
    let det;

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
        throw new Error( `Matrix3.inverted with unknown type: ${this.type}` );
    }
  }

  /**
   * Sets this matrix to the value of itself times the provided matrix
   * @public
   *
   * @param {Matrix3} matrix
   * @returns {Matrix3} - Self reference
   */
  multiplyMatrix( matrix ) {
    // M * I === M (the identity)
    if ( matrix.type === Types.IDENTITY ) {
      // no change needed
      return this;
    }

    // I * M === M (the identity)
    if ( this.type === Types.IDENTITY ) {
      // copy the other matrix to us
      return this.set( matrix );
    }

    if ( this.type === matrix.type ) {
      // currently two matrices of the same type will result in the same result type
      if ( this.type === Types.TRANSLATION_2D ) {
        // faster combination of translations
        return this.rowMajor(
          1, 0, this.m02() + matrix.m02(),
          0, 1, this.m12() + matrix.m12(),
          0, 0, 1, Types.TRANSLATION_2D );
      }
      else if ( this.type === Types.SCALING ) {
        // faster combination of scaling
        return this.rowMajor(
          this.m00() * matrix.m00(), 0, 0,
          0, this.m11() * matrix.m11(), 0,
          0, 0, 1, Types.SCALING );
      }
    }

    if ( this.type !== Types.OTHER && matrix.type !== Types.OTHER ) {
      // currently two matrices that are anything but "other" are technically affine, and the result will be affine

      // affine case
      return this.rowMajor(
        this.m00() * matrix.m00() + this.m01() * matrix.m10(),
        this.m00() * matrix.m01() + this.m01() * matrix.m11(),
        this.m00() * matrix.m02() + this.m01() * matrix.m12() + this.m02(),
        this.m10() * matrix.m00() + this.m11() * matrix.m10(),
        this.m10() * matrix.m01() + this.m11() * matrix.m11(),
        this.m10() * matrix.m02() + this.m11() * matrix.m12() + this.m12(),
        0, 0, 1, Types.AFFINE );
    }

    // general case
    return this.rowMajor(
      this.m00() * matrix.m00() + this.m01() * matrix.m10() + this.m02() * matrix.m20(),
      this.m00() * matrix.m01() + this.m01() * matrix.m11() + this.m02() * matrix.m21(),
      this.m00() * matrix.m02() + this.m01() * matrix.m12() + this.m02() * matrix.m22(),
      this.m10() * matrix.m00() + this.m11() * matrix.m10() + this.m12() * matrix.m20(),
      this.m10() * matrix.m01() + this.m11() * matrix.m11() + this.m12() * matrix.m21(),
      this.m10() * matrix.m02() + this.m11() * matrix.m12() + this.m12() * matrix.m22(),
      this.m20() * matrix.m00() + this.m21() * matrix.m10() + this.m22() * matrix.m20(),
      this.m20() * matrix.m01() + this.m21() * matrix.m11() + this.m22() * matrix.m21(),
      this.m20() * matrix.m02() + this.m21() * matrix.m12() + this.m22() * matrix.m22() );
  }

  /**
   * Mutates this matrix, equivalent to (translation * this).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {Matrix3} - Self reference
   */
  prependTranslation( x, y ) {
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
  }

  /**
   * Sets this matrix to the 3x3 identity matrix.
   * @public
   *
   * @returns {Matrix3} - Self reference
   */
  setToIdentity() {
    return this.rowMajor(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
      Types.IDENTITY );
  }

  /**
   * Sets this matrix to the affine translation matrix.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {Matrix3} - Self reference
   */
  setToTranslation( x, y ) {
    return this.rowMajor(
      1, 0, x,
      0, 1, y,
      0, 0, 1,
      Types.TRANSLATION_2D );
  }

  /**
   * Sets this matrix to the affine scaling matrix.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {Matrix3} - Self reference
   */
  setToScale( x, y ) {
    // allow using one parameter to scale everything
    y = y === undefined ? x : y;

    return this.rowMajor(
      x, 0, 0,
      0, y, 0,
      0, 0, 1,
      Types.SCALING );
  }

  /**
   * Sets this matrix to an affine matrix with the specified row-major values.
   * @public
   *
   * @param {number} m00
   * @param {number} m01
   * @param {number} m02
   * @param {number} m10
   * @param {number} m11
   * @param {number} m12
   * @returns {Matrix3} - Self reference
   */
  setToAffine( m00, m01, m02, m10, m11, m12 ) {
    return this.rowMajor( m00, m01, m02, m10, m11, m12, 0, 0, 1, Types.AFFINE );
  }

  /**
   * Sets the matrix to a rotation defined by a rotation of the specified angle around the given unit axis.
   * @public
   *
   * @param {Vector3} axis - normalized
   * @param {number} angle - in radians
   * @returns {Matrix3} - Self reference
   */
  setToRotationAxisAngle( axis, angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );
    const C = 1 - c;

    return this.rowMajor(
      axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s,
      axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s,
      axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c,
      Types.OTHER );
  }

  /**
   * Sets this matrix to a rotation around the x axis (in the yz plane).
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix3} - Self reference
   */
  setToRotationX( angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );

    return this.rowMajor(
      1, 0, 0,
      0, c, -s,
      0, s, c,
      Types.OTHER );
  }

  /**
   * Sets this matrix to a rotation around the y axis (in the xz plane).
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix3} - Self reference
   */
  setToRotationY( angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );

    return this.rowMajor(
      c, 0, s,
      0, 1, 0,
      -s, 0, c,
      Types.OTHER );
  }

  /**
   * Sets this matrix to a rotation around the z axis (in the xy plane).
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix3} - Self reference
   */
  setToRotationZ( angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );

    return this.rowMajor(
      c, -s, 0,
      s, c, 0,
      0, 0, 1,
      Types.AFFINE );
  }

  /**
   * Sets this matrix to the combined translation+rotation (where the rotation logically would happen first, THEN it
   * would be translated).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} angle - in radians
   * @returns {Matrix3} - Self reference
   */
  setToTranslationRotation( x, y, angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );

    return this.rowMajor(
      c, -s, x,
      s, c, y,
      0, 0, 1,
      Types.AFFINE );
  }

  /**
   * Sets this matrix to the combined translation+rotation (where the rotation logically would happen first, THEN it
   * would be translated).
   * @public
   *
   * @param {Vector2} translation
   * @param {number} angle - in radians
   * @returns {Matrix3} - Self reference
   */
  setToTranslationRotationPoint( translation, angle ) {
    return this.setToTranslationRotation( translation.x, translation.y, angle );
  }

  /**
   * Sets this matrix to the values contained in an SVGMatrix.
   * @public
   *
   * @param {SVGMatrix} svgMatrix
   * @returns {Matrix3} - Self reference
   */
  setToSVGMatrix( svgMatrix ) {
    return this.rowMajor(
      svgMatrix.a, svgMatrix.c, svgMatrix.e,
      svgMatrix.b, svgMatrix.d, svgMatrix.f,
      0, 0, 1,
      Types.AFFINE );
  }

  /**
   * Sets this matrix to a rotation matrix that rotates A to B (Vector3 instances), by rotating about the axis
   * A.cross( B ) -- Shortest path. ideally should be unit vectors.
   * @public
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Matrix3} - Self reference
   */
  setRotationAToB( a, b ) {
    // see http://graphics.cs.brown.edu/~jfh/papers/Moller-EBA-1999/paper.pdf for information on this implementation
    const start = a;
    const end = b;

    const epsilon = 0.0001;

    let v = start.cross( end );
    const e = start.dot( end );
    const f = ( e < 0 ) ? -e : e;

    // if "from" and "to" vectors are nearly parallel
    if ( f > 1.0 - epsilon ) {
      let x = new Vector3(
        ( start.x > 0.0 ) ? start.x : -start.x,
        ( start.y > 0.0 ) ? start.y : -start.y,
        ( start.z > 0.0 ) ? start.z : -start.z
      );

      if ( x.x < x.y ) {
        if ( x.x < x.z ) {
          x = Vector3.X_UNIT;
        }
        else {
          x = Vector3.Z_UNIT;
        }
      }
      else {
        if ( x.y < x.z ) {
          x = Vector3.Y_UNIT;
        }
        else {
          x = Vector3.Z_UNIT;
        }
      }

      const u = x.minus( start );
      v = x.minus( end );

      const c1 = 2.0 / u.dot( u );
      const c2 = 2.0 / v.dot( v );
      const c3 = c1 * c2 * u.dot( v );

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
      const h = 1.0 / ( 1.0 + e );
      const hvx = h * v.x;
      const hvz = h * v.z;
      const hvxy = hvx * v.y;
      const hvxz = hvx * v.z;
      const hvyz = hvz * v.y;

      return this.rowMajor(
        e + hvx * v.x, hvxy - v.z, hvxz + v.y,
        hvxy + v.z, e + h * v.y * v.y, hvyz - v.x,
        hvxz - v.y, hvyz + v.x, e + hvz * v.z
      );
    }
  }

  /*---------------------------------------------------------------------------*
   * Mutable operations (changes the parameter)
   *----------------------------------------------------------------------------*/

  /**
   * Sets the vector to the result of (matrix * vector), as a homogeneous multiplicatino.
   * @public
   *
   * @param {Vector2} vector2
   * @returns {Vector2} - The vector that was mutated
   */
  multiplyVector2( vector2 ) {
    return vector2.setXY(
      this.m00() * vector2.x + this.m01() * vector2.y + this.m02(),
      this.m10() * vector2.x + this.m11() * vector2.y + this.m12() );
  }

  /**
   * Sets the vector to the result of (matrix * vector).
   * @public
   *
   * @param {Vector3} vector3
   * @returns {Vector3} - The vector that was mutated
   */
  multiplyVector3( vector3 ) {
    return vector3.setXYZ(
      this.m00() * vector3.x + this.m01() * vector3.y + this.m02() * vector3.z,
      this.m10() * vector3.x + this.m11() * vector3.y + this.m12() * vector3.z,
      this.m20() * vector3.x + this.m21() * vector3.y + this.m22() * vector3.z );
  }

  /**
   * Sets the vector to the result of (transpose(matrix) * vector), ignoring the translation parameters.
   * @public
   *
   * @param {Vector2} vector2
   * @returns {Vector2} - The vector that was mutated
   */
  multiplyTransposeVector2( v ) {
    return v.setXY(
      this.m00() * v.x + this.m10() * v.y,
      this.m01() * v.x + this.m11() * v.y );
  }

  /**
   * Sets the vector to the result of (matrix * vector - matrix * zero). Since this is a homogeneous operation, it is
   * equivalent to the multiplication of (x,y,0).
   * @public
   *
   * @param {Vector2} v
   * @returns {Vector2} - The vector that was mutated
   */
  multiplyRelativeVector2( v ) {
    return v.setXY(
      this.m00() * v.x + this.m01() * v.y,
      this.m10() * v.y + this.m11() * v.y );
  }

  /**
   * Sets the transform of a Canvas 2D rendering context to the affine part of this matrix
   * @public
   *
   * @param {CanvasRenderingContext2D} context
   */
  canvasSetTransform( context ) {
    context.setTransform(
      // inlined array entries
      this.entries[ 0 ],
      this.entries[ 1 ],
      this.entries[ 3 ],
      this.entries[ 4 ],
      this.entries[ 6 ],
      this.entries[ 7 ]
    );
  }

  /**
   * Appends to the affine part of this matrix to the Canvas 2D rendering context
   * @public
   *
   * @param {CanvasRenderingContext2D} context
   */
  canvasAppendTransform( context ) {
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
  }

  /**
   * Copies the entries of this matrix over to an arbitrary array (typed or normal).
   * @public
   *
   * @param {Array|Float32Array|Float64Array} array
   * @returns {Array|Float32Array|Float64Array} - Returned for chaining
   */
  copyToArray( array ) {
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

  /**
   * Returns an identity matrix.
   * @public
   *
   * @returns {Matrix3}
   */
  static identity() {
    return Matrix3.dirtyFromPool().setToIdentity();
  }

  /**
   * Returns a translation matrix.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {Matrix3}
   */
  static translation( x, y ) {
    return Matrix3.dirtyFromPool().setToTranslation( x, y );
  }

  /**
   * Returns a translation matrix computed from a vector.
   * @public
   *
   * @param {Vector2|Vector3} vector
   * @returns {Matrix3}
   */
  static translationFromVector( vector ) {
    return Matrix3.translation( vector.x, vector.y );
  }

  /**
   * Returns a matrix that scales things in each dimension.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {Matrix3}
   */
  static scaling( x, y ) {
    return Matrix3.dirtyFromPool().setToScale( x, y );
  }

  /**
   * Returns a matrix that scales things in each dimension.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @returns {Matrix3}
   */
  static scale( x, y ) {
    return Matrix3.scaling( x, y );
  }

  /**
   * Returns an affine matrix with the given parameters.
   * @public
   *
   * @param {number} m00
   * @param {number} m01
   * @param {number} m02
   * @param {number} m10
   * @param {number} m11
   * @param {number} m12
   * @returns {Matrix3}
   */
  static affine( m00, m01, m02, m10, m11, m12 ) {
    return Matrix3.dirtyFromPool().setToAffine( m00, m01, m02, m10, m11, m12 );
  }

  /**
   * Creates a new matrix with all of the entries determined in row-major order.
   * @public
   *
   * @param {number} v00
   * @param {number} v01
   * @param {number} v02
   * @param {number} v10
   * @param {number} v11
   * @param {number} v12
   * @param {number} v20
   * @param {number} v21
   * @param {number} v22
   * @param {Matrix3.Types|undefined} [type]
   */
  static rowMajor( v00, v01, v02, v10, v11, v12, v20, v21, v22, type ) {
    return Matrix3.dirtyFromPool().rowMajor(
      v00, v01, v02,
      v10, v11, v12,
      v20, v21, v22,
      type
    );
  }

  /**
   * Returns a matrix rotation defined by a rotation of the specified angle around the given unit axis.
   * @public
   *
   * @param {Vector3} axis - normalized
   * @param {number} angle - in radians
   * @returns {Matrix3}
   */
  static rotationAxisAngle( axis, angle ) {
    return Matrix3.dirtyFromPool().setToRotationAxisAngle( axis, angle );
  }

  /**
   * Returns a matrix that rotates around the x axis (in the yz plane).
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix3}
   */
  static rotationX( angle ) {
    return Matrix3.dirtyFromPool().setToRotationX( angle );
  }

  /**
   * Returns a matrix that rotates around the y axis (in the xz plane).
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix3}
   */
  static rotationY( angle ) {
    return Matrix3.dirtyFromPool().setToRotationY( angle );
  }

  /**
   * Returns a matrix that rotates around the z axis (in the xy plane).
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix3}
   */
  static rotationZ( angle ) {
    return Matrix3.dirtyFromPool().setToRotationZ( angle );
  }

  /**
   * Returns a combined 2d translation + rotation (with the rotation effectively applied first).
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} angle - in radians
   * @returns {Matrix3}
   */
  static translationRotation( x, y, angle ) {
    return Matrix3.dirtyFromPool().setToTranslationRotation( x, y, angle );
  }

  /**
   * Standard 2d rotation matrix for a given angle.
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix3}
   */
  static rotation2( angle ) {
    return Matrix3.dirtyFromPool().setToRotationZ( angle );
  }

  /**
   * Returns a matrix which will be a 2d rotation around a given x,y point.
   * @public
   *
   * @param {number} angle - in radians
   * @param {number} x
   * @param {number} y
   * @returns {Matrix3}
   */
  static rotationAround( angle, x, y ) {
    return Matrix3.translation( x, y ).timesMatrix( Matrix3.rotation2( angle ) ).timesMatrix( Matrix3.translation( -x, -y ) );
  }

  /**
   * Returns a matrix which will be a 2d rotation around a given 2d point.
   * @public
   *
   * @param {number} angle - in radians
   * @param {Vector2} point
   * @returns {Matrix3}
   */
  static rotationAroundPoint( angle, point ) {
    return Matrix3.rotationAround( angle, point.x, point.y );
  }

  /**
   * Returns a matrix equivalent to a given SVGMatrix.
   * @public
   *
   * @param {SVGMatrix} svgMatrix
   * @returns {Matrix3}
   */
  static fromSVGMatrix( svgMatrix ) {
    return Matrix3.dirtyFromPool().setToSVGMatrix( svgMatrix );
  }

  /**
   * Returns a rotation matrix that rotates A to B, by rotating about the axis A.cross( B ) -- Shortest path. ideally
   * should be unit vectors.
   * @public
   *
   * @param {Vector3} a
   * @param {Vector3} b
   * @returns {Matrix3}
   */
  static rotateAToB( a, b ) {
    return Matrix3.dirtyFromPool().setRotationAToB( a, b );
  }

  /**
   * Shortcut for translation times a matrix (without allocating a translation matrix), see scenery#119
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {Matrix3} matrix
   * @returns {Matrix3}
   */
  static translationTimesMatrix( x, y, matrix ) {
    let type;
    if ( matrix.type === Types.IDENTITY || matrix.type === Types.TRANSLATION_2D ) {
      return Matrix3.createFromPool(
        1, 0, matrix.m02() + x,
        0, 1, matrix.m12() + y,
        0, 0, 1,
        Types.TRANSLATION_2D );
    }
    else if ( matrix.type === Types.OTHER ) {
      type = Types.OTHER;
    }
    else {
      type = Types.AFFINE;
    }
    return Matrix3.createFromPool(
      matrix.m00(), matrix.m01(), matrix.m02() + x,
      matrix.m10(), matrix.m11(), matrix.m12() + y,
      matrix.m20(), matrix.m21(), matrix.m22(),
      type );
  }

  /**
   * Serialize to an Object that can be handled by PhET-iO
   * @public
   *
   * @param {Matrix3} matrix3
   * @returns {Object}
   */
  static toStateObject( matrix3 ) {
    return {
      entries: matrix3.entries,
      type: matrix3.type.name
    };
  }

  /**
   * Convert back from a serialized Object to a Matrix3
   * @public
   *
   * @param {Object} stateObject
   * @returns {Matrix3}
   */
  static fromStateObject( stateObject ) {
    const matrix = Matrix3.identity();
    matrix.entries = stateObject.entries;
    matrix.type = Types[ stateObject.type ];
    return matrix;
  }
}

const Types = Enumeration.byKeys( [
  'OTHER',
  'IDENTITY',
  'TRANSLATION_2D',
  'SCALING',
  'AFFINE'
] );

// @public {Enumeration}
Matrix3.Types = Types;

Poolable.mixInto( Matrix3, {
  initialize: Matrix3.prototype.rowMajor,
  useDefaultConstruction: true,
  maxSize: 300
} );

// @public {Matrix3}
Matrix3.IDENTITY = Matrix3.identity().makeImmutable();
Matrix3.X_REFLECTION = Matrix3.createFromPool(
  -1, 0, 0,
  0, 1, 0,
  0, 0, 1,
  Types.AFFINE
).makeImmutable();
Matrix3.Y_REFLECTION = Matrix3.createFromPool(
  1, 0, 0,
  0, -1, 0,
  0, 0, 1,
  Types.AFFINE
).makeImmutable();

Matrix3.Matrix3IO = new IOType( 'Matrix3IO', {
  valueType: Matrix3,
  documentation: 'A 3x3 matrix often used for holding transform data.',
  toStateObject: matrix3 => Matrix3.toStateObject( matrix3 ),
  fromStateObject: Matrix3.fromStateObject,
  stateSchema: {
    entries: ArrayIO( NumberIO ),
    type: EnumerationIO( Types )
  }
} );

dot.register( 'Matrix3', Matrix3 );
export default Matrix3;