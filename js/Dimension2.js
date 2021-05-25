// Copyright 2013-2021, University of Colorado Boulder

/**
 * Basic width and height, like a Bounds2 but without the location defined.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import Bounds2 from './Bounds2.js';
import dot from './dot.js';

class Dimension2 {
  /**
   * Creates a 2-dimensional size with a width and height
   * @public
   *
   * @param {number} width
   * @param {number} height
   */
  constructor( width, height ) {
    // @public {number} - Width of the dimension
    this.width = width;

    // @public {number} - Height of the dimension
    this.height = height;
  }

  /**
   * Debugging string for the dimension.
   * @public
   *
   * @returns {string}
   */
  toString() {
    return `[${this.width}w, ${this.height}h]`;
  }

  /**
   * Sets this dimension to be a copy of another dimension.
   * @public
   *
   * This is the mutable form of the function copy(). This will mutate (change) this dimension, in addition to returning
   * this dimension itself.
   *
   * @param {Dimension2} dimension
   * @returns {Dimension2}
   */
  set( dimension ) {
    this.width = dimension.width;
    this.height = dimension.height;
    return this;
  }

  /**
   * Sets the width of the dimension, returning this.
   * @public
   *
   * @param {number} width
   * @returns {Dimension2}
   */
  setWidth( width ) {
    this.width = width;
    return this;
  }

  /**
   * Sets the height of the dimension, returning this.
   * @public
   *
   * @param {number} height
   * @returns {Dimension2}
   */
  setHeight( height ) {
    this.height = height;
    return this;
  }

  /**
   * Creates a copy of this dimension, or if a dimension is passed in, set that dimension's values to ours.
   * @public
   *
   * This is the immutable form of the function set(), if a dimension is provided. This will return a new dimension,
   * and will not modify this dimension.
   *
   * @param {Dimension2} [dimension] - If not provided, creates a new Dimension2 with filled in values. Otherwise, fills
   *                                   in the values of the provided dimension so that it equals this dimension.
   * @returns {Dimension2}
   */
  copy( dimension ) {
    if ( dimension ) {
      return dimension.set( this );
    }
    else {
      return new Dimension2( this.width, this.height );
    }
  }

  /**
   * Swap width and height and return a new Dimension2
   * @returns {Dimension2}
   * @public
   */
  swapped() {
    return new Dimension2( this.height, this.width );
  }

  /**
   * Creates a Bounds2 from this dimension based on passing in the minimum (top-left) corner as (x,y).
   * @public
   *
   * @param {number} [x] - Minimum x coordinate of the bounds, or 0 if not provided.
   * @param {number} [y] - Minimum y coordinate of the bounds, or 0 if not provided.
   * @returns {Bounds2}
   */
  toBounds( x, y ) {
    x = x !== undefined ? x : 0;
    y = y !== undefined ? y : 0;
    return new Bounds2( x, y, this.width + x, this.height + y );
  }

  /**
   * Exact equality comparison between this dimension and another dimension.
   * @public
   *
   * @param {Dimension2} other
   * @returns {boolean} - Whether the two dimensions have equal width and height
   */
  equals( other ) {
    return this.width === other.width && this.height === other.height;
  }
}

dot.register( 'Dimension2', Dimension2 );

export default Dimension2;