// Copyright 2013-2023, University of Colorado Boulder

/**
 * 3-dimensional Matrix
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import EnumerationIO from '../../tandem/js/types/EnumerationIO.js';
import ArrayIO from '../../tandem/js/types/ArrayIO.js';
import IOType from '../../tandem/js/types/IOType.js';
import NumberIO from '../../tandem/js/types/NumberIO.js';
import dot from './dot.js';
import Matrix4 from './Matrix4.js';
import toSVGNumber from './toSVGNumber.js';
import Vector2 from './Vector2.js';
import Vector3 from './Vector3.js';
import EnumerationValue from '../../phet-core/js/EnumerationValue.js';
import Enumeration from '../../phet-core/js/Enumeration.js';
import Pool, { TPoolable } from '../../phet-core/js/Pool.js';

export class Matrix3Type extends EnumerationValue {
  public static readonly OTHER = new Matrix3Type();
  public static readonly IDENTITY = new Matrix3Type();
  public static readonly TRANSLATION_2D = new Matrix3Type();
  public static readonly SCALING = new Matrix3Type();
  public static readonly AFFINE = new Matrix3Type();

  public static readonly enumeration = new Enumeration( Matrix3Type );
}

type NineNumbers = [
  number, number, number,
  number, number, number,
  number, number, number
];

export type Matrix3StateObject = {
  entries: NineNumbers;
  type: string;
};

export default class Matrix3 implements TPoolable {

  // Entries stored in column-major format
  public entries: NineNumbers;

  public type: Matrix3Type;

  /**
   * Creates an identity matrix, that can then be mutated into the proper form.
   */
  public constructor() {
    //Make sure no clients are expecting to create a matrix with non-identity values
    assert && assert( arguments.length === 0, 'Matrix3 constructor should not be called with any arguments.  Use m3()/Matrix3.identity()/etc.' );

    this.entries = [ 1, 0, 0, 0, 1, 0, 0, 0, 1 ];
    this.type = Matrix3Type.IDENTITY;
  }

  public initialize(): this {
    return this;
  }

  /**
   * Convenience getter for the individual 0,0 entry of the matrix.
   */
  public m00(): number {
    return this.entries[ 0 ];
  }

  /**
   * Convenience getter for the individual 0,1 entry of the matrix.
   */
  public m01(): number {
    return this.entries[ 3 ];
  }

  /**
   * Convenience getter for the individual 0,2 entry of the matrix.
   */
  public m02(): number {
    return this.entries[ 6 ];
  }

  /**
   * Convenience getter for the individual 1,0 entry of the matrix.
   */
  public m10(): number {
    return this.entries[ 1 ];
  }

  /**
   * Convenience getter for the individual 1,1 entry of the matrix.
   */
  public m11(): number {
    return this.entries[ 4 ];
  }

  /**
   * Convenience getter for the individual 1,2 entry of the matrix.
   */
  public m12(): number {
    return this.entries[ 7 ];
  }

  /**
   * Convenience getter for the individual 2,0 entry of the matrix.
   */
  public m20(): number {
    return this.entries[ 2 ];
  }

  /**
   * Convenience getter for the individual 2,1 entry of the matrix.
   */
  public m21(): number {
    return this.entries[ 5 ];
  }

  /**
   * Convenience getter for the individual 2,2 entry of the matrix.
   */
  public m22(): number {
    return this.entries[ 8 ];
  }

  /**
   * Returns whether this matrix is an identity matrix.
   */
  public isIdentity(): boolean {
    return this.type === Matrix3Type.IDENTITY || this.equals( Matrix3.IDENTITY );
  }

  /**
   * Returns whether this matrix is likely to be an identity matrix (returning false means "inconclusive, may be
   * identity or not"), but true is guaranteed to be an identity matrix.
   */
  public isFastIdentity(): boolean {
    return this.type === Matrix3Type.IDENTITY;
  }

  /**
   * Returns whether this matrix is a translation matrix.
   * By this we mean it has no shear, rotation, or scaling
   * It may be a translation of zero.
   */
  public isTranslation(): boolean {
    return this.type === Matrix3Type.TRANSLATION_2D || ( this.m00() === 1 && this.m11() === 1 && this.m22() === 1 && this.m01() === 0 && this.m10() === 0 && this.m20() === 0 && this.m21() === 0 );
  }

  /**
   * Returns whether this matrix is an affine matrix (e.g. no shear).
   */
  public isAffine(): boolean {
    return this.type === Matrix3Type.AFFINE || ( this.m20() === 0 && this.m21() === 0 && this.m22() === 1 );
  }

  /**
   * Returns whether it's an affine matrix where the components of transforms are independent, i.e. constructed from
   * arbitrary component scaling and translation.
   */
  public isAligned(): boolean {
    // non-diagonal non-translation entries should all be zero.
    return this.isAffine() && this.m01() === 0 && this.m10() === 0;
  }

  /**
   * Returns if it's an affine matrix where the components of transforms are independent, but may be switched (unlike isAligned)
   *
   * i.e. the 2x2 rotational sub-matrix is of one of the two forms:
   * A 0  or  0  A
   * 0 B      B  0
   * This means that moving a transformed point by (x,0) or (0,y) will result in a motion along one of the axes.
   */
  public isAxisAligned(): boolean {
    return this.isAffine() && ( ( this.m01() === 0 && this.m10() === 0 ) || ( this.m00() === 0 && this.m11() === 0 ) );
  }

  /**
   * Returns whether every single entry in this matrix is a finite number (non-NaN, non-infinite).
   */
  public isFinite(): boolean {
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
   */
  public getDeterminant(): number {
    return this.m00() * this.m11() * this.m22() + this.m01() * this.m12() * this.m20() + this.m02() * this.m10() * this.m21() - this.m02() * this.m11() * this.m20() - this.m01() * this.m10() * this.m22() - this.m00() * this.m12() * this.m21();
  }

  public get determinant(): number { return this.getDeterminant(); }

  /**
   * Returns the 2D translation, assuming multiplication with a homogeneous vector
   */
  public getTranslation(): Vector2 {
    return new Vector2( this.m02(), this.m12() );
  }

  public get translation(): Vector2 { return this.getTranslation(); }

  /**
   * Returns a vector that is equivalent to ( T(1,0).magnitude(), T(0,1).magnitude() ) where T is a relative transform
   */
  public getScaleVector(): Vector2 {
    return new Vector2(
      Math.sqrt( this.m00() * this.m00() + this.m10() * this.m10() ),
      Math.sqrt( this.m01() * this.m01() + this.m11() * this.m11() ) );
  }

  public get scaleVector(): Vector2 { return this.getScaleVector(); }

  /**
   * Returns the angle in radians for the 2d rotation from this matrix, between pi, -pi
   */
  public getRotation(): number {
    return Math.atan2( this.m10(), this.m00() );
  }

  public get rotation(): number { return this.getRotation(); }

  /**
   * Returns an identity-padded copy of this matrix with an increased dimension.
   */
  public toMatrix4(): Matrix4 {
    return new Matrix4(
      this.m00(), this.m01(), this.m02(), 0,
      this.m10(), this.m11(), this.m12(), 0,
      this.m20(), this.m21(), this.m22(), 0,
      0, 0, 0, 1 );
  }

  /**
   * Returns an identity-padded copy of this matrix with an increased dimension, treating this matrix's affine
   * components only.
   */
  public toAffineMatrix4(): Matrix4 {
    return new Matrix4(
      this.m00(), this.m01(), 0, this.m02(),
      this.m10(), this.m11(), 0, this.m12(),
      0, 0, 1, 0,
      0, 0, 0, 1 );
  }

  /**
   * Returns a string form of this object
   */
  public toString(): string {
    return `${this.m00()} ${this.m01()} ${this.m02()}\n${
      this.m10()} ${this.m11()} ${this.m12()}\n${
      this.m20()} ${this.m21()} ${this.m22()}`;
  }

  /**
   * Creates an SVG form of this matrix, for high-performance processing in SVG output.
   */
  public toSVGMatrix(): SVGMatrix {
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
   */
  public getCSSTransform(): string {
    // See http://www.w3.org/TR/css3-transforms/, particularly Section 13 that discusses the SVG compatibility

    // We need to prevent the numbers from being in an exponential toString form, since the CSS transform does not support that
    // 20 is the largest guaranteed number of digits according to https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toFixed
    // See https://github.com/phetsims/dot/issues/36

    // the inner part of a CSS3 transform, but remember to add the browser-specific parts!
    // NOTE: the toFixed calls are inlined for performance reasons
    return `matrix(${this.entries[ 0 ].toFixed( 20 )},${this.entries[ 1 ].toFixed( 20 )},${this.entries[ 3 ].toFixed( 20 )},${this.entries[ 4 ].toFixed( 20 )},${this.entries[ 6 ].toFixed( 20 )},${this.entries[ 7 ].toFixed( 20 )})`; // eslint-disable-line bad-sim-text
  }

  public get cssTransform(): string { return this.getCSSTransform(); }

  /**
   * Returns the CSS-like SVG matrix form for this transformation matrix.
   */
  public getSVGTransform(): string {
    // SVG transform presentation attribute. See http://www.w3.org/TR/SVG/coords.html#TransformAttribute
    switch( this.type ) {
      case Matrix3Type.IDENTITY:
        return '';
      case Matrix3Type.TRANSLATION_2D:
        return `translate(${toSVGNumber( this.entries[ 6 ] )},${toSVGNumber( this.entries[ 7 ] )})`;
      case Matrix3Type.SCALING:
        return `scale(${toSVGNumber( this.entries[ 0 ] )}${this.entries[ 0 ] === this.entries[ 4 ] ? '' : `,${toSVGNumber( this.entries[ 4 ] )}`})`;
      default:
        return `matrix(${toSVGNumber( this.entries[ 0 ] )},${toSVGNumber( this.entries[ 1 ] )},${toSVGNumber( this.entries[ 3 ] )},${toSVGNumber( this.entries[ 4 ] )},${toSVGNumber( this.entries[ 6 ] )},${toSVGNumber( this.entries[ 7 ] )})`;
    }
  }

  public get svgTransform(): string { return this.getSVGTransform(); }

  /**
   * Returns a parameter object suitable for use with jQuery's .css()
   */
  public getCSSTransformStyles(): Record<string, string> {
    const transformCSS = this.getCSSTransform();

    // notes on triggering hardware acceleration: http://creativejs.com/2011/12/day-2-gpu-accelerate-your-dom-elements/
    return {
      // force iOS hardware acceleration
      '-webkit-perspective': '1000',
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

  public get cssTransformStyles(): Record<string, string> { return this.getCSSTransformStyles(); }

  /**
   * Returns exact equality with another matrix
   */
  public equals( matrix: Matrix3 ): boolean {
    return this.m00() === matrix.m00() && this.m01() === matrix.m01() && this.m02() === matrix.m02() &&
           this.m10() === matrix.m10() && this.m11() === matrix.m11() && this.m12() === matrix.m12() &&
           this.m20() === matrix.m20() && this.m21() === matrix.m21() && this.m22() === matrix.m22();
  }

  /**
   * Returns equality within a margin of error with another matrix
   */
  public equalsEpsilon( matrix: Matrix3, epsilon: number ): boolean {
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
   */
  public copy(): Matrix3 {
    return m3(
      this.m00(), this.m01(), this.m02(),
      this.m10(), this.m11(), this.m12(),
      this.m20(), this.m21(), this.m22(),
      this.type
    );
  }

  /**
   * Returns a new matrix, defined by this matrix plus the provided matrix
   */
  public plus( matrix: Matrix3 ): Matrix3 {
    return m3(
      this.m00() + matrix.m00(), this.m01() + matrix.m01(), this.m02() + matrix.m02(),
      this.m10() + matrix.m10(), this.m11() + matrix.m11(), this.m12() + matrix.m12(),
      this.m20() + matrix.m20(), this.m21() + matrix.m21(), this.m22() + matrix.m22()
    );
  }

  /**
   * Returns a new matrix, defined by this matrix plus the provided matrix
   */
  public minus( matrix: Matrix3 ): Matrix3 {
    return m3(
      this.m00() - matrix.m00(), this.m01() - matrix.m01(), this.m02() - matrix.m02(),
      this.m10() - matrix.m10(), this.m11() - matrix.m11(), this.m12() - matrix.m12(),
      this.m20() - matrix.m20(), this.m21() - matrix.m21(), this.m22() - matrix.m22()
    );
  }

  /**
   * Returns a transposed copy of this matrix
   */
  public transposed(): Matrix3 {
    return m3(
      this.m00(), this.m10(), this.m20(),
      this.m01(), this.m11(), this.m21(),
      this.m02(), this.m12(), this.m22(), ( this.type === Matrix3Type.IDENTITY || this.type === Matrix3Type.SCALING ) ? this.type : undefined
    );
  }

  /**
   * Returns a negated copy of this matrix
   */
  public negated(): Matrix3 {
    return m3(
      -this.m00(), -this.m01(), -this.m02(),
      -this.m10(), -this.m11(), -this.m12(),
      -this.m20(), -this.m21(), -this.m22()
    );
  }

  /**
   * Returns an inverted copy of this matrix
   */
  public inverted(): Matrix3 {
    let det;

    switch( this.type ) {
      case Matrix3Type.IDENTITY:
        return this;
      case Matrix3Type.TRANSLATION_2D:
        return m3(
          1, 0, -this.m02(),
          0, 1, -this.m12(),
          0, 0, 1, Matrix3Type.TRANSLATION_2D );
      case Matrix3Type.SCALING:
        return m3(
          1 / this.m00(), 0, 0,
          0, 1 / this.m11(), 0,
          0, 0, 1 / this.m22(), Matrix3Type.SCALING );
      case Matrix3Type.AFFINE:
        det = this.getDeterminant();
        if ( det !== 0 ) {
          return m3(
            ( -this.m12() * this.m21() + this.m11() * this.m22() ) / det,
            ( this.m02() * this.m21() - this.m01() * this.m22() ) / det,
            ( -this.m02() * this.m11() + this.m01() * this.m12() ) / det,
            ( this.m12() * this.m20() - this.m10() * this.m22() ) / det,
            ( -this.m02() * this.m20() + this.m00() * this.m22() ) / det,
            ( this.m02() * this.m10() - this.m00() * this.m12() ) / det,
            0, 0, 1, Matrix3Type.AFFINE
          );
        }
        else {
          throw new Error( 'Matrix could not be inverted, determinant === 0' );
        }
      case Matrix3Type.OTHER:
        det = this.getDeterminant();
        if ( det !== 0 ) {
          return m3(
            ( -this.m12() * this.m21() + this.m11() * this.m22() ) / det,
            ( this.m02() * this.m21() - this.m01() * this.m22() ) / det,
            ( -this.m02() * this.m11() + this.m01() * this.m12() ) / det,
            ( this.m12() * this.m20() - this.m10() * this.m22() ) / det,
            ( -this.m02() * this.m20() + this.m00() * this.m22() ) / det,
            ( this.m02() * this.m10() - this.m00() * this.m12() ) / det,
            ( -this.m11() * this.m20() + this.m10() * this.m21() ) / det,
            ( this.m01() * this.m20() - this.m00() * this.m21() ) / det,
            ( -this.m01() * this.m10() + this.m00() * this.m11() ) / det,
            Matrix3Type.OTHER
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
   *
   * @param matrix
   * @returns - NOTE: this may be the same matrix!
   */
  public timesMatrix( matrix: Matrix3 ): Matrix3 {
    // I * M === M * I === M (the identity)
    if ( this.type === Matrix3Type.IDENTITY || matrix.type === Matrix3Type.IDENTITY ) {
      return this.type === Matrix3Type.IDENTITY ? matrix : this;
    }

    if ( this.type === matrix.type ) {
      // currently two matrices of the same type will result in the same result type
      if ( this.type === Matrix3Type.TRANSLATION_2D ) {
        // faster combination of translations
        return m3(
          1, 0, this.m02() + matrix.m02(),
          0, 1, this.m12() + matrix.m12(),
          0, 0, 1, Matrix3Type.TRANSLATION_2D );
      }
      else if ( this.type === Matrix3Type.SCALING ) {
        // faster combination of scaling
        return m3(
          this.m00() * matrix.m00(), 0, 0,
          0, this.m11() * matrix.m11(), 0,
          0, 0, 1, Matrix3Type.SCALING );
      }
    }

    if ( this.type !== Matrix3Type.OTHER && matrix.type !== Matrix3Type.OTHER ) {
      // currently two matrices that are anything but "other" are technically affine, and the result will be affine

      // affine case
      return m3(
        this.m00() * matrix.m00() + this.m01() * matrix.m10(),
        this.m00() * matrix.m01() + this.m01() * matrix.m11(),
        this.m00() * matrix.m02() + this.m01() * matrix.m12() + this.m02(),
        this.m10() * matrix.m00() + this.m11() * matrix.m10(),
        this.m10() * matrix.m01() + this.m11() * matrix.m11(),
        this.m10() * matrix.m02() + this.m11() * matrix.m12() + this.m12(),
        0, 0, 1, Matrix3Type.AFFINE );
    }

    // general case
    return m3(
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
   */
  public timesVector2( vector2: Vector2 ): Vector2 {
    const x = this.m00() * vector2.x + this.m01() * vector2.y + this.m02();
    const y = this.m10() * vector2.x + this.m11() * vector2.y + this.m12();
    return new Vector2( x, y );
  }

  /**
   * Returns the multiplication of this matrix times the provided vector
   */
  public timesVector3( vector3: Vector3 ): Vector3 {
    const x = this.m00() * vector3.x + this.m01() * vector3.y + this.m02() * vector3.z;
    const y = this.m10() * vector3.x + this.m11() * vector3.y + this.m12() * vector3.z;
    const z = this.m20() * vector3.x + this.m21() * vector3.y + this.m22() * vector3.z;
    return new Vector3( x, y, z );
  }

  /**
   * Returns the multiplication of the transpose of this matrix times the provided vector (assuming the 2x2 quadrant)
   */
  public timesTransposeVector2( vector2: Vector2 ): Vector2 {
    const x = this.m00() * vector2.x + this.m10() * vector2.y;
    const y = this.m01() * vector2.x + this.m11() * vector2.y;
    return new Vector2( x, y );
  }

  /**
   * TODO: this operation seems to not work for transformDelta2, should be vetted
   */
  public timesRelativeVector2( vector2: Vector2 ): Vector2 {
    const x = this.m00() * vector2.x + this.m01() * vector2.y;
    const y = this.m10() * vector2.y + this.m11() * vector2.y;
    return new Vector2( x, y );
  }

  /*---------------------------------------------------------------------------*
   * Mutable operations (changes this matrix)
   *----------------------------------------------------------------------------*/

  /**
   * Sets the entire state of the matrix, in row-major order.
   *
   * NOTE: Every mutable method goes through rowMajor
   */
  public rowMajor( v00: number, v01: number, v02: number, v10: number, v11: number, v12: number, v20: number, v21: number, v22: number, type?: Matrix3Type ): this {
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
    this.type = type === undefined ? ( ( v20 === 0 && v21 === 0 && v22 === 1 ) ? Matrix3Type.AFFINE : Matrix3Type.OTHER ) : type;
    return this;
  }

  /**
   * Sets this matrix to be a copy of another matrix.
   */
  public set( matrix: Matrix3 ): this {
    return this.rowMajor(
      matrix.m00(), matrix.m01(), matrix.m02(),
      matrix.m10(), matrix.m11(), matrix.m12(),
      matrix.m20(), matrix.m21(), matrix.m22(),
      matrix.type );
  }

  /**
   * Sets this matrix to be a copy of the column-major data stored in an array (e.g. WebGL).
   */
  public setArray( array: number[] | Float32Array | Float64Array ): this {
    return this.rowMajor(
      array[ 0 ], array[ 3 ], array[ 6 ],
      array[ 1 ], array[ 4 ], array[ 7 ],
      array[ 2 ], array[ 5 ], array[ 8 ] );
  }

  /**
   * Sets the individual 0,0 component of this matrix.
   */
  public set00( value: number ): this {
    this.entries[ 0 ] = value;
    return this;
  }

  /**
   * Sets the individual 0,1 component of this matrix.
   */
  public set01( value: number ): this {
    this.entries[ 3 ] = value;
    return this;
  }

  /**
   * Sets the individual 0,2 component of this matrix.
   */
  public set02( value: number ): this {
    this.entries[ 6 ] = value;
    return this;
  }

  /**
   * Sets the individual 1,0 component of this matrix.
   */
  public set10( value: number ): this {
    this.entries[ 1 ] = value;
    return this;
  }

  /**
   * Sets the individual 1,1 component of this matrix.
   */
  public set11( value: number ): this {
    this.entries[ 4 ] = value;
    return this;
  }

  /**
   * Sets the individual 1,2 component of this matrix.
   */
  public set12( value: number ): this {
    this.entries[ 7 ] = value;
    return this;
  }

  /**
   * Sets the individual 2,0 component of this matrix.
   */
  public set20( value: number ): this {
    this.entries[ 2 ] = value;
    return this;
  }

  /**
   * Sets the individual 2,1 component of this matrix.
   */
  public set21( value: number ): this {
    this.entries[ 5 ] = value;
    return this;
  }

  /**
   * Sets the individual 2,2 component of this matrix.
   */
  public set22( value: number ): this {
    this.entries[ 8 ] = value;
    return this;
  }

  /**
   * Makes this matrix effectively immutable to the normal methods (except direct setters?)
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
   * Sets the entire state of the matrix, in column-major order.
   */
  public columnMajor( v00: number, v10: number, v20: number, v01: number, v11: number, v21: number, v02: number, v12: number, v22: number, type: Matrix3Type ): this {
    return this.rowMajor( v00, v01, v02, v10, v11, v12, v20, v21, v22, type );
  }

  /**
   * Sets this matrix to itself plus the given matrix.
   */
  public add( matrix: Matrix3 ): this {
    return this.rowMajor(
      this.m00() + matrix.m00(), this.m01() + matrix.m01(), this.m02() + matrix.m02(),
      this.m10() + matrix.m10(), this.m11() + matrix.m11(), this.m12() + matrix.m12(),
      this.m20() + matrix.m20(), this.m21() + matrix.m21(), this.m22() + matrix.m22()
    );
  }

  /**
   * Sets this matrix to itself minus the given matrix.
   */
  public subtract( m: Matrix3 ): this {
    return this.rowMajor(
      this.m00() - m.m00(), this.m01() - m.m01(), this.m02() - m.m02(),
      this.m10() - m.m10(), this.m11() - m.m11(), this.m12() - m.m12(),
      this.m20() - m.m20(), this.m21() - m.m21(), this.m22() - m.m22()
    );
  }

  /**
   * Sets this matrix to its own transpose.
   */
  public transpose(): this {
    return this.rowMajor(
      this.m00(), this.m10(), this.m20(),
      this.m01(), this.m11(), this.m21(),
      this.m02(), this.m12(), this.m22(),
      ( this.type === Matrix3Type.IDENTITY || this.type === Matrix3Type.SCALING ) ? this.type : undefined
    );
  }

  /**
   * Sets this matrix to its own negation.
   */
  public negate(): this {
    return this.rowMajor(
      -this.m00(), -this.m01(), -this.m02(),
      -this.m10(), -this.m11(), -this.m12(),
      -this.m20(), -this.m21(), -this.m22()
    );
  }

  /**
   * Sets this matrix to its own inverse.
   */
  public invert(): this {
    let det;

    switch( this.type ) {
      case Matrix3Type.IDENTITY:
        return this;
      case Matrix3Type.TRANSLATION_2D:
        return this.rowMajor(
          1, 0, -this.m02(),
          0, 1, -this.m12(),
          0, 0, 1, Matrix3Type.TRANSLATION_2D );
      case Matrix3Type.SCALING:
        return this.rowMajor(
          1 / this.m00(), 0, 0,
          0, 1 / this.m11(), 0,
          0, 0, 1 / this.m22(), Matrix3Type.SCALING );
      case Matrix3Type.AFFINE:
        det = this.getDeterminant();
        if ( det !== 0 ) {
          return this.rowMajor(
            ( -this.m12() * this.m21() + this.m11() * this.m22() ) / det,
            ( this.m02() * this.m21() - this.m01() * this.m22() ) / det,
            ( -this.m02() * this.m11() + this.m01() * this.m12() ) / det,
            ( this.m12() * this.m20() - this.m10() * this.m22() ) / det,
            ( -this.m02() * this.m20() + this.m00() * this.m22() ) / det,
            ( this.m02() * this.m10() - this.m00() * this.m12() ) / det,
            0, 0, 1, Matrix3Type.AFFINE
          );
        }
        else {
          throw new Error( 'Matrix could not be inverted, determinant === 0' );
        }
      case Matrix3Type.OTHER:
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
            Matrix3Type.OTHER
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
   */
  public multiplyMatrix( matrix: Matrix3 ): this {
    // M * I === M (the identity)
    if ( matrix.type === Matrix3Type.IDENTITY ) {
      // no change needed
      return this;
    }

    // I * M === M (the identity)
    if ( this.type === Matrix3Type.IDENTITY ) {
      // copy the other matrix to us
      return this.set( matrix );
    }

    if ( this.type === matrix.type ) {
      // currently two matrices of the same type will result in the same result type
      if ( this.type === Matrix3Type.TRANSLATION_2D ) {
        // faster combination of translations
        return this.rowMajor(
          1, 0, this.m02() + matrix.m02(),
          0, 1, this.m12() + matrix.m12(),
          0, 0, 1, Matrix3Type.TRANSLATION_2D );
      }
      else if ( this.type === Matrix3Type.SCALING ) {
        // faster combination of scaling
        return this.rowMajor(
          this.m00() * matrix.m00(), 0, 0,
          0, this.m11() * matrix.m11(), 0,
          0, 0, 1, Matrix3Type.SCALING );
      }
    }

    if ( this.type !== Matrix3Type.OTHER && matrix.type !== Matrix3Type.OTHER ) {
      // currently two matrices that are anything but "other" are technically affine, and the result will be affine

      // affine case
      return this.rowMajor(
        this.m00() * matrix.m00() + this.m01() * matrix.m10(),
        this.m00() * matrix.m01() + this.m01() * matrix.m11(),
        this.m00() * matrix.m02() + this.m01() * matrix.m12() + this.m02(),
        this.m10() * matrix.m00() + this.m11() * matrix.m10(),
        this.m10() * matrix.m01() + this.m11() * matrix.m11(),
        this.m10() * matrix.m02() + this.m11() * matrix.m12() + this.m12(),
        0, 0, 1, Matrix3Type.AFFINE );
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
   */
  public prependTranslation( x: number, y: number ): this {
    this.set02( this.m02() + x );
    this.set12( this.m12() + y );

    if ( this.type === Matrix3Type.IDENTITY || this.type === Matrix3Type.TRANSLATION_2D ) {
      this.type = Matrix3Type.TRANSLATION_2D;
    }
    else if ( this.type === Matrix3Type.OTHER ) {
      this.type = Matrix3Type.OTHER;
    }
    else {
      this.type = Matrix3Type.AFFINE;
    }
    return this; // for chaining
  }

  /**
   * Sets this matrix to the 3x3 identity matrix.
   */
  public setToIdentity(): this {
    return this.rowMajor(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
      Matrix3Type.IDENTITY );
  }

  /**
   * Sets this matrix to the affine translation matrix.
   */
  public setToTranslation( x: number, y: number ): this {
    return this.rowMajor(
      1, 0, x,
      0, 1, y,
      0, 0, 1,
      Matrix3Type.TRANSLATION_2D );
  }

  /**
   * Sets this matrix to the affine scaling matrix.
   */
  public setToScale( x: number, y?: number ): this {
    // allow using one parameter to scale everything
    y = y === undefined ? x : y;

    return this.rowMajor(
      x, 0, 0,
      0, y, 0,
      0, 0, 1,
      Matrix3Type.SCALING );
  }

  /**
   * Sets this matrix to an affine matrix with the specified row-major values.
   */
  public setToAffine( m00: number, m01: number, m02: number, m10: number, m11: number, m12: number ): this {
    return this.rowMajor( m00, m01, m02, m10, m11, m12, 0, 0, 1, Matrix3Type.AFFINE );
  }

  /**
   * Sets the matrix to a rotation defined by a rotation of the specified angle around the given unit axis.
   *
   * @param axis - normalized
   * @param angle - in radians
   */
  public setToRotationAxisAngle( axis: Vector3, angle: number ): this {
    let c = Math.cos( angle );
    let s = Math.sin( angle );

    // Handle cases close to 0, since we want Math.PI/2 rotations (and the like) to be exact
    if ( Math.abs( c ) < 1e-15 ) {
      c = 0;
    }
    if ( Math.abs( s ) < 1e-15 ) {
      s = 0;
    }

    const C = 1 - c;

    return this.rowMajor(
      axis.x * axis.x * C + c, axis.x * axis.y * C - axis.z * s, axis.x * axis.z * C + axis.y * s,
      axis.y * axis.x * C + axis.z * s, axis.y * axis.y * C + c, axis.y * axis.z * C - axis.x * s,
      axis.z * axis.x * C - axis.y * s, axis.z * axis.y * C + axis.x * s, axis.z * axis.z * C + c,
      Matrix3Type.OTHER );
  }

  /**
   * Sets this matrix to a rotation around the x axis (in the yz plane).
   *
   * @param angle - in radians
   */
  public setToRotationX( angle: number ): this {
    let c = Math.cos( angle );
    let s = Math.sin( angle );

    // Handle cases close to 0, since we want Math.PI/2 rotations (and the like) to be exact
    if ( Math.abs( c ) < 1e-15 ) {
      c = 0;
    }
    if ( Math.abs( s ) < 1e-15 ) {
      s = 0;
    }

    return this.rowMajor(
      1, 0, 0,
      0, c, -s,
      0, s, c,
      Matrix3Type.OTHER );
  }

  /**
   * Sets this matrix to a rotation around the y axis (in the xz plane).
   *
   * @param angle - in radians
   */
  public setToRotationY( angle: number ): this {
    let c = Math.cos( angle );
    let s = Math.sin( angle );

    // Handle cases close to 0, since we want Math.PI/2 rotations (and the like) to be exact
    if ( Math.abs( c ) < 1e-15 ) {
      c = 0;
    }
    if ( Math.abs( s ) < 1e-15 ) {
      s = 0;
    }

    return this.rowMajor(
      c, 0, s,
      0, 1, 0,
      -s, 0, c,
      Matrix3Type.OTHER );
  }

  /**
   * Sets this matrix to a rotation around the z axis (in the xy plane).
   *
   * @param angle - in radians
   */
  public setToRotationZ( angle: number ): this {
    let c = Math.cos( angle );
    let s = Math.sin( angle );

    // Handle cases close to 0, since we want Math.PI/2 rotations (and the like) to be exact
    if ( Math.abs( c ) < 1e-15 ) {
      c = 0;
    }
    if ( Math.abs( s ) < 1e-15 ) {
      s = 0;
    }

    return this.rowMajor(
      c, -s, 0,
      s, c, 0,
      0, 0, 1,
      Matrix3Type.AFFINE );
  }

  /**
   * Sets this matrix to the combined translation+rotation (where the rotation logically would happen first, THEN it
   * would be translated).
   *
   * @param x
   * @param y
   * @param angle - in radians
   */
  public setToTranslationRotation( x: number, y: number, angle: number ): this {
    let c = Math.cos( angle );
    let s = Math.sin( angle );

    // Handle cases close to 0, since we want Math.PI/2 rotations (and the like) to be exact
    if ( Math.abs( c ) < 1e-15 ) {
      c = 0;
    }
    if ( Math.abs( s ) < 1e-15 ) {
      s = 0;
    }

    return this.rowMajor(
      c, -s, x,
      s, c, y,
      0, 0, 1,
      Matrix3Type.AFFINE );
  }

  /**
   * Sets this matrix to the combined translation+rotation (where the rotation logically would happen first, THEN it
   * would be translated).
   *
   * @param translation
   * @param angle - in radians
   */
  public setToTranslationRotationPoint( translation: Vector2, angle: number ): this {
    return this.setToTranslationRotation( translation.x, translation.y, angle );
  }

  /**
   * Sets this matrix to the values contained in an SVGMatrix.
   */
  public setToSVGMatrix( svgMatrix: SVGMatrix ): this {
    return this.rowMajor(
      svgMatrix.a, svgMatrix.c, svgMatrix.e,
      svgMatrix.b, svgMatrix.d, svgMatrix.f,
      0, 0, 1,
      Matrix3Type.AFFINE );
  }

  /**
   * Sets this matrix to a rotation matrix that rotates A to B (Vector3 instances), by rotating about the axis
   * A.cross( B ) -- Shortest path. ideally should be unit vectors.
   */
  public setRotationAToB( a: Vector3, b: Vector3 ): this {
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
   * Sets the vector to the result of (matrix * vector), as a homogeneous multiplication.
   *
   * @returns - The vector that was mutated
   */
  public multiplyVector2( vector2: Vector2 ): Vector2 {
    return vector2.setXY(
      this.m00() * vector2.x + this.m01() * vector2.y + this.m02(),
      this.m10() * vector2.x + this.m11() * vector2.y + this.m12() );
  }

  /**
   * Sets the vector to the result of (matrix * vector).
   *
   * @returns - The vector that was mutated
   */
  public multiplyVector3( vector3: Vector3 ): Vector3 {
    return vector3.setXYZ(
      this.m00() * vector3.x + this.m01() * vector3.y + this.m02() * vector3.z,
      this.m10() * vector3.x + this.m11() * vector3.y + this.m12() * vector3.z,
      this.m20() * vector3.x + this.m21() * vector3.y + this.m22() * vector3.z );
  }

  /**
   * Sets the vector to the result of (transpose(matrix) * vector), ignoring the translation parameters.
   *
   * @returns - The vector that was mutated
   */
  public multiplyTransposeVector2( v: Vector2 ): Vector2 {
    return v.setXY(
      this.m00() * v.x + this.m10() * v.y,
      this.m01() * v.x + this.m11() * v.y );
  }

  /**
   * Sets the vector to the result of (matrix * vector - matrix * zero). Since this is a homogeneous operation, it is
   * equivalent to the multiplication of (x,y,0).
   *
   * @returns - The vector that was mutated
   */
  public multiplyRelativeVector2( v: Vector2 ): Vector2 {
    return v.setXY(
      this.m00() * v.x + this.m01() * v.y,
      this.m10() * v.y + this.m11() * v.y );
  }

  /**
   * Sets the transform of a Canvas 2D rendering context to the affine part of this matrix
   */
  public canvasSetTransform( context: CanvasRenderingContext2D ): void {
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
   */
  public canvasAppendTransform( context: CanvasRenderingContext2D ): void {
    if ( this.type !== Matrix3Type.IDENTITY ) {
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
   */
  public copyToArray( array: number[] | Float32Array | Float64Array ): number[] | Float32Array | Float64Array {
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

  public freeToPool(): void {
    Matrix3.pool.freeToPool( this );
  }

  public static readonly pool = new Pool( Matrix3, {
    initialize: Matrix3.prototype.initialize,
    useDefaultConstruction: true,
    maxSize: 300
  } );

  /**
   * Returns an identity matrix.
   */
  public static identity(): Matrix3 {
    return fromPool().setToIdentity();
  }

  /**
   * Returns a translation matrix.
   */
  public static translation( x: number, y: number ): Matrix3 {
    return fromPool().setToTranslation( x, y );
  }

  /**
   * Returns a translation matrix computed from a vector.
   */
  public static translationFromVector( vector: Vector2 | Vector3 ): Matrix3 {
    return Matrix3.translation( vector.x, vector.y );
  }

  /**
   * Returns a matrix that scales things in each dimension.
   */
  public static scaling( x: number, y?: number ): Matrix3 {
    return fromPool().setToScale( x, y );
  }

  /**
   * Returns a matrix that scales things in each dimension.
   */
  public static scale( x: number, y?: number ): Matrix3 {
    return Matrix3.scaling( x, y );
  }

  /**
   * Returns an affine matrix with the given parameters.
   */
  public static affine( m00: number, m01: number, m02: number, m10: number, m11: number, m12: number ): Matrix3 {
    return fromPool().setToAffine( m00, m01, m02, m10, m11, m12 );
  }

  /**
   * Creates a new matrix with all entries determined in row-major order.
   */
  public static rowMajor( v00: number, v01: number, v02: number, v10: number, v11: number, v12: number, v20: number, v21: number, v22: number, type?: Matrix3Type ): Matrix3 {
    return fromPool().rowMajor(
      v00, v01, v02,
      v10, v11, v12,
      v20, v21, v22,
      type
    );
  }

  /**
   * Returns a matrix rotation defined by a rotation of the specified angle around the given unit axis.
   *
   * @param axis - normalized
   * @param angle - in radians
   */
  public static rotationAxisAngle( axis: Vector3, angle: number ): Matrix3 {
    return fromPool().setToRotationAxisAngle( axis, angle );
  }

  /**
   * Returns a matrix that rotates around the x axis (in the yz plane).
   *
   * @param angle - in radians
   */
  public static rotationX( angle: number ): Matrix3 {
    return fromPool().setToRotationX( angle );
  }

  /**
   * Returns a matrix that rotates around the y axis (in the xz plane).
   *
   * @param angle - in radians
   */
  public static rotationY( angle: number ): Matrix3 {
    return fromPool().setToRotationY( angle );
  }

  /**
   * Returns a matrix that rotates around the z axis (in the xy plane).
   *
   * @param angle - in radians
   */
  public static rotationZ( angle: number ): Matrix3 {
    return fromPool().setToRotationZ( angle );
  }

  /**
   * Returns a combined 2d translation + rotation (with the rotation effectively applied first).
   *
   * @param angle - in radians
   */
  public static translationRotation( x: number, y: number, angle: number ): Matrix3 {
    return fromPool().setToTranslationRotation( x, y, angle );
  }

  /**
   * Standard 2d rotation matrix for a given angle.
   *
   * @param angle - in radians
   */
  public static rotation2( angle: number ): Matrix3 {
    return fromPool().setToRotationZ( angle );
  }

  /**
   * Returns a matrix which will be a 2d rotation around a given x,y point.
   *
   * @param angle - in radians
   * @param x
   * @param y
   */
  public static rotationAround( angle: number, x: number, y: number ): Matrix3 {
    return Matrix3.translation( x, y ).timesMatrix( Matrix3.rotation2( angle ) ).timesMatrix( Matrix3.translation( -x, -y ) );
  }

  /**
   * Returns a matrix which will be a 2d rotation around a given 2d point.
   *
   * @param angle - in radians
   * @param point
   */
  public static rotationAroundPoint( angle: number, point: Vector2 ): Matrix3 {
    return Matrix3.rotationAround( angle, point.x, point.y );
  }

  /**
   * Returns a matrix equivalent to a given SVGMatrix.
   */
  public static fromSVGMatrix( svgMatrix: SVGMatrix ): Matrix3 {
    return fromPool().setToSVGMatrix( svgMatrix );
  }

  /**
   * Returns a rotation matrix that rotates A to B, by rotating about the axis A.cross( B ) -- Shortest path. ideally
   * should be unit vectors.
   */
  public static rotateAToB( a: Vector3, b: Vector3 ): Matrix3 {
    return fromPool().setRotationAToB( a, b );
  }

  /**
   * Shortcut for translation times a matrix (without allocating a translation matrix), see scenery#119
   */
  public static translationTimesMatrix( x: number, y: number, matrix: Matrix3 ): Matrix3 {
    let type;
    if ( matrix.type === Matrix3Type.IDENTITY || matrix.type === Matrix3Type.TRANSLATION_2D ) {
      return m3(
        1, 0, matrix.m02() + x,
        0, 1, matrix.m12() + y,
        0, 0, 1,
        Matrix3Type.TRANSLATION_2D );
    }
    else if ( matrix.type === Matrix3Type.OTHER ) {
      type = Matrix3Type.OTHER;
    }
    else {
      type = Matrix3Type.AFFINE;
    }
    return m3(
      matrix.m00(), matrix.m01(), matrix.m02() + x,
      matrix.m10(), matrix.m11(), matrix.m12() + y,
      matrix.m20(), matrix.m21(), matrix.m22(),
      type );
  }

  /**
   * Serialize to an Object that can be handled by PhET-iO
   */
  public static toStateObject( matrix3: Matrix3 ): Matrix3StateObject {
    return {
      entries: matrix3.entries,
      type: matrix3.type.name
    };
  }

  /**
   * Convert back from a serialized Object to a Matrix3
   */
  public static fromStateObject( stateObject: Matrix3StateObject ): Matrix3 {
    const matrix = Matrix3.identity();
    matrix.entries = stateObject.entries;
    matrix.type = Matrix3Type.enumeration.getValue( stateObject.type );
    return matrix;
  }

  public static IDENTITY: Matrix3; // eslint-disable-line uppercase-statics-should-be-readonly
  public static X_REFLECTION: Matrix3; // eslint-disable-line uppercase-statics-should-be-readonly
  public static Y_REFLECTION: Matrix3; // eslint-disable-line uppercase-statics-should-be-readonly
  public static Matrix3IO: IOType;
}

dot.register( 'Matrix3', Matrix3 );

const fromPool = Matrix3.pool.fetch.bind( Matrix3.pool );

const m3 = ( v00: number, v01: number, v02: number, v10: number, v11: number, v12: number, v20: number, v21: number, v22: number, type?: Matrix3Type ): Matrix3 => {
  return fromPool().rowMajor( v00, v01, v02, v10, v11, v12, v20, v21, v22, type );
};
export { m3 };
dot.register( 'm3', m3 );

Matrix3.IDENTITY = Matrix3.identity().makeImmutable();
Matrix3.X_REFLECTION = m3(
  -1, 0, 0,
  0, 1, 0,
  0, 0, 1,
  Matrix3Type.AFFINE
).makeImmutable();
Matrix3.Y_REFLECTION = m3(
  1, 0, 0,
  0, -1, 0,
  0, 0, 1,
  Matrix3Type.AFFINE
).makeImmutable();

Matrix3.Matrix3IO = new IOType( 'Matrix3IO', {
  valueType: Matrix3,
  documentation: 'A 3x3 matrix often used for holding transform data.',
  toStateObject: ( matrix3: Matrix3 ) => Matrix3.toStateObject( matrix3 ),
  fromStateObject: Matrix3.fromStateObject,
  stateSchema: {
    entries: ArrayIO( NumberIO ),
    type: EnumerationIO( Matrix3Type )
  }
} );
