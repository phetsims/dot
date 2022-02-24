// Copyright 2013-2022, University of Colorado Boulder

/**
 * 4-dimensional Matrix
 *
 * TODO: consider adding affine flag if it will help performance (a la Matrix3)
 * TODO: get rotation angles
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

/* eslint-disable bad-sim-text */

import EnumerationDeprecated from '../../phet-core/js/EnumerationDeprecated.js';
import dot from './dot.js';
import Vector3 from './Vector3.js';
import Vector4 from './Vector4.js';

const Float32Array = window.Float32Array || Array;

class Matrix4 {
  /**
   * @param {number} [v00]
   * @param {number} [v01]
   * @param {number} [v02]
   * @param {number} [v03]
   * @param {number} [v10]
   * @param {number} [v11]
   * @param {number} [v12]
   * @param {number} [v13]
   * @param {number} [v20]
   * @param {number} [v21]
   * @param {number} [v22]
   * @param {number} [v23]
   * @param {number} [v30]
   * @param {number} [v31]
   * @param {number} [v32]
   * @param {number} [v33]
   * @param {Matrix4.Types|undefined} [type]
   */
  constructor( v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, type ) {

    // @public {Float32Array} - entries stored in column-major format
    this.entries = new Float32Array( 16 );

    // @public {Matrix4.Types}
    this.type = Types.OTHER; // will be set by rowMajor

    this.rowMajor(
      v00 !== undefined ? v00 : 1, v01 !== undefined ? v01 : 0, v02 !== undefined ? v02 : 0, v03 !== undefined ? v03 : 0,
      v10 !== undefined ? v10 : 0, v11 !== undefined ? v11 : 1, v12 !== undefined ? v12 : 0, v13 !== undefined ? v13 : 0,
      v20 !== undefined ? v20 : 0, v21 !== undefined ? v21 : 0, v22 !== undefined ? v22 : 1, v23 !== undefined ? v23 : 0,
      v30 !== undefined ? v30 : 0, v31 !== undefined ? v31 : 0, v32 !== undefined ? v32 : 0, v33 !== undefined ? v33 : 1,
      type );
  }

  /**
   * Sets all entries of the matrix in row-major order.
   * @public
   *
   * @param {number} v00
   * @param {number} v01
   * @param {number} v02
   * @param {number} v03
   * @param {number} v10
   * @param {number} v11
   * @param {number} v12
   * @param {number} v13
   * @param {number} v20
   * @param {number} v21
   * @param {number} v22
   * @param {number} v23
   * @param {number} v30
   * @param {number} v31
   * @param {number} v32
   * @param {number} v33
   * @param {Matrix4.Types|undefined} [type]
   * @returns {Matrix4} - Self reference
   */
  rowMajor( v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, type ) {
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
  }

  /**
   * Sets all entries of the matrix in column-major order.
   * @public
   *
   * @param {*} v00
   * @param {*} v10
   * @param {*} v20
   * @param {*} v30
   * @param {*} v01
   * @param {*} v11
   * @param {*} v21
   * @param {*} v31
   * @param {*} v02
   * @param {*} v12
   * @param {*} v22
   * @param {*} v32
   * @param {*} v03
   * @param {*} v13
   * @param {*} v23
   * @param {*} v33
   * @param {Matrix4.Types|undefined} [type]
   * @returns {Matrix4} - Self reference
   */
  columnMajor( v00, v10, v20, v30, v01, v11, v21, v31, v02, v12, v22, v32, v03, v13, v23, v33, type ) {
    return this.rowMajor( v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, type );
  }

  /**
   * Sets this matrix to the value of the passed-in matrix.
   * @public
   *
   * @param {Matrix4} matrix
   * @returns {Matrix4} - Self reference
   */
  set( matrix ) {
    return this.rowMajor(
      matrix.m00(), matrix.m01(), matrix.m02(), matrix.m03(),
      matrix.m10(), matrix.m11(), matrix.m12(), matrix.m13(),
      matrix.m20(), matrix.m21(), matrix.m22(), matrix.m23(),
      matrix.m30(), matrix.m31(), matrix.m32(), matrix.m33(),
      matrix.type );
  }

