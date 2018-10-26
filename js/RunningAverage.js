// Copyright 2017, University of Colorado Boulder

/**
 * Data structure that keeps track of running average over a given window.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Jonathan Olson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var dot = require( 'DOT/dot' );
  var inherit = require( 'PHET_CORE/inherit' );

  /**
   * @param {number} windowSize - number of points to average
   * @constructor
   */
  function RunningAverage( windowSize ) {

    assert && assert( windowSize > 0, 'window size must be positive' );

    // @private {number}
    this.windowSize = windowSize;

    // @private {number[]} - Used circularly.
    this.samples = new Array( windowSize );

    // @private {number} - We add/subtract samples in a circular array pattern using this index.
    this.sampleIndex = 0;

    // @private {number} - Total sum of the samples within the window (not yet divided by number of samples)
    this.total = 0;

    // @private {number} - number of samples received so far
    this.numSamples = 0;

    this.clear();
  }

  dot.register( 'RunningAverage', RunningAverage );

  return inherit( Object, RunningAverage, {

    /**
     * Clear the running average.
     * @public
     */
    clear: function() {
      this.total = 0;
      this.numSamples = 0;

      // Need to clear all of the samples
      for ( var i = 0; i < this.windowSize; i++ ) {
        this.samples[ i ] = 0;
      }
    },

    /**
     * Gets the current value of the running average.
     * @public
     *
     * @returns {number}
     */
    getRunningAverage: function() {
      return this.total / this.numSamples;
    },

    /**
     * Returns whether the number of samples is at least as large as the window size (the buffer is full).
     * @public
     *
     * @returns {boolean}
     */
    isSaturated: function() {
      return this.numSamples >= this.windowSize;
    },

    /**
     * Add a data point to the average and return the new running average.
     * @public
     *
     * @param {number} sample
     * @returns {number}
     */
    updateRunningAverage: function( sample ) {
      assert && assert( typeof sample === 'number' && isFinite( sample ) );

      // Limit at the window size
      this.numSamples = Math.min( this.windowSize, this.numSamples + 1 );

      // Remove the old sample (will be 0 if there was no sample yet, due to clear())
      this.total -= this.samples[ this.sampleIndex ];
      assert && assert( isFinite( this.total ) );

      // Add in the new sample
      this.total += sample;
      assert && assert( isFinite( this.total ) );

      // Overwrite in the array and move to the next index
      this.samples[ this.sampleIndex ] = sample;
      this.sampleIndex = ( this.sampleIndex + 1 ) % this.windowSize;

      return this.getRunningAverage();
    }
  } );
} );