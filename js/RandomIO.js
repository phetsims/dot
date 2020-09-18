// Copyright 2017-2020, University of Colorado Boulder

/**
 * IO Type for Random
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import IOType from '../../tandem/js/types/IOType.js';
import dot from './dot.js';
import Random from './Random.js';

const RandomIO = new IOType( 'RandomIO', {
  valueType: Random,
  documentation: 'Generates pseudorandom values'
} );

dot.register( 'RandomIO', RandomIO );
export default RandomIO;