  /**
   * Returns the 0,0 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m00() {
    return this.entries[ 0 ];
  }

  /**
   * Returns the 0,1 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m01() {
    return this.entries[ 4 ];
  }

  /**
   * Returns the 0,2 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m02() {
    return this.entries[ 8 ];
  }

  /**
   * Returns the 0,3 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m03() {
    return this.entries[ 12 ];
  }

  /**
   * Returns the 1,0 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m10() {
    return this.entries[ 1 ];
  }

  /**
   * Returns the 1,1 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m11() {
    return this.entries[ 5 ];
  }

  /**
   * Returns the 1,2 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m12() {
    return this.entries[ 9 ];
  }

  /**
   * Returns the 1,3 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m13() {
    return this.entries[ 13 ];
  }

  /**
   * Returns the 2,0 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m20() {
    return this.entries[ 2 ];
  }

  /**
   * Returns the 2,1 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m21() {
    return this.entries[ 6 ];
  }

  /**
   * Returns the 2,2 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m22() {
    return this.entries[ 10 ];
  }

  /**
   * Returns the 2,3 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m23() {
    return this.entries[ 14 ];
  }

  /**
   * Returns the 3,0 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m30() {
    return this.entries[ 3 ];
  }

  /**
   * Returns the 3,1 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m31() {
    return this.entries[ 7 ];
  }

  /**
   * Returns the 3,2 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m32() {
    return this.entries[ 11 ];
  }

  /**
   * Returns the 3,3 entry of this matrix.
   * @public
   *
   * @returns {number}
   */
  m33() {
    return this.entries[ 15 ];
  }

  /**
   * Returns whether all of this matrix's entries are finite (non-infinite and non-NaN).
   * @public
   *
   * @returns {boolean}
   */
  isFinite() {
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
  }

  /**
   * Returns the 3D translation, assuming multiplication with a homogeneous vector.
   * @public
   *
   * @returns {Vector3}
   */
  getTranslation() {
    return new Vector3( this.m03(), this.m13(), this.m23() );
  }

  get translation() { return this.getTranslation(); }

  /**
   * Returns a vector that is equivalent to ( T(1,0,0).magnitude, T(0,1,0).magnitude, T(0,0,1).magnitude )
   * where T is a relative transform.
   * @public
   *
   * @returns {Vector3}
   */
  getScaleVector() {
    const m0003 = this.m00() + this.m03();
    const m1013 = this.m10() + this.m13();
    const m2023 = this.m20() + this.m23();
    const m3033 = this.m30() + this.m33();
    const m0103 = this.m01() + this.m03();
    const m1113 = this.m11() + this.m13();
    const m2123 = this.m21() + this.m23();
    const m3133 = this.m31() + this.m33();
    const m0203 = this.m02() + this.m03();
    const m1213 = this.m12() + this.m13();
    const m2223 = this.m22() + this.m23();
    const m3233 = this.m32() + this.m33();
    return new Vector3(
      Math.sqrt( m0003 * m0003 + m1013 * m1013 + m2023 * m2023 + m3033 * m3033 ),
      Math.sqrt( m0103 * m0103 + m1113 * m1113 + m2123 * m2123 + m3133 * m3133 ),
      Math.sqrt( m0203 * m0203 + m1213 * m1213 + m2223 * m2223 + m3233 * m3233 ) );
  }

  get scaleVector() { return this.getScaleVector(); }

