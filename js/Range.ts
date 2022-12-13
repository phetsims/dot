// Copyright 2013-2022, University of Colorado Boulder

/**
 * A numeric range.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Andrew Adare
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';
import IOType from '../../tandem/js/types/IOType.js';
import InfiniteNumberIO, { InfiniteNumberStateObject } from '../../tandem/js/types/InfiniteNumberIO.js';
import dot from './dot.js';

export type TRange = {
  min: number;
  max: number;
};

export type RangeStateObject = {
  min: InfiniteNumberStateObject;
  max: InfiniteNumberStateObject;
};

class Range implements TRange {

  // the minimum value of the range
  private _min: number;

  // the maximum value of the range
  private _max: number;

  /**
   * @param min - the minimum value of the range
   * @param max - the maximum value of the range
   */
  public constructor( min: number, max: number ) {
    this._min = min;
    this._max = max;
  }

  /**
   * Getter for min
   */
  public getMin(): number {
    return this._min;
  }

  public get min(): number {
    return this.getMin();
  }

  public set min( min: number ) {
    this.setMin( min );
  }

  /**
   * TODO: Allow chaining, https://github.com/phetsims/sun/issues/792
   * Setter for min
   */
  public setMin( min: number ): void {
    assert && assert( min <= this._max, `min must be <= max: ${min}` );
    this._min = min;
  }

  /**
   * Getter for max
   */
  public getMax(): number {
    return this._max;
  }

  public get max(): number {
    return this.getMax();
  }

  public set max( max: number ) {
    this.setMax( max );
  }

  /**
   * Setter for max
   */
  public setMax( max: number ): void {
    assert && assert( this._min <= max, `max must be >= to min: ${max}` );
    this._max = max;
  }

  /**
   * Sets the minimum and maximum value of the range
   */
  public setMinMax( min: number, max: number ): this {
    assert && assert( min <= max, `max must be >= to min. min: ${min}, max: ${max}` );
    this._min = min;
    this._max = max;

    return this;
  }

  /**
   * Makes a copy of this range
   */
  public copy(): Range {
    return new Range( this._min, this._max ); // eslint-disable-line no-html-constructors
  }

  /**
   * Gets the length of this range, that is the difference between the maximum and minimum value of this range
   */
  public getLength(): number {
    return this._max - this._min;
  }

  /**
   * Gets the center of this range, that is the average value of the maximum and minimum value of this range
   */
  public getCenter(): number {
    return ( this._max + this._min ) / 2;
  }

  /**
   * Determines if this range contains the value
   */
  public contains( value: number ): boolean {
    return ( value >= this._min ) && ( value <= this._max );
  }

  /**
   * Does this range contain the specified range?
   */
  public containsRange( range: Range ): boolean {
    return ( this._min <= range.min ) && ( this._max >= range.max );
  }

  /**
   * Determine if this range overlaps (intersects) with another range
   */
  public intersects( range: Range ): boolean {
    return ( this._max >= range.min ) && ( range.max >= this._min );
  }

  /**
   * Do the two ranges overlap with one another?  Note that this assumes that
   * This is a open interval.
   */
  public intersectsExclusive( range: Range ): boolean {
    return ( this._max > range.min ) && ( range.max > this._min );
  }

  /**
   *
   * REVIEW: The naming is not helping me understand that this function is just the immutable version of includeRange().
   *
   * The smallest range that contains both this range and the input range, returned as a copy.
   *
   * The method below is the immutable form of the function includeRange(). The method will return a new range, and will not modify
   * this range.
   */
  public union( range: Range ): Range {
    return new Range( // eslint-disable-line no-html-constructors
      Math.min( this.min, range.min ),
      Math.max( this.max, range.max )
    );
  }

  /**
   * REVIEW: The naming is not helping me understand that this function is just the immutable version of constrainRange().
   *
   * The smallest range that is contained by both this range and the input range, returned as a copy.
   *
   * The method below the immutable form of the function constrainRange(). The method below will return a new range, and will not modify
   * this range.
   */
  public intersection( range: Range ): Range {
    return new Range( // eslint-disable-line no-html-constructors
      Math.max( this.min, range.min ),
      Math.min( this.max, range.max )
    );
  }

  /**
   * Modifies this range so that it contains both its original range and the input range.
   *
   * This is the mutable form of the function union(). This will mutate (change) this range, in addition to returning
   * this range itself.
   */
  public includeRange( range: Range ): Range {
    return this.setMinMax(
      Math.min( this.min, range.min ),
      Math.max( this.max, range.max )
    );
  }

  /**
   * Modifies this range so that it is the largest range contained both in its original range and in the input range.
   *
   * This is the mutable form of the function intersection(). This will mutate (change) this range, in addition to returning
   * this range itself.
   */
  public constrainRange( range: Range ): Range {
    return this.setMinMax(
      Math.max( this.min, range.min ),
      Math.min( this.max, range.max )
    );
  }

  /**
   * REVIEW: do we also need a mutable form of shifted?
   *
   * Returns a new range that is the same as this range, but shifted by the specified amount.
   */
  public shifted( n: number ): Range {
    return new Range( this.min + n, this.max + n ); // eslint-disable-line no-html-constructors
  }

  /**
   * Converts the attributes of this range to a string
   */
  public toString(): string {
    return `[Range (min:${this._min} max:${this._max})]`;
  }

  /**
   * Constrains a value to the range.
   */
  public constrainValue( value: number ): number {
    return Math.min( Math.max( value, this._min ), this._max );
  }

  /**
   * Determines if this Range is equal to some object.
   */
  public equals( object: IntentionalAny ): boolean {
    return ( this.constructor === object.constructor ) &&
           ( this._min === object.min ) &&
           ( this._max === object.max );
  }

  /**
   * Given a value, normalize it to this Range's length, returning a value between 0 and 1 for values contained in
   * the Range. If the value is not contained in Range, then the return value will not be between 0 and 1.
   */
  public getNormalizedValue( value: number ): number {
    assert && assert( this.getLength() !== 0, 'cannot get normalized value without a range length' );
    return ( value - this.min ) / this.getLength();
  }

  /**
   * Compute the opposite of a normalized value. Given a normalized value (between 0 and 1). Worked with any number
   * though, (even outside of the range). It is the client's responsibility to clamp if that is important to the
   * usage.
   */
  public expandNormalizedValue( normalizedValue: number ): number {
    assert && assert( this.getLength() !== 0, 'cannot get expand normalized value without a range length' );
    return normalizedValue * this.getLength() + this.min;
  }

  /**
   * In https://github.com/phetsims/dot/issues/57, defaultValue was moved to RangeWithValue.
   * This ES5 getter catches programming errors where defaultValue is still used with Range.
   */
  public get defaultValue(): number {
    throw new Error( 'defaultValue is undefined, did you mean to use RangeWithValue?' );
  }

  public static RangeIO = new IOType<Range, RangeStateObject>( 'RangeIO', {
    valueType: Range,
    documentation: 'A range with "min" and a "max" members.',
    toStateObject: ( range: Range ): RangeStateObject => ( {
      min: InfiniteNumberIO.toStateObject( range.min ),
      max: InfiniteNumberIO.toStateObject( range.max )
    } ),

    // eslint-disable-next-line no-html-constructors
    fromStateObject: ( stateObject: RangeStateObject ) => new Range(
      InfiniteNumberIO.fromStateObject( stateObject.min ),
      InfiniteNumberIO.fromStateObject( stateObject.max )
    ),
    stateSchema: {
      min: InfiniteNumberIO,
      max: InfiniteNumberIO
    }
  } );

  public static readonly EVERYTHING = new Range( Number.NEGATIVE_INFINITY, Number.POSITIVE_INFINITY ); // eslint-disable-line no-html-constructors
  public static readonly NOTHING = new Range( Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY ); // eslint-disable-line no-html-constructors
}

dot.register( 'Range', Range );

export default Range;