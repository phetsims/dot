
// path to test base, without a slash, e.g. '../../common/dot/tests/qunit'
function runDotTests( pathToTestBase ) {
  function loadTestFile( src ) {
    var script = document.createElement( 'script' );
    script.type = 'text/javascript';
    
    // make sure things aren't cached, just in case
    script.src = pathToTestBase + '/' + src + '?random=' + Math.random().toFixed( 10 );
    
    var other = document.getElementsByTagName( 'script' )[0];
    other.parentNode.insertBefore( script, other );
  }
  
  loadTestFile( 'js/simple-tests.js' );
};
