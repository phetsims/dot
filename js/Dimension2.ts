// Copyright 2013-2024, University of Colorado Boulder

/**
 * Dimension2 is a basic width and height, like a Bounds2 but without the position defined.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import InfiniteNumberIO from '../../tandem/js/types/InfiniteNumberIO.js';
import IOType from '../../tandem/js/types/IOType.js';
import { StateObject } from '../../tandem/js/types/StateSchema.js';
import Bounds2 from './Bounds2.js';
import dot from './dot.js';

const STATE_SCHEMA = {
  width: InfiniteNumberIO,
  height: InfiniteNumberIO
};
export type Dimension2StateObject = StateObject<typeof STATE_SCHEMA>;

export default class Dimension2 {

  // Width of the dimension
  public width: number;

  // Height of the dimension
  public height: number;

  public constructor( width: number, height: number ) {
    this.width = width;
    this.height = height;
  }

  /**
   * Debugging string for the dimension.
   */
  public toString(): string {
    return `[${this.width}w, ${this.height}h]`;
  }

  /**
   * Sets this dimension to be a copy of another dimension.
   * This is the mutable form of the function copy(). This will mutate (change) this dimension, in addition to returning
   * this dimension itself.
   */
  public set( dimension: Dimension2 ): Dimension2 {
    this.width = dimension.width;
    this.height = dimension.height;
    return this;
  }

  /**
   * Sets the width of the dimension, returning this.
   */
  public setWidth( width: number ): Dimension2 {
    this.width = width;
    return this;
  }

  /**
   * Sets the height of the dimension, returning this.
   */
  public setHeight( height: number ): Dimension2 {
    this.height = height;
    return this;
  }

  /**
   * Creates a copy of this dimension, or if a dimension is passed in, set that dimension's values to ours.
   * This is the immutable form of the function set(), if a dimension is provided. This will return a new dimension,
   * and will not modify this dimension.
   *
   * @param [dimension] - If not provided, creates a new Dimension2 with filled in values. Otherwise, fills
   *                      in the values of the provided dimension so that it equals this dimension.
   */
  public copy( dimension?: Dimension2 ): Dimension2 {
    if ( dimension ) {
      return dimension.set( this );
    }
    else {
      return new Dimension2( this.width, this.height );
    }
  }

  /**
   * Swap width and height and return a new Dimension2
   */
  public swapped(): Dimension2 {
    return new Dimension2( this.height, this.width );
  }

  /**
   * Creates a Bounds2 from this dimension based on passing in the minimum (top-left) corner as (x,y).
   * @param [x] - Minimum x coordinate of the bounds, or 0 if not provided.
   * @param [y] - Minimum y coordinate of the bounds, or 0 if not provided.
   */
  public toBounds( x?: number, y?: number ): Bounds2 {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    return new Bounds2( x, y, this.width + x, this.height + y );
  }

  /**
   * Exact equality comparison between this dimension and another dimension.
   */
  public equals( that: Dimension2 ): boolean {
    return this.width === that.width && this.height === that.height;
  }

  /**
   * Exact equality comparison between this dimension and another dimension.
   *
   * Whether difference between the two dimensions has no component with an absolute value greater than epsilon.
   */
  public equalsEpsilon( that: Dimension2, epsilon = 0 ): boolean {
    return Math.max(
      Math.abs( this.width - that.width ),
      Math.abs( this.height - that.height )
    ) <= epsilon;
  }

  public toStateObject(): Dimension2StateObject {
    return {
      width: InfiniteNumberIO.toStateObject( this.width ),
      height: InfiniteNumberIO.toStateObject( this.height )
    };
  }

  public static fromStateObject( stateObject: Dimension2StateObject ): Dimension2 {
    return new Dimension2(
      InfiniteNumberIO.fromStateObject( stateObject.width ),
      InfiniteNumberIO.fromStateObject( stateObject.height )
    );
  }

  public static Dimension2IO = new IOType<Dimension2, Dimension2StateObject>( 'Dimension2IO', {
    valueType: Dimension2,
    documentation: 'A dimension with "width" and "height" members.',
    stateSchema: STATE_SCHEMA,
    toStateObject: ( range: Dimension2 ) => range.toStateObject(),
    fromStateObject: ( stateObject: Dimension2StateObject ) => Dimension2.fromStateObject( stateObject )
  } );
}

dot.register( 'Dimension2', Dimension2 );