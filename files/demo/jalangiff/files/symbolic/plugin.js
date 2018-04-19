/*
 *  Plug-in template for you,
 *  do whatever you want. Have fun :)
 */
J$.analysis = {};

(function (sandbox) {
    function AnalysisEngine() {
        var smemory = sandbox.smemory;
        var iidToLocation = sandbox.iidToLocation;
        var Constants = sandbox.Constants;
        var Config = sandbox.Config;
        var HOP = Constants.HOP;
        var sort = Array.prototype.sort;
        var verbose = false;
        var debug_info = function(val) {
            if(verbose) {
                console.log(val);
            }
        }
        
        function mergeSlice(slice1, slice2) {
            var slice = {};
            for(var prop in slice1) {
                if(slice1.hasOwnProperty(prop)) {
                    slice[prop] = slice1[prop];
                }
            }
            //console.log('[slice2] ' + JSON.stringify(slice2));
            for(var prop in slice2) {
                if(slice2.hasOwnProperty(prop)) {
                    slice[prop] = slice2[prop];
                }
            }
            //console.log('[merge] ' + JSON.stringify(slice));
            return slice;
        }

        function J$wrapper(val) {
            this.value = val;
            this.slice = {};
        }
        
        function isExtFun(f) {
            if(f && f.toString().indexOf('[native code]')>=0) {
                return true;
            }
            
            if(f && f.toString().indexOf('consoleOutput')>=0) {
                return true;
            }
            
            return false;
        }

        var info = {};

        this.installAxiom = function (c) {};

        this.makeConcolic = function (idx, val, getNextSymbol) {
            return val;
        };

        this.makeConcolicPost = function () {};

        this.declare = function (iid, name, val, isArgument) {};

        this.literalPre = function (iid, val) {};

        this.literal = function (iid, val) {
            var type_str = typeof val;
            // TODO: need to consider typed array
            if (type_str === 'number' || type_str === 'boolean' || type_str === 'string') {
                debug_info('wrapper at literal');
                val = new J$wrapper(val);
                val.slice[iid] = 1;
            }
            return val;
        };

		var tmpSlice;
        this.invokeFunPre = function (iid, f, base, args, isConstructor) {
			tmpSlice = {};
            if(isExtFun(f)){
                for(var i=0;i<args.length;i++) {
                    if(args[i] instanceof J$wrapper) {
                        debug_info('dewrapping before calling external function: ' + f.name);
						tmpSlice = mergeSlice(tmpSlice, args[i].slice);
                        args[i] = args[i].value;
                    }
                }
            }
			//console.log('invoke pre: ' + JSON.stringify(tmpSlice));
        };

        this.invokeFun = function (iid, f, base, args, val, isConstructor) {
            tmpSlice[iid] = 1;
			
			if(isExtFun(f)){
                debug_info('wrapping return value from external function: ' + f.name);
                val = new J$wrapper(val);
            }
			
			if(val instanceof J$wrapper) {
				val.slice = tmpSlice;
				
				if(f && f.toString().indexOf('consoleOutput')>=0) {
					console.log('after function: ' + f.name);
					for(var prop in tmpSlice) {
						if(tmpSlice.hasOwnProperty(prop)) {
							console.log(iidToLocation(prop) +',' )
						}
					}
					console.log();
				}
				
			}
            return val;
        };

        this.getFieldPre = function (iid, base, offset) {}

        this.getField = function (iid, base, offset, val) {
            return val;
        }

        this.putFieldPre = function (iid, base, offset, val) {
            return val;
        };

        this.putField = function (iid, base, offset, val) {
            return val;
        };

        this.readPre = function (iid, name, val, isGlobal) {};

        this.read = function (iid, name, val, isGlobal) {
            return val;
        };

        this.writePre = function (iid, name, val, oldValue) {};

        this.write = function (iid, name, val, oldValue) {
            return val;
        };

        this.binaryPre = function (iid, op, left, right) {};

        this.binary = function (iid, op, left, right, result_c) {
            var left_value = left,
            right_value = right,
            recalc = false,
			left_slice = {}, right_slice = {};
            if (left instanceof J$wrapper) {
                left_value = left.value;
				left_slice = left.slice;
                recalc = true;
            }
            if (right instanceof J$wrapper) {
                right_value = right.value;
				right_slice = right.slice;
                recalc = true;
            }
            if(recalc) {
                debug_info('wrapping at binary');
                debug_info('\t' + left_value + op + right_value);
                result_c = new J$wrapper(eval(left_value + op + right_value));
				result_c.slice = mergeSlice(left_slice, right_slice);
				result_c.slice[iid] = 1;
            }
            return result_c;
        };

        this.unaryPre = function (iid, op, left) {};

        this.unary = function (iid, op, left, result_c) {
            var left_value = left, left_slice = {};
            recalc = false;
            if (left instanceof J$wrapper) {
                left_value = left.value;
				left_slice = left.slice;
                recalc = true;
            }
            if(recalc) {
                debug_info('wrapping at unary');
                debug_info('\t' + op + left_value);
                result_c = new J$wrapper(eval(op + left_value));
				result_c.slice = left.slice;
				result_c.slice[iid] = 1;
            }
            return result_c;
        };

        this.conditionalPre = function (iid, left) {};

        this.conditional = function (iid, left, result_c) {
            if(left instanceof J$wrapper) {
                left = left.value;
            }
            return left;
        };

        this.endExecution = function () {};

        this.functionEnter = function (iid, fun, dis /* this */
        ) {};

        this.functionExit = function (iid) {
            return false;
            /* a return of false means that do not backtrack inside the function */
        };

        this.return_ = function (val) {
            return val;
        };

        this.scriptEnter = function (iid, fileName) {};

        this.scriptExit = function (iid) {};

        this.instrumentCode = function (iid, code) {
            return code;
        };

    }

    sandbox.analysis = new AnalysisEngine();
}(J$));