// Copyright 2013-2024, University of Colorado Boulder

// @author Jonathan Olson <jonathan.olson@colorado.edu>

import Namespace from '../../phet-core/js/Namespace.js';

const dot = new Namespace( 'dot' );

// TODO: performance: check browser speed to compare how fast this is. We may need to add a 32 option for GL ES. https://github.com/phetsims/dot/issues/96
dot.register( 'FastArray', window.Float64Array ? window.Float64Array : window.Array );

// will be filled in by other modules
export default dot;