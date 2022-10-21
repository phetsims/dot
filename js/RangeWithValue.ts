// Copyright 2016-2022, University of Colorado Boulder

/**
 * A numeric range with a required default value.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Chris Klusendorf (PhET Interactive Simulations)
 */

import Range from './Range.js';
import dot from './dot.js';
import IntentionalAny from '../../phet-core/js/types/IntentionalAny.js';

class RangeWithValue extends Range {

  private readonly _defaultValue: number;

  /**
   * @param min - the minimum value of the range
   * @param max - the maximum value of the range
   * @param defaultValue - default value inside the range
   */
  public constructor( min: number, max: number, defaultValue: number ) {

    super( min, max );

    assert && assert( defaultValue !== undefined, 'default value is required' );
    assert && assert( defaultValue >= min && defaultValue <= max, `defaultValue is out of range: ${defaultValue}` );

    this._defaultValue = defaultValue;
  }


  /**
   * Getter for defaultValue
   */
  public getDefaultValue(): number {
    return this._defaultValue;
  }

  public override get defaultValue(): number {
    return this.getDefaultValue();
  }

  /**
   * Setter for min
   */
  public override setMin( min: number ): void {
    assert && assert( this._defaultValue >= min, `min must be <= defaultValue: ${min}` );
    super.setMin( min );
  }

  /**
   * Setter for max
   */
  public override setMax( max: number ): void {
    assert && assert( this._defaultValue <= max, `max must be >= defaultValue: ${max}` );
    super.setMax( max );
  }

  /**
   * Setter for min and max
   */
  public override setMinMax( min: number, max: number ): this {
    assert && assert( this._defaultValue >= min, `min must be <= defaultValue: ${min}` );
    assert && assert( this._defaultValue <= max, `max must be >= defaultValue: ${max}` );

    // REVIEW: Same as setMinMax in Range.ts, returning a value in a setter seems odd...
    return super.setMinMax( min, max );
  }

  /**
   * Converts the attributes of this range to a string
   */
  public override toString(): string {
    return `[RangeWithValue (min:${this.min} max:${this.max} defaultValue:${this._defaultValue})]`;
  }

  /**
   * Determines if this RangeWithValue is equal to some object.
   */
  public override equals( object: IntentionalAny ): boolean {
    return ( this.constructor === object.constructor ) &&
           ( this._defaultValue === object.defaultValue ) &&
           super.equals( object );
  }
}

dot.register( 'RangeWithValue', RangeWithValue );

export default RangeWithValue;