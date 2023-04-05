// Copyright 2017-2023, University of Colorado Boulder

/**
 * Unit tests for dot. Please run once in phet brand and once in brand=phet-io to cover all functionality.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 */

import qunitStart from '../../chipper/js/sim-tests/qunitStart.js';
import './BinPackerTests.js';
import './Bounds2Tests.js';
import './ComplexTests.js';
import './DampedHarmonicTests.js';
import './LinearFunctionTests.js';
import './Matrix3Tests.js';
import './MatrixOps3Tests.js';
import './OpenRangeTests.js';
import './PiecewiseLinearFunctionTests.js';
import './RangeTests.js';
import './RandomTests.js';
import './RangeWithValueTests.js';
import './RunningAverageTests.js';
import './StatsTests.js';
import './toFixedPointStringTests.js';
import './Transform3Tests.js';
import './UtilsTests.js';
import './Vector2PropertyTests.js';
import './Vector2Tests.js';

// Since our tests are loaded asynchronously, we must direct QUnit to begin the tests
qunitStart();