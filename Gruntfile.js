// Copyright 2013-2016, University of Colorado Boulder

/**
 * Dot grunt tasks
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */

const Gruntfile = require( '../chipper/js/grunt/Gruntfile' );
const registerTasks = require( '../perennial-alias/js/grunt/util/registerTasks' );

// Stream winston logging to the console
module.exports = grunt => {
  Gruntfile( grunt );

  // TODO: what if this could be automatically grabbed based on the repo option or cwd? Would that be buggy? https://github.com/phetsims/chipper/issues/1464
  registerTasks( grunt, `${__dirname}/js/grunt/` );
};