// Copyright 2020-2021, University of Colorado Boulder

/**
 * Outputs a number for use in SVG's style/transform/path strings.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

import dot from './dot.js';

/**
 * Outputs a number for use in SVG's style/transform/path strings.
 *
 * We need to prevent the numbers from being in an exponential toString form, since the CSS transform does not support
 * that.
 *
 * @param {number} number
 * @returns {string}
 */
function toSVGNumber( number ) {
  // Largest guaranteed number of digits according to https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Global_Objects/Number/toFixed
  // See https://github.com/phetsims/dot/issues/36
  return number.toFixed( 20 ); // eslint-disable-line bad-sim-text
}

dot.register( 'toSVGNumber', toSVGNumber );
export default toSVGNumber;