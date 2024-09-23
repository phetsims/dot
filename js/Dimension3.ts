// Copyright 2013-2024, University of Colorado Boulder

/**
 * Dimension3 is a basic width, height, and depth, like a Bounds3 but without the position defined.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 * @author Chris Malley (PixelZoom, Inc.)
 */

import InfiniteNumberIO from '../../tandem/js/types/InfiniteNumberIO.js';
import IOType from '../../tandem/js/types/IOType.js';
import { StateObject } from '../../tandem/js/types/StateSchema.js';
import Bounds3 from './Bounds3.js';
import dot from './dot.js';

const STATE_SCHEMA = {
  width: InfiniteNumberIO,
  height: InfiniteNumberIO,
  depth: InfiniteNumberIO
};
export type Dimension3StateObject = StateObject<typeof STATE_SCHEMA>;

export default class Dimension3 {

  public width: number;
  public height: number;
  public depth: number;

  public constructor( width: number, height: number, depth: number ) {
    this.width = width;
    this.height = height;
    this.depth = depth;
  }

  /**
   * Debugging string for the dimension.
   */
  public toString(): string {
    return `[${this.width}w, ${this.height}h, ${this.depth}d]`;
  }

  /**
   * Sets this dimension to be a copy of another dimension.
   * This is the mutable form of the function copy(). This will mutate (change) this dimension, in addition to returning
   * this dimension itself.
   */
  public set( dimension: Dimension3 ): Dimension3 {
    this.width = dimension.width;
    this.height = dimension.height;
    this.depth = dimension.depth;
    return this;
  }

  /**
   * Sets the width of the dimension, returning this.
   */
  public setWidth( width: number ): Dimension3 {
    this.width = width;
    return this;
  }

  /**
   * Sets the height of the dimension, returning this.
   */
  public setHeight( height: number ): Dimension3 {
    this.height = height;
    return this;
  }

  /**
   * Sets the depth of the dimension, returning this.
   */
  public setDepth( depth: number ): Dimension3 {
    this.depth = depth;
    return this;
  }

  /**
   * Creates a copy of this dimension, or if a dimension is passed in, set that dimension's values to ours.
   * This is the immutable form of the function set(), if a dimension is provided. This will return a new dimension,
   * and will not modify this dimension.
   *
   * @param [dimension] - If not provided, creates a new Dimension3 with filled in values. Otherwise, fills
   *                      in the values of the provided dimension so that it equals this dimension.
   */
  public copy( dimension?: Dimension3 ): Dimension3 {
    if ( dimension ) {
      return dimension.set( this );
    }
    else {
      return new Dimension3( this.width, this.height, this.depth );
    }
  }

  /**
   * Creates a Bounds2 from this dimension based on passing in the minimum (top-left) corner as (x,y).
   * @param [x] - Minimum x coordinate of the bounds, or 0 if not provided.
   * @param [y] - Minimum y coordinate of the bounds, or 0 if not provided.
   * @param [z] - Minimum z coordinate of the bounds, or 0 if not provided.
   */
  public toBounds( x?: number, y?: number, z?: number ): Bounds3 {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    z = z !== undefined ? z : 0;
    return new Bounds3( x, y, z, this.width + x, this.height + y, this.depth + z );
  }

  /**
   * Exact equality comparison between this dimension and another dimension.
   */
  public equals( that: Dimension3 ): boolean {
    return this.width === that.width && this.height === that.height && this.depth === that.depth;
  }

  public toStateObject(): Dimension3StateObject {
    return {
      width: InfiniteNumberIO.toStateObject( this.width ),
      height: InfiniteNumberIO.toStateObject( this.height ),
      depth: InfiniteNumberIO.toStateObject( this.depth )
    };
  }

  public static fromStateObject( stateObject: Dimension3StateObject ): Dimension3 {
    return new Dimension3(
      InfiniteNumberIO.fromStateObject( stateObject.width ),
      InfiniteNumberIO.fromStateObject( stateObject.height ),
      InfiniteNumberIO.fromStateObject( stateObject.depth )
    );
  }

  public static Dimension3IO = new IOType<Dimension3, Dimension3StateObject>( 'Dimension3IO', {
    valueType: Dimension3,
    documentation: 'A dimension with "width", "height", and "depth" members.',
    stateSchema: STATE_SCHEMA,
    toStateObject: ( range: Dimension3 ) => range.toStateObject(),
    fromStateObject: ( stateObject: Dimension3StateObject ) => Dimension3.fromStateObject( stateObject )
  } );
}

dot.register( 'Dimension3', Dimension3 );