// Copyright 2013-2025, University of Colorado Boulder

/**
 * 4-dimensional Matrix
 *
 * TODO: consider adding affine flag if it will help performance (a la Matrix3) https://github.com/phetsims/dot/issues/96
 * TODO: get rotation angles
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

/* eslint-disable phet/bad-sim-text */

import Enumeration from '../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../phet-core/js/EnumerationValue.js';
import dot from './dot.js';
import Vector3 from './Vector3.js';
import Vector4 from './Vector4.js';

const Float32Array = window.Float32Array || Array;

export class Types extends EnumerationValue {
  public static readonly OTHER = new Types();
  public static readonly IDENTITY = new Types();
  public static readonly TRANSLATION_3D = new Types();
  public static readonly SCALING = new Types();
  public static readonly AFFINE = new Types();

  public static readonly enumeration = new Enumeration( Types );
}

export default class Matrix4 {

  // Entries stored in column-major format
  public entries: Float32Array;

  public type: Types;

  /**
   * @param v00
   * @param v01
   * @param v02
   * @param v03
   * @param v10
   * @param v11
   * @param v12
   * @param v13
   * @param v20
   * @param v21
   * @param v22
   * @param v23
   * @param v30
   * @param v31
   * @param v32
   * @param v33
   * @param type
   */
  public constructor( v00?: number, v01?: number, v02?: number, v03?: number, v10?: number, v11?: number, v12?: number, v13?: number,
                      v20?: number, v21?: number, v22?: number, v23?: number, v30?: number, v31?: number, v32?: number, v33?: number,
                      type?: Types ) {

    this.entries = new Float32Array( 16 );

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
   *
   * @param v00
   * @param v01
   * @param v02
   * @param v03
   * @param v10
   * @param v11
   * @param v12
   * @param v13
   * @param v20
   * @param v21
   * @param v22
   * @param v23
   * @param v30
   * @param v31
   * @param v32
   * @param v33
   * @param type
   * @returns - Self reference
   */
  public rowMajor( v00: number, v01: number, v02: number, v03: number,
                   v10: number, v11: number, v12: number, v13: number,
                   v20: number, v21: number, v22: number, v23: number,
                   v30: number, v31: number, v32: number, v33: number,
                   type?: Types ): this {
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

    // TODO: consider performance of the affine check here https://github.com/phetsims/dot/issues/96
    this.type = type === undefined ? ( ( v30 === 0 && v31 === 0 && v32 === 0 && v33 === 1 ) ? Types.AFFINE : Types.OTHER ) : type;
    return this;
  }

  /**
   * Sets all entries of the matrix in column-major order.
   *
   * @param v00
   * @param v10
   * @param v20
   * @param v30
   * @param v01
   * @param v11
   * @param v21
   * @param v31
   * @param v02
   * @param v12
   * @param v22
   * @param v32
   * @param v03
   * @param v13
   * @param v23
   * @param v33
   * @param type
   * @returns - Self reference
   */
  public columnMajor( v00: number, v10: number, v20: number, v30: number,
                      v01: number, v11: number, v21: number, v31: number,
                      v02: number, v12: number, v22: number, v32: number,
                      v03: number, v13: number, v23: number, v33: number,
                      type?: Types ): this {
    return this.rowMajor( v00, v01, v02, v03, v10, v11, v12, v13, v20, v21, v22, v23, v30, v31, v32, v33, type );
  }

  /**
   * Sets this matrix to the value of the passed-in matrix.
   *
   * @param matrix
   * @returns - Self reference
   */
  public set( matrix: Matrix4 ): this {
    return this.rowMajor(
      matrix.m00(), matrix.m01(), matrix.m02(), matrix.m03(),
      matrix.m10(), matrix.m11(), matrix.m12(), matrix.m13(),
      matrix.m20(), matrix.m21(), matrix.m22(), matrix.m23(),
      matrix.m30(), matrix.m31(), matrix.m32(), matrix.m33(),
      matrix.type );
  }

  /**
   * Returns the 0,0 entry of this matrix.
   */
  public m00(): number {
    return this.entries[ 0 ];
  }

  /**
   * Returns the 0,1 entry of this matrix.
   */
  public m01(): number {
    return this.entries[ 4 ];
  }

  /**
   * Returns the 0,2 entry of this matrix.
   */
  public m02(): number {
    return this.entries[ 8 ];
  }

  /**
   * Returns the 0,3 entry of this matrix.
   */
  public m03(): number {
    return this.entries[ 12 ];
  }

  /**
   * Returns the 1,0 entry of this matrix.
   */
  public m10(): number {
    return this.entries[ 1 ];
  }

  /**
   * Returns the 1,1 entry of this matrix.
   */
  public m11(): number {
    return this.entries[ 5 ];
  }

  /**
   * Returns the 1,2 entry of this matrix.
   */
  public m12(): number {
    return this.entries[ 9 ];
  }

  /**
   * Returns the 1,3 entry of this matrix.
   */
  public m13(): number {
    return this.entries[ 13 ];
  }

  /**
   * Returns the 2,0 entry of this matrix.
   */
  public m20(): number {
    return this.entries[ 2 ];
  }

  /**
   * Returns the 2,1 entry of this matrix.
   */
  public m21(): number {
    return this.entries[ 6 ];
  }

  /**
   * Returns the 2,2 entry of this matrix.
   */
  public m22(): number {
    return this.entries[ 10 ];
  }

  /**
   * Returns the 2,3 entry of this matrix.
   */
  public m23(): number {
    return this.entries[ 14 ];
  }

  /**
   * Returns the 3,0 entry of this matrix.
   */
  public m30(): number {
    return this.entries[ 3 ];
  }

  /**
   * Returns the 3,1 entry of this matrix.
   */
  public m31(): number {
    return this.entries[ 7 ];
  }

  /**
   * Returns the 3,2 entry of this matrix.
   */
  public m32(): number {
    return this.entries[ 11 ];
  }

  /**
   * Returns the 3,3 entry of this matrix.
   */
  public m33(): number {
    return this.entries[ 15 ];
  }

  /**
   * Returns whether this matrix is an identity matrix.
   */
  public isIdentity(): boolean {
    return this.type === Types.IDENTITY || this.equals( Matrix4.IDENTITY );
  }

  /**
   * Returns whether all of this matrix's entries are finite (non-infinite and non-NaN).
   */
  public isFinite(): boolean {
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
   */
  public getTranslation(): Vector3 {
    return new Vector3( this.m03(), this.m13(), this.m23() );
  }

  public get translation(): Vector3 { return this.getTranslation(); }

  /**
   * Returns a vector that is equivalent to ( T(1,0,0).magnitude, T(0,1,0).magnitude, T(0,0,1).magnitude )
   * where T is a relative transform.
   */
  public getScaleVector(): Vector3 {
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

  public get scaleVector(): Vector3 { return this.getScaleVector(); }

  /**
   * Returns the CSS transform string for the associated homogeneous 3d transformation.
   */
  public getCSSTransform(): string {
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

  public get cssTransform(): string { return this.getCSSTransform(); }

  /**
   * Returns exact equality with another matrix
   *
   * @param matrix
   */
  public equals( matrix: Matrix4 ): boolean {
    return this.m00() === matrix.m00() && this.m01() === matrix.m01() && this.m02() === matrix.m02() && this.m03() === matrix.m03() &&
           this.m10() === matrix.m10() && this.m11() === matrix.m11() && this.m12() === matrix.m12() && this.m13() === matrix.m13() &&
           this.m20() === matrix.m20() && this.m21() === matrix.m21() && this.m22() === matrix.m22() && this.m23() === matrix.m23() &&
           this.m30() === matrix.m30() && this.m31() === matrix.m31() && this.m32() === matrix.m32() && this.m33() === matrix.m33();
  }

  /**
   * Returns equality within a margin of error with another matrix
   *
   * @param matrix
   * @param epsilon
   */
  public equalsEpsilon( matrix: Matrix4, epsilon: number ): boolean {
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
   */
  public copy(): Matrix4 {
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
   *
   * @param matrix
   */
  public plus( matrix: Matrix4 ): Matrix4 {
    return new Matrix4(
      this.m00() + matrix.m00(), this.m01() + matrix.m01(), this.m02() + matrix.m02(), this.m03() + matrix.m03(),
      this.m10() + matrix.m10(), this.m11() + matrix.m11(), this.m12() + matrix.m12(), this.m13() + matrix.m13(),
      this.m20() + matrix.m20(), this.m21() + matrix.m21(), this.m22() + matrix.m22(), this.m23() + matrix.m23(),
      this.m30() + matrix.m30(), this.m31() + matrix.m31(), this.m32() + matrix.m32(), this.m33() + matrix.m33()
    );
  }

  /**
   * Returns a new matrix, defined by this matrix plus the provided matrix
   *
   * @param matrix
   */
  public minus( matrix: Matrix4 ): Matrix4 {
    return new Matrix4(
      this.m00() - matrix.m00(), this.m01() - matrix.m01(), this.m02() - matrix.m02(), this.m03() - matrix.m03(),
      this.m10() - matrix.m10(), this.m11() - matrix.m11(), this.m12() - matrix.m12(), this.m13() - matrix.m13(),
      this.m20() - matrix.m20(), this.m21() - matrix.m21(), this.m22() - matrix.m22(), this.m23() - matrix.m23(),
      this.m30() - matrix.m30(), this.m31() - matrix.m31(), this.m32() - matrix.m32(), this.m33() - matrix.m33()
    );
  }

  /**
   * Returns a transposed copy of this matrix
   */
  public transposed(): Matrix4 {
    return new Matrix4(
      this.m00(), this.m10(), this.m20(), this.m30(),
      this.m01(), this.m11(), this.m21(), this.m31(),
      this.m02(), this.m12(), this.m22(), this.m32(),
      this.m03(), this.m13(), this.m23(), this.m33() );
  }

  /**
   * Returns a negated copy of this matrix
   */
  public negated(): Matrix4 {
    return new Matrix4(
      -this.m00(), -this.m01(), -this.m02(), -this.m03(),
      -this.m10(), -this.m11(), -this.m12(), -this.m13(),
      -this.m20(), -this.m21(), -this.m22(), -this.m23(),
      -this.m30(), -this.m31(), -this.m32(), -this.m33() );
  }

  /**
   * Returns an inverted copy of this matrix
   */
  public inverted(): Matrix4 {
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
   *
   * @param matrix
   * @returns - NOTE: this may be the same matrix!
   */
  public timesMatrix( matrix: Matrix4 ): Matrix4 {
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
   *
   * @param vector4
   */
  public timesVector4( vector4: Vector4 ): Vector4 {
    const x = this.m00() * vector4.x + this.m01() * vector4.y + this.m02() * vector4.z + this.m03() * vector4.w;
    const y = this.m10() * vector4.x + this.m11() * vector4.y + this.m12() * vector4.z + this.m13() * vector4.w;
    const z = this.m20() * vector4.x + this.m21() * vector4.y + this.m22() * vector4.z + this.m23() * vector4.w;
    const w = this.m30() * vector4.x + this.m31() * vector4.y + this.m32() * vector4.z + this.m33() * vector4.w;
    return new Vector4( x, y, z, w );
  }

  /**
   * Returns the multiplication of this matrix times the provided vector (treating this matrix as homogeneous, so that
   * it is the technical multiplication of (x,y,z,1)).
   *
   * @param vector3
   */
  public timesVector3( vector3: Vector3 ): Vector3 {
    return Vector3.from( this.timesVector4( Vector4.from( vector3 ) ) );
  }

  /**
   * Returns the multiplication of this matrix's transpose times the provided vector
   *
   * @param vector4
   */
  public timesTransposeVector4( vector4: Vector4 ): Vector4 {
    const x = this.m00() * vector4.x + this.m10() * vector4.y + this.m20() * vector4.z + this.m30() * vector4.w;
    const y = this.m01() * vector4.x + this.m11() * vector4.y + this.m21() * vector4.z + this.m31() * vector4.w;
    const z = this.m02() * vector4.x + this.m12() * vector4.y + this.m22() * vector4.z + this.m32() * vector4.w;
    const w = this.m03() * vector4.x + this.m13() * vector4.y + this.m23() * vector4.z + this.m33() * vector4.w;
    return new Vector4( x, y, z, w );
  }

  /**
   * Returns the multiplication of this matrix's transpose times the provided vector (homogeneous).
   *
   * @param vector3
   */
  public timesTransposeVector3( vector3: Vector3 ): Vector3 {
    return Vector3.from( this.timesTransposeVector4( Vector4.from( vector3 ) ) );
  }

  /**
   * Equivalent to the multiplication of (x,y,z,0), ignoring the homogeneous part.
   *
   * @param vector3
   */
  public timesRelativeVector3( vector3: Vector3 ): Vector3 {
    const x = this.m00() * vector3.x + this.m10() * vector3.y + this.m20() * vector3.z;
    const y = this.m01() * vector3.y + this.m11() * vector3.y + this.m21() * vector3.z;
    const z = this.m02() * vector3.z + this.m12() * vector3.y + this.m22() * vector3.z;
    return new Vector3( x, y, z );
  }

  /**
   * Returns the determinant of this matrix.
   */
  public getDeterminant(): number {
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

  public get determinant(): number { return this.getDeterminant(); }

  /**
   * Returns a string form of this object
   */
  public toString(): string {
    return `${this.m00()} ${this.m01()} ${this.m02()} ${this.m03()}\n${
      this.m10()} ${this.m11()} ${this.m12()} ${this.m13()}\n${
      this.m20()} ${this.m21()} ${this.m22()} ${this.m23()}\n${
      this.m30()} ${this.m31()} ${this.m32()} ${this.m33()}`;
  }

  /**
   * Makes this matrix effectively immutable to the normal methods (except direct setters?)
   *
   * @returns - Self reference
   */
  public makeImmutable(): this {
    if ( assert ) {
      this.rowMajor = () => {
        throw new Error( 'Cannot modify immutable matrix' );
      };
    }
    return this;
  }

  /**
   * Copies the entries of this matrix over to an arbitrary array (typed or normal).
   *
   * @param array
   * @returns - Returned for chaining
   */
  public copyToArray( array: number[] | Float32Array | Float64Array ): number[] | Float32Array | Float64Array {
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
   */
  public static identity(): Matrix4 {
    return new Matrix4(
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1,
      Types.IDENTITY );
  }

  /**
   * Returns a translation matrix.
   *
   * @param x
   * @param y
   * @param z
   */
  public static translation( x: number, y: number, z: number ): Matrix4 {
    return new Matrix4(
      1, 0, 0, x,
      0, 1, 0, y,
      0, 0, 1, z,
      0, 0, 0, 1,
      Types.TRANSLATION_3D );
  }

  /**
   * Returns a translation matrix computed from a vector.
   *
   * @param vector
   */
  public static translationFromVector( vector: Vector3 | Vector4 ): Matrix4 {
    return Matrix4.translation( vector.x, vector.y, vector.z );
  }

  /**
   * Returns a matrix that scales things in each dimension.
   *
   * @param x
   * @param y
   * @param z
   */
  public static scaling( x: number, y?: number, z?: number ): Matrix4 {
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
   *
   * @param axis - normalized
   * @param angle - in radians
   */
  public static rotationAxisAngle( axis: Vector3, angle: number ): Matrix4 {
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

  // TODO: add in rotation from quaternion, and from quat + translation https://github.com/phetsims/dot/issues/96


  /**
   * Returns a rotation matrix in the yz plane.
   *
   * @param angle - in radians
   */
  public static rotationX( angle: number ): Matrix4 {
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
   *
   * @param angle - in radians
   */
  public static rotationY( angle: number ): Matrix4 {
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
   *
   * @param angle - in radians
   */
  public static rotationZ( angle: number ): Matrix4 {
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
   *
   * @param fovYRadians
   * @param aspect - aspect === width / height
   * @param zNear
   * @param zFar
   */
  public static gluPerspective( fovYRadians: number, aspect: number, zNear: number, zFar: number ): Matrix4 {
    const cotangent = Math.cos( fovYRadians ) / Math.sin( fovYRadians );

    return new Matrix4(
      cotangent / aspect, 0, 0, 0,
      0, cotangent, 0, 0,
      0, 0, ( zFar + zNear ) / ( zNear - zFar ), ( 2 * zFar * zNear ) / ( zNear - zFar ),
      0, 0, -1, 0 );
  }

  public static readonly IDENTITY: Matrix4 = new Matrix4().makeImmutable();

  public static readonly Types = Types;
}

dot.register( 'Matrix4', Matrix4 );