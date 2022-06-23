// Copyright 2019-2022, University of Colorado Boulder

/**
 * Statistics functions for Dot.
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import dot from './dot.js';

const Stats = {

  /**
   * Inspired by https://stackoverflow.com/questions/30893443/highcharts-boxplots-how-to-get-five-point-summary
   * @param {Array.<number>} numbers
   * @param {number} percentile
   * @returns {number|null}
   */
  getPercentile( numbers, percentile ) {
    assert && assert( Array.isArray( numbers ) );
    assert && numbers.forEach( n => assert && assert( typeof n === 'number' ) );

    if ( numbers.length === 0 ) {
      return null;
    }

    numbers.sort( ( a, b ) => a - b );
    const index = ( percentile / 100 ) * numbers.length;
    let result = null;

    // for integers
    if ( Math.floor( index ) === index ) {
      result = ( numbers[ ( index - 1 ) ] + numbers[ index ] ) / 2;
    }
    else {

      // for decimal
      result = numbers[ Math.floor( index ) ];
    }
    return result;
  },

  /**
   * Get the median from an unsorted array of numbers
   * @public
   *
   * @param {Array.<number>} numbers - (un)sorted array
   * @returns {number|null} - null if array is empty
   */
  median( numbers ) {
    return Stats.getPercentile( numbers, 50 );
  },

  /**
   * see https://www.whatissixsigma.net/box-plot-diagram-to-identify-outliers/ for formulas
   * @param {Array.<number>} numbers
   * @returns {{q1:number, median:number, q3:number}} -
   */
  getBoxPlotValues( numbers ) {
    assert && assert( numbers.length >= 4, 'need at least 4 values to calculate quartiles' );
    return {
      q1: Stats.getPercentile( numbers, 25 ),
      median: Stats.getPercentile( numbers, 50 ),
      q3: Stats.getPercentile( numbers, 75 )
    };
  },

  /**
   * Get the limits for a data set
   * @param {Array.<number>} numbers
   * @returns {Object}
   */
  getBoxPlotLimits( numbers ) {
    assert && assert( Array.isArray( numbers ) );
    assert && assert( numbers.length >= 4, 'need at least 4 values to calculate data limits' );
    assert && numbers.forEach( n => assert && assert( typeof n === 'number' ) );

    const quartiles = Stats.getBoxPlotValues( numbers );

    // calculate inter-quartile range
    const iqr = quartiles.q3 - quartiles.q1;

    const lowerLimit = quartiles.q1 - 1.5 * iqr;
    const upperLimit = quartiles.q3 + 1.5 * iqr;
    return {
      lowerLimit: lowerLimit,
      upperLimit: upperLimit
    };
  }
};

dot.register( 'Stats', Stats );

export default Stats;