  /**
   * Returns the CSS transform string for the associated homogeneous 3d transformation.
   * @public
   *
   * @returns {string}
   */
  getCSSTransform() {
    // See http://www.w3.org/TR/css3-transforms/, particularly Section 13 that discusses the SVG compatibility

    // the inner part of a CSS3 transform, but remember to add the browser-specific parts!
    // NOTE: the toFixed calls are inlined for performance reasons
    return `matrix3d(${
      this.entries[ 0 ].toFixed( 20 )},${
      this.entries[ 1 ].toFixed( 20 )},${
      this.entries[ 2 ].toFixed( 20 )},${
      this.entries[ 3 ].toFixed( 20 )},${
      this.entries[ 4 ].toFixed( 20 )},${
      this.entries[ 5 ].toFixed( 20 )},${
      this.entries[ 6 ].toFixed( 20 )},${
      this.entries[ 7 ].toFixed( 20 )},${
      this.entries[ 8 ].toFixed( 20 )},${
      this.entries[ 9 ].toFixed( 20 )},${
      this.entries[ 10 ].toFixed( 20 )},${
      this.entries[ 11 ].toFixed( 20 )},${
      this.entries[ 12 ].toFixed( 20 )},${
      this.entries[ 13 ].toFixed( 20 )},${
      this.entries[ 14 ].toFixed( 20 )},${
      this.entries[ 15 ].toFixed( 20 )})`;
  }

  get cssTransform() { return this.getCSSTransform(); }

  /**
   * Returns exact equality with another matrix
   * @public
   *
   * @param {Matrix4} matrix
   * @returns {boolean}
   */
  equals( matrix ) {
    return this.m00() === matrix.m00() && this.m01() === matrix.m01() && this.m02() === matrix.m02() && this.m03() === matrix.m03() &&
           this.m10() === matrix.m10() && this.m11() === matrix.m11() && this.m12() === matrix.m12() && this.m13() === matrix.m13() &&
           this.m20() === matrix.m20() && this.m21() === matrix.m21() && this.m22() === matrix.m22() && this.m23() === matrix.m23() &&
           this.m30() === matrix.m30() && this.m31() === matrix.m31() && this.m32() === matrix.m32() && this.m33() === matrix.m33();
  }

  /**
   * Returns equality within a margin of error with another matrix
   * @public
   *
   * @param {Matrix4} matrix
   * @param {number} epsilon
   * @returns {boolean}
   */
  equalsEpsilon( matrix, epsilon ) {
    return Math.abs( this.m00() - matrix.m00() ) < epsilon &&
           Math.abs( this.m01() - matrix.m01() ) < epsilon &&
           Math.abs( this.m02() - matrix.m02() ) < epsilon &&
           Math.abs( this.m03() - matrix.m03() ) < epsilon &&
           Math.abs( this.m10() - matrix.m10() ) < epsilon &&
           Math.abs( this.m11() - matrix.m11() ) < epsilon &&
           Math.abs( this.m12() - matrix.m12() ) < epsilon &&
           Math.abs( this.m13() - matrix.m13() ) < epsilon &&
           Math.abs( this.m20() - matrix.m20() ) < epsilon &&
           Math.abs( this.m21() - matrix.m21() ) < epsilon &&
           Math.abs( this.m22() - matrix.m22() ) < epsilon &&
           Math.abs( this.m23() - matrix.m23() ) < epsilon &&
           Math.abs( this.m30() - matrix.m30() ) < epsilon &&
           Math.abs( this.m31() - matrix.m31() ) < epsilon &&
           Math.abs( this.m32() - matrix.m32() ) < epsilon &&
           Math.abs( this.m33() - matrix.m33() ) < epsilon;
  }

  /*---------------------------------------------------------------------------*
   * Immutable operations (returning a new matrix)
   *----------------------------------------------------------------------------*/

  /**
   * Returns a copy of this matrix
   * @public
   *
   * @returns {Matrix4}
   */
  copy() {
    return new Matrix4(
      this.m00(), this.m01(), this.m02(), this.m03(),
      this.m10(), this.m11(), this.m12(), this.m13(),
      this.m20(), this.m21(), this.m22(), this.m23(),
      this.m30(), this.m31(), this.m32(), this.m33(),
      this.type
    );
  }

