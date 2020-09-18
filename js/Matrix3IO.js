// Copyright 2019-2020, University of Colorado Boulder

/**
 * IO Type for Matrix3
 *
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import IOType from '../../tandem/js/types/IOType.js';
import dot from './dot.js';
import Matrix3 from './Matrix3.js';

const Matrix3IO = new IOType( 'Matrix3IO', {
  valueType: Matrix3,
  documentation: 'A 3x3 matrix often used for holding transform data.',
  toStateObject: matrix3 => Matrix3.toStateObject( matrix3 ),
  fromStateObject: Matrix3.fromStateObject
} );

dot.register( 'Matrix3IO', Matrix3IO );
export default Matrix3IO;