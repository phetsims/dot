//  Copyright 2002-2014, University of Colorado Boulder

/**
 * Given a rectangular containing area, takes care of allocating and deallocating smaller rectangular "bins" that fit
 * together inside the area and do not overlap.
 *
 * Inpsired from https://github.com/jakesgordon/bin-packing/blob/master/js/packer.js
 *
 * TODO: option for efficiently repacking?
 *
 * @author Sharfudeen Ashraf
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Bounds2 = require( 'DOT/Bounds2' );

  /**
   * @constructor
   *
   * @param {Bounds2} bounds - The available bounds to pack bins inside.
   */
  dot.BinPacker = function BinPacker( bounds ) {
    this.rootBin = new dot.BinPacker.Bin( bounds, null );
  };

  inherit( Object, dot.BinPacker, {
    /**
     * Allocates a region with the specified width and height if possible (returning a {Bin}), otherwise returns null.
     *
     * @param {number} width
     * @param {number} height
     */
    allocate: function( width, height ) {
      // find a leaf bin that has available room (or null)
      var bin = this.rootBin.findAvailableBin( width, height );

      if ( bin ) {
        // split it into a sized sub-bin for our purpose that we will use, and other bins for future allocations
        var sizedBin = bin.split( width, height );

        // mark our bin as used
        sizedBin.use();

        return sizedBin;
      }
      else {
        return null;
      }
    },

    deallocate: function( bin ) {
      bin.unuse();
    },

    // for debugging purposes
    toString: function() {
      var result = '';

      var padding = '';
      function binTree( bin ) {
        result += padding + bin.toString() + '\n';
        padding = padding + '  ';
        _.each( bin.children, binTree );
        padding = padding.substring( 2 );
      }
      binTree( this.rootBin );

      return result;
    }
  } );

  /**
   * A rectangular bin that can be used itself or split into sub-bins
   * @constructor
   *
   * @param {Bounds2} bounds
   */
  dot.BinPacker.Bin = function Bin( bounds, parent ) {
    this.bounds = bounds; // {Bounds2} our containing bounds
    this.parent = parent; // {Bin || null} parent bin, if applicable

    this.isSplit = false; // {boolean} whether our children are responsible for our area
    this.isUsed = false; // {boolean} whether we are marked as a bin that is used
    this.children = []; // {Array.<Bin>}
  };
  inherit( Object, dot.BinPacker.Bin, {

    /**
     * Finds an unused bin with open area that is at least width-x-height in size.
     *
     * @param {number} width
     * @param {number} height
     * @returns {Bin | null}
     */
    findAvailableBin: function( width, height ) {
      assert && assert( width > 0 && height > 0, 'Empty bin requested?' );

      // If we are marked as used ourself, we can't be used
      if ( this.isUsed ) {
        return null;
      }
      // If our bounds can't fit it, skip this entire sub-tree
      else if ( this.bounds.width < width || this.bounds.height < height ) {
        return null;
      }
      // If we have been split, check our children
      else if ( this.isSplit ) {
        for ( var i = 0; i < this.children.length; i++ ) {
          var result = this.children[i].findAvailableBin( width, height );
          if ( result ) {
            return result;
          }
        }
        // No child can fit the area
        return null;
      }
      // Otherwise we are free and our dimensions are compatible (checked above)
      else {
        return this;
      }
    },

    /**
     * Splits this bin into multiple child bins, and returns the child with the dimensions (width,height).
     *
     * @param {number} width
     * @param {number} height
     */
    split: function( width, height ) {
      assert && assert( this.bounds.width >= width && this.bounds.height >= height,
        'Bin does not have space' );
      assert && assert( !this.isSplit, 'Bin should not be re-split' );
      assert && assert( !this.isUsed, 'Bin should not be split when used' );
      assert && assert( width > 0 && height > 0, 'Empty bin requested?' );

      // if our dimensions match exactly, don't split (return ourself)
      if ( width === this.bounds.width && height === this.bounds.height ) {
        return this;
      }

      // mark as split
      this.isSplit = true;

      // locations of the split
      var splitX = this.bounds.minX + width;
      var splitY = this.bounds.minY + height;

      /*
       * How an area is split (for now). In the future, splitting more after determining what we need to fit next would
       * potentially be better, but this preserves the width better (which many times we need).
       *
       *   ************************************
       *   *                  *               *
       *   *                  *               *
       *   *       main       *     right     *
       *   * (width x height) *               *
       *   *                  *               *
       *   ************************************
       *   *                                  *
       *   *              bottom              *
       *   *                                  *
       *   ************************************
       */
      var mainBounds = new Bounds2( this.bounds.minX, this.bounds.minY, splitX, splitY );
      var rightBounds = new Bounds2( splitX, this.bounds.minY, this.bounds.maxX, splitY );
      var bottomBounds = new Bounds2( this.bounds.minX, splitY, this.bounds.maxX, this.bounds.maxY );

      var mainBin = new dot.BinPacker.Bin( mainBounds, this );
      this.children.push( mainBin );

      // only add right/bottom if they take up area
      if ( rightBounds.hasNonzeroArea() ) {
        this.children.push( new dot.BinPacker.Bin( rightBounds, this ) );
      }
      if ( bottomBounds.hasNonzeroArea() ) {
        this.children.push( new dot.BinPacker.Bin( bottomBounds, this ) );
      }

      return mainBin;
    },

    /**
     * Mark this bin as used.
     */
    use: function() {
      assert && assert( !this.isSplit, 'Should not mark a split bin as used' );
      assert && assert( !this.isUsed, 'Should not mark a used bin as used' );

      this.isUsed = true;
    },

    unuse: function() {
      assert && assert( this.isUsed, 'Can only unuse a used instance' );

      this.isUsed = false;

      this.parent && this.parent.attemptToCollapse();
    },

    attemptToCollapse: function() {
      assert && assert( this.isSplit, 'Should only attempt to collapse split bins' );

      // Bail out if a single child isn't able to be collapsed. If it is not split or used, it won't have any children
      // or needs.
      for ( var i = 0; i < this.children.length; i++ ) {
        var child = this.children[i];

        if ( child.isSplit || child.isUsed ) {
          return;
        }
      }

      // We can now collapse ourselves neatly
      this.children = [];
      this.isSplit = false;

      // And attempt to collapse our parent
      this.parent && this.parent.attemptToCollapse();
    },

    // for debugging purposes
    toString: function() {
      return this.bounds.toString() + ( this.isUsed ? ' used' : '' );
    }
  } );

  return dot.BinPacker;
} );
