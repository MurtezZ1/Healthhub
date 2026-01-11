console.log("TEST SCRIPT EXECUTING");
try {
    document.getElementById('root').innerHTML = "<h1>TEST SCRIPT WORKS</h1>";
    console.log("DOM Updated by Test Script");
} catch (e) {
    console.error("Test Script Error", e);
}
