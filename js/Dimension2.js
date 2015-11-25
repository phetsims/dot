// Copyright 2013-2015, University of Colorado Boulder

/**
 * Basic width and height, like a Bounds2 but without the location defined.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

define( function( require ) {
  'use strict';

  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  require( 'DOT/Bounds2' );

  /**
   * Creates a 2-dimensional size with a width and height
   * @constructor
   * @public
   *
   * @param {number} width
   * @param {number} height
   */
  function Dimension2( width, height ) {
    // @public {number} - Width of the dimension
    this.width = width;

    // @public {number} - Height of the dimension
    this.height = height;
  }

  dot.register( 'Dimension2', Dimension2 );

  inherit( Object, Dimension2, {
    /**
     * Debugging string for the dimension.
     * @public
     *
     * @returns {string}
     */
    toString: function() {
      return '[' + this.width + 'w, ' + this.height + 'h]';
    },

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
    set: function( dimension ) {
      this.width = dimension.width;
      this.height = dimension.height;
      return this;
    },

    /**
     * Sets the width of the dimension, returning this.
     * @public
     *
     * @param {number} width
     * @returns {Dimension2}
     */
    setWidth: function( width ) {
      this.width = width;
      return this;
    },

    /**
     * Sets the height of the dimension, returning this.
     * @public
     *
     * @param {number} height
     * @returns {Dimension2}
     */
    setHeight: function( height ) {
      this.height = height;
      return this;
    },

    /**
     * Creates a copy of this dimension, or if a dimension is passed in, set that dimension's values to ours.
     * @public
     *
     * This is the immutable form of the function set(), if a dimension is provided. This will return a new dimension,
     * and will not modify this dimension.
     *
     * @param {Dimension2} [dimension] - If not provided, creates a new Vector2 with filled in values. Otherwise, fills
     *                                   in the values of the provided dimension so that it equals this dimension.
     * @returns {Dimension2}
     */
    copy: function( dimension ) {
      if ( dimension ) {
        return dimension.set( this );
      }
      else {
        return new Dimension2( this.width, this.height );
      }
    },

    /**
     * Creates a Bounds2 from this dimension based on passing in the minimum (top-left) corner as (x,y).
     * @public
     *
     * @param {number} [x] - Minimum x coordinate of the bounds, or 0 if not provided.
     * @param {number} [y] - Minimum y coordinate of the bounds, or 0 if not provided.
     * @returns {Bounds2}
     */
    toBounds: function( x, y ) {
      x = x !== undefined ? x : 0;
      y = y !== undefined ? y : 0;
      return new dot.Bounds2( x, y, this.width + x, this.height + y );
    },

    /**
     * Exact equality comparison between this dimension and another dimension.
     * @public
     *
     * @param {Dimension2} other
     * @returns {boolean} - Whether the two dimensions have equal width and height
     */
    equals: function( other ) {
      return this.width === other.width && this.height === other.height;
    }
  } );

  return Dimension2;
} );