  /**
   * Returns a new matrix, defined by this matrix plus the provided matrix
   * @public
   *
   * @param {Matrix4} matrix
   * @returns {Matrix4}
   */
  plus( matrix ) {
    return new Matrix4(
      this.m00() + matrix.m00(), this.m01() + matrix.m01(), this.m02() + matrix.m02(), this.m03() + matrix.m03(),
      this.m10() + matrix.m10(), this.m11() + matrix.m11(), this.m12() + matrix.m12(), this.m13() + matrix.m13(),
      this.m20() + matrix.m20(), this.m21() + matrix.m21(), this.m22() + matrix.m22(), this.m23() + matrix.m23(),
      this.m30() + matrix.m30(), this.m31() + matrix.m31(), this.m32() + matrix.m32(), this.m33() + matrix.m33()
    );
  }

  /**
   * Returns a new matrix, defined by this matrix plus the provided matrix
   * @public
   *
   * @param {Matrix4} matrix
   * @returns {Matrix4}
   */
  minus( matrix ) {
    return new Matrix4(
      this.m00() - matrix.m00(), this.m01() - matrix.m01(), this.m02() - matrix.m02(), this.m03() - matrix.m03(),
      this.m10() - matrix.m10(), this.m11() - matrix.m11(), this.m12() - matrix.m12(), this.m13() - matrix.m13(),
      this.m20() - matrix.m20(), this.m21() - matrix.m21(), this.m22() - matrix.m22(), this.m23() - matrix.m23(),
      this.m30() - matrix.m30(), this.m31() - matrix.m31(), this.m32() - matrix.m32(), this.m33() - matrix.m33()
    );
  }

  /**
   * Returns a transposed copy of this matrix
   * @public
   *
   * @returns {Matrix4}
   */
  transposed() {
    return new Matrix4(
      this.m00(), this.m10(), this.m20(), this.m30(),
      this.m01(), this.m11(), this.m21(), this.m31(),
      this.m02(), this.m12(), this.m22(), this.m32(),
      this.m03(), this.m13(), this.m23(), this.m33() );
  }

