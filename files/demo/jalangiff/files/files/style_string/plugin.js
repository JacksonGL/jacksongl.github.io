/*  
 *  Plug-in template for you, 
 *  do whatever you want. Have fun :)
 */
J$.analysis = {};

((function (sandbox){
    var cssConstructor = document.createElement('div').style.constructor;
    // during a binary operation
    // result_c is the result and should be returned
    function binary (iid, op, left, right, result_c) {
        if (op === '===' || op === '!==' || op === '==' || op === '!=') {
          if ((typeof left === 'string' && right instanceof cssConstructor)
             || (typeof right === 'string' && left instanceof  cssConstructor)) {
            console.log('[iid: ' + JSON.stringify(iidToLocation(iid)) + ']: ' + left + ' ' + op + ' ' + right);
            if(right instanceof cssConstructor) {
              console.log(right.toString());
            } else {
              console.log(left.toString());
            }
            console.log('\t result: ' + result_c);
          }
        }
        return result_c;
    }
    
    var regexp = /([^\d])+/g;
    
    // called before setting field to an entity (e.g., object, function etc.)
    // base is the entity, offset is the field name, so val === base[offset]
    // should return val
    function putFieldPre (iid, base, offset, val) {
        if(base instanceof cssConstructor && (offset === 'width' || offset === 'height')) {
            // if the value is just a number or a string represents a pure number
            if(typeof val ==='number' || (typeof val === 'string' && val.match(regexp)!== null)) {
                console.log('[iid: ' + JSON.stringify(iidToLocation(iid)) + ']: setting a number ' + val + ' to style.' + offset + ' without unit is not safe across browsers.');
            }
        }
        return val;
    }
    
    function iidToLocation(iid) {
        if(window.iidToLocationMap) {
            var location = window.iidToLocationMap[iid];
            if(location) {
                return {line: location[1], col: location[2]};
            }
        }
        return iid;
    }
    
    sandbox.binary = binary;
    sandbox.putFieldPre = putFieldPre;
})(J$.analysis));