// Copyright 2021, University of Colorado Boulder

/**
 * A singleton instance that is statically seeded; for use generally.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import dot from './dot.js';
import Random from './Random.js';

const dotRandom = new Random( {
  seed: _.hasIn( window, 'phet.chipper.queryParameters.randomSeed' ) ? window.phet.chipper.queryParameters.randomSeed : null
} );

dot.register( 'dotRandom', dotRandom );

export default dotRandom;