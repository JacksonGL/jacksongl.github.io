/*  
 *  Plug-in template for you, 
 *  do whatever you want. Have fun :)
 */
J$.analysis = {};

((function (sandbox){
	// called before reading a variable
	function readPre (iid, name, val, isGlobal) {
		console.log('read operation intercepted');
	}
	
	// called during reading a variable, 
	// val is the read value, do not forget to return it
	function read (iid, name, val, isGlobal) {
		return val;
	}
	
	// called before writing a variable
	function writePre (iid, name, val) {
	}

	// called during writing a variable
	// val is the value to be written, do not forget to return it
	function write (iid, name, val) {
		return val;
	}
	
	// called before setting field to an entity (e.g., object, function etc.)
	// base is the entity, offset is the field name, so val === base[offset]
	// should return val
	function putFieldPre (iid, base, offset, val) {
		return val;
	}

	// called during setting field
	// should return val
	function putField (iid, base, offset, val) {
		return val;
	}
	
	// before retrieving field from an entity
	function getFieldPre (iid, base, offset) {
	}

	// during retrieving field from an entity
	function getField (iid, base, offset, val) {
		return val;
	}
	
	// before creating a literal
	function literalPre (iid, val) {
	}

	// during creating a literal
	// should return val
	function literal (iid, val) {
		return val;
	}

	// before invoking a function/method
	function invokeFunPre (iid, f, base, args, isConstructor) {
	}

	// during invoking a function/method
	// val is the return value and should be returned
	function invokeFun (iid, f, base, args, val, isConstructor) {
		return val;
	}
	
	// before doing a binary operation
	function binaryPre (iid, op, left, right) {
	}

	// during a binary operation
	// result_c is the result and should be returned
	function binary (iid, op, left, right, result_c) {
		return result_c;
	}

	// before doing a unary operation
	function unaryPre (iid, op, left) {
	}

	// during a unary operation
	// result_c is the result and should be returned
	function unary (iid, op, left, result_c) {
		return result_c;
	}

	// before getting a conditional expression evaluation
	function conditionalPre (iid, left) {
	}

	// during a conditional expression evaluation
	// result_c is the evaluation result and should be returned
	function conditional (iid, left, result_c) {
		return result_c;
	}
	
	sandbox.readPre = readPre;
	sandbox.read = read;
	sandbox.writePre = writePre;
	sandbox.write = write;
	sandbox.putFieldPre = putFieldPre;
	sandbox.putField = putField;
	sandbox.literalPre = literalPre;
	sandbox.literal = literal;
	sandbox.invokeFunPre = invokeFunPre;
	sandbox.invokeFun = invokeFun;
	sandbox.getFieldPre = getFieldPre;
	sandbox.getField = getField;
	sandbox.binaryPre = binaryPre;
	sandbox.binary = binary;
	sandbox.unaryPre = unaryPre;
	sandbox.unary = unary;
	sandbox.conditionalPre = conditionalPre;
	sandbox.conditional = conditional;
})(J$.analysis));