  /**
   * Returns a negated copy of this matrix
   * @public
   *
   * @returns {Matrix3}
   */
  negated() {
    return new Matrix4(
      -this.m00(), -this.m01(), -this.m02(), -this.m03(),
      -this.m10(), -this.m11(), -this.m12(), -this.m13(),
      -this.m20(), -this.m21(), -this.m22(), -this.m23(),
      -this.m30(), -this.m31(), -this.m32(), -this.m33() );
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
        det = this.getDeterminant();
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
        throw new Error( `Matrix4.inverted with unknown type: ${this.type}` );
    }
  }

  /**
   * Returns a matrix, defined by the multiplication of this * matrix.
   * @public
   *
   * @param {Matrix4} matrix
   * @returns {Matrix4} - NOTE: this may be the same matrix!
   */
  timesMatrix( matrix ) {
    // I * M === M * I === I (the identity)
    if ( this.type === Types.IDENTITY || matrix.type === Types.IDENTITY ) {
      return this.type === Types.IDENTITY ? matrix : this;
    }

    if ( this.type === matrix.type ) {
      // currently two matrices of the same type will result in the same result type
      if ( this.type === Types.TRANSLATION_3D ) {
        // faster combination of translations
        return new Matrix4(
          1, 0, 0, this.m03() + matrix.m02(),
          0, 1, 0, this.m13() + matrix.m12(),
          0, 0, 1, this.m23() + matrix.m23(),
          0, 0, 0, 1, Types.TRANSLATION_3D );
      }
      else if ( this.type === Types.SCALING ) {
        // faster combination of scaling
        return new Matrix4(
          this.m00() * matrix.m00(), 0, 0, 0,
          0, this.m11() * matrix.m11(), 0, 0,
          0, 0, this.m22() * matrix.m22(), 0,
          0, 0, 0, 1, Types.SCALING );
      }
    }

    if ( this.type !== Types.OTHER && matrix.type !== Types.OTHER ) {
      // currently two matrices that are anything but "other" are technically affine, and the result will be affine

      // affine case
      return new Matrix4(
        this.m00() * matrix.m00() + this.m01() * matrix.m10() + this.m02() * matrix.m20(),
        this.m00() * matrix.m01() + this.m01() * matrix.m11() + this.m02() * matrix.m21(),
        this.m00() * matrix.m02() + this.m01() * matrix.m12() + this.m02() * matrix.m22(),
        this.m00() * matrix.m03() + this.m01() * matrix.m13() + this.m02() * matrix.m23() + this.m03(),
        this.m10() * matrix.m00() + this.m11() * matrix.m10() + this.m12() * matrix.m20(),
        this.m10() * matrix.m01() + this.m11() * matrix.m11() + this.m12() * matrix.m21(),
        this.m10() * matrix.m02() + this.m11() * matrix.m12() + this.m12() * matrix.m22(),
        this.m10() * matrix.m03() + this.m11() * matrix.m13() + this.m12() * matrix.m23() + this.m13(),
        this.m20() * matrix.m00() + this.m21() * matrix.m10() + this.m22() * matrix.m20(),
        this.m20() * matrix.m01() + this.m21() * matrix.m11() + this.m22() * matrix.m21(),
        this.m20() * matrix.m02() + this.m21() * matrix.m12() + this.m22() * matrix.m22(),
        this.m20() * matrix.m03() + this.m21() * matrix.m13() + this.m22() * matrix.m23() + this.m23(),
        0, 0, 0, 1, Types.AFFINE );
    }

    // general case
    return new Matrix4(
      this.m00() * matrix.m00() + this.m01() * matrix.m10() + this.m02() * matrix.m20() + this.m03() * matrix.m30(),
      this.m00() * matrix.m01() + this.m01() * matrix.m11() + this.m02() * matrix.m21() + this.m03() * matrix.m31(),
      this.m00() * matrix.m02() + this.m01() * matrix.m12() + this.m02() * matrix.m22() + this.m03() * matrix.m32(),
      this.m00() * matrix.m03() + this.m01() * matrix.m13() + this.m02() * matrix.m23() + this.m03() * matrix.m33(),
      this.m10() * matrix.m00() + this.m11() * matrix.m10() + this.m12() * matrix.m20() + this.m13() * matrix.m30(),
      this.m10() * matrix.m01() + this.m11() * matrix.m11() + this.m12() * matrix.m21() + this.m13() * matrix.m31(),
      this.m10() * matrix.m02() + this.m11() * matrix.m12() + this.m12() * matrix.m22() + this.m13() * matrix.m32(),
      this.m10() * matrix.m03() + this.m11() * matrix.m13() + this.m12() * matrix.m23() + this.m13() * matrix.m33(),
      this.m20() * matrix.m00() + this.m21() * matrix.m10() + this.m22() * matrix.m20() + this.m23() * matrix.m30(),
      this.m20() * matrix.m01() + this.m21() * matrix.m11() + this.m22() * matrix.m21() + this.m23() * matrix.m31(),
      this.m20() * matrix.m02() + this.m21() * matrix.m12() + this.m22() * matrix.m22() + this.m23() * matrix.m32(),
      this.m20() * matrix.m03() + this.m21() * matrix.m13() + this.m22() * matrix.m23() + this.m23() * matrix.m33(),
      this.m30() * matrix.m00() + this.m31() * matrix.m10() + this.m32() * matrix.m20() + this.m33() * matrix.m30(),
      this.m30() * matrix.m01() + this.m31() * matrix.m11() + this.m32() * matrix.m21() + this.m33() * matrix.m31(),
      this.m30() * matrix.m02() + this.m31() * matrix.m12() + this.m32() * matrix.m22() + this.m33() * matrix.m32(),
      this.m30() * matrix.m03() + this.m31() * matrix.m13() + this.m32() * matrix.m23() + this.m33() * matrix.m33() );
  }

  /**
   * Returns the multiplication of this matrix times the provided vector
   * @public
   *
   * @param {Vector4} vector4
   * @returns {Vector4}
   */
  timesVector4( vector4 ) {
    const x = this.m00() * vector4.x + this.m01() * vector4.y + this.m02() * vector4.z + this.m03() * vector4.w;
    const y = this.m10() * vector4.x + this.m11() * vector4.y + this.m12() * vector4.z + this.m13() * vector4.w;
    const z = this.m20() * vector4.x + this.m21() * vector4.y + this.m22() * vector4.z + this.m23() * vector4.w;
    const w = this.m30() * vector4.x + this.m31() * vector4.y + this.m32() * vector4.z + this.m33() * vector4.w;
    return new Vector4( x, y, z, w );
  }

  /**
   * Returns the multiplication of this matrix times the provided vector (treating this matrix as homogeneous, so that
   * it is the technical multiplication of (x,y,z,1)).
   * @public
   *
   * @param {Vector3} vector3
   * @returns {Vector3}
   */
  timesVector3( vector3 ) {
    return this.timesVector4( vector3.toVector4() ).toVector3();
  }

  /**
   * Returns the multiplication of this matrix's transpose times the provided vector
   * @public
   *
   * @param {Vector4} vector4
   * @returns {Vector4}
   */
  timesTransposeVector4( vector4 ) {
    const x = this.m00() * vector4.x + this.m10() * vector4.y + this.m20() * vector4.z + this.m30() * vector4.w;
    const y = this.m01() * vector4.x + this.m11() * vector4.y + this.m21() * vector4.z + this.m31() * vector4.w;
    const z = this.m02() * vector4.x + this.m12() * vector4.y + this.m22() * vector4.z + this.m32() * vector4.w;
    const w = this.m03() * vector4.x + this.m13() * vector4.y + this.m23() * vector4.z + this.m33() * vector4.w;
    return new Vector4( x, y, z, w );
  }

  /**
   * Returns the multiplication of this matrix's transpose times the provided vector (homogeneous).
   * @public
   *
   * @param {Vector3} vector3
   * @returns {Vector3}
   */
  timesTransposeVector3( vector3 ) {
    return this.timesTransposeVector4( vector3.toVector4() ).toVector3();
  }

  /**
   * Equivalent to the multiplication of (x,y,z,0), ignoring the homogeneous part.
   * @public
   *
   * @param {Vector3} vector3
   * @returns {Vector3}
   */
  timesRelativeVector3( vector3 ) {
    const x = this.m00() * vector3.x + this.m10() * vector3.y + this.m20() * vector3.z;
    const y = this.m01() * vector3.y + this.m11() * vector3.y + this.m21() * vector3.z;
    const z = this.m02() * vector3.z + this.m12() * vector3.y + this.m22() * vector3.z;
    return new Vector3( x, y, z );
  }

  /**
   * Returns the determinant of this matrix.
   * @public
   *
   * @returns {number}
   */
  getDeterminant() {
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
  }

  get determinant() { return this.getDeterminant(); }

  /**
   * Returns a string form of this object
   * @public
   *
   * @returns {string}
   */
  toString() {
    return `${this.m00()} ${this.m01()} ${this.m02()} ${this.m03()}\n${
      this.m10()} ${this.m11()} ${this.m12()} ${this.m13()}\n${
      this.m20()} ${this.m21()} ${this.m22()} ${this.m23()}\n${
      this.m30()} ${this.m31()} ${this.m32()} ${this.m33()}`;
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
    array[ 3 ] = this.m30();
    array[ 4 ] = this.m01();
    array[ 5 ] = this.m11();
    array[ 6 ] = this.m21();
    array[ 7 ] = this.m31();
    array[ 8 ] = this.m02();
    array[ 9 ] = this.m12();
    array[ 10 ] = this.m22();
    array[ 11 ] = this.m32();
    array[ 12 ] = this.m03();
    array[ 13 ] = this.m13();
    array[ 14 ] = this.m23();
    array[ 15 ] = this.m33();
    return array;
  }

  /**
   * Returns an identity matrix.
   * @public
   *
   * @returns {Matrix4}
   */
  static identity() {
    return new Matrix4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
      Types.IDENTITY );
  }

  /**
   * Returns a translation matrix.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Matrix4}
   */
  static translation( x, y, z ) {
    return new Matrix4(
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1,
      Types.TRANSLATION_3D );
  }

  /**
   * Returns a translation matrix computed from a vector.
   * @public
   *
   * @param {Vector3|Vector4} vector
   * @returns {Matrix4}
   */
  static translationFromVector( vector ) {
    return Matrix4.translation( vector.x, vector.y, vector.z );
  }

  /**
   * Returns a matrix that scales things in each dimension.
   * @public
   *
   * @param {number} x
   * @param {number} y
   * @param {number} z
   * @returns {Matrix4}
   */
  static scaling( x, y, z ) {
    // allow using one parameter to scale everything
    y = y === undefined ? x : y;
    z = z === undefined ? x : z;

    return new Matrix4(
      x, 0, 0, 0,
      0, y, 0, 0,
      0, 0, z, 0,
      0, 0, 0, 1,
      Types.SCALING );
  }

  /**
   * Returns a homogeneous matrix rotation defined by a rotation of the specified angle around the given unit axis.
   * @public
   *
   * @param {Vector3} axis - normalized
   * @param {number} angle - in radians
   * @returns {Matrix4}
   */
  static rotationAxisAngle( axis, angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );
    const C = 1 - c;

    return new Matrix4(
      axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s, 0,
      axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s, 0,
      axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c, 0,
      0, 0, 0, 1,
      Types.AFFINE );
  }

  // TODO: add in rotation from quaternion, and from quat + translation


  /**
   * Returns a rotation matrix in the yz plane.
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix4}
   */
  static rotationX( angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );

    return new Matrix4(
      1, 0, 0, 0,
      0, c, -s, 0,
      0, s, c, 0,
      0, 0, 0, 1,
      Types.AFFINE );
  }

  /**
   * Returns a rotation matrix in the xz plane.
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix4}
   */
  static rotationY( angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );

    return new Matrix4(
      c, 0, s, 0,
      0, 1, 0, 0,
      -s, 0, c, 0,
      0, 0, 0, 1,
      Types.AFFINE );
  }

  /**
   * Returns a rotation matrix in the xy plane.
   * @public
   *
   * @param {number} angle - in radians
   * @returns {Matrix4}
   */
  static rotationZ( angle ) {
    const c = Math.cos( angle );
    const s = Math.sin( angle );

    return new Matrix4(
      c, -s, 0, 0,
      s, c, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
      Types.AFFINE );
  }

  /**
   * Returns the specific perspective matrix needed for certain WebGL contexts.
   * @public
   *
   * @param {number} fovYRadians
   * @param {number} aspect - aspect === width / height
   * @param {number} zNear
   * @param {number} zFar
   * @returns {Matrix4}
   */
  static gluPerspective( fovYRadians, aspect, zNear, zFar ) {
    const cotangent = Math.cos( fovYRadians ) / Math.sin( fovYRadians );

    return new Matrix4(
      cotangent / aspect, 0, 0, 0,
      0, cotangent, 0, 0,
      0, 0, ( zFar + zNear ) / ( zNear - zFar ), ( 2 * zFar * zNear ) / ( zNear - zFar ),
      0, 0, -1, 0 );
  }
}

dot.register( 'Matrix4', Matrix4 );

const Types = EnumerationDeprecated.byKeys( [
  'OTHER',
  'IDENTITY',
  'TRANSLATION_3D',
  'SCALING',
  'AFFINE'
] );

// @public {EnumerationDeprecated}
Matrix4.Types = Types;

// @public {Matrix4}
Matrix4.IDENTITY = new Matrix4().makeImmutable();

export default Matrix4;