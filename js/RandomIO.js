// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO type for Random
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import ObjectIO from '../../tandem/js/types/ObjectIO.js';
import dot from './dot.js';
import Random from './Random.js';

class RandomIO extends ObjectIO {}

RandomIO.documentation = 'Generates pseudorandom values';
RandomIO.validator = { valueType: Random };
RandomIO.typeName = 'RandomIO';
ObjectIO.validateSubtype( RandomIO );

dot.register( 'RandomIO', RandomIO );
export default RandomIO;