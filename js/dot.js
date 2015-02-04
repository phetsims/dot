// Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // object allocation tracking
  window.phetAllocation = require( 'PHET_CORE/phetAllocation' );

  // workaround for Axon, since it needs window.arch to be defined
  window.arch = window.arch || null;

  var dot = function dot() {
    switch( arguments.length ) {
      case 2:
        return new dot.Vector2( arguments[ 0 ], arguments[ 1 ] );
      case 3:
        return new dot.Vector3( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ] );
      case 4:
        return new dot.Vector4( arguments[ 0 ], arguments[ 1 ], arguments[ 2 ], arguments[ 3 ] );
      default:
        throw new Error( 'dot takes 2-4 arguments' );
    }
  };

  // TODO: performance: check browser speed to compare how fast this is. We may need to add a 32 option for GL ES.
  dot.FastArray = window.Float64Array ? window.Float64Array : window.Array;

  // will be filled in by other modules
  return dot;
} );
