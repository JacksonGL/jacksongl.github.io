/* This is analysis.js */
/*
 * Copyright 2013 Samsung Information Systems America, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Author: Koushik Sen
// Refactored by Liang Gong for front-end


J$ = {};

(function (sandbox) {
    var MODE_NO_RR_IGNORE_UNINSTRUMENTED = 3,
        MODE_NO_RR = 4,
        MODE_DIRECT = 5;
        
    var isWorker = false;
    window.JALANGI_MODE = 'inbrowser';

    var isBrowser = !(typeof exports !== 'undefined' && this.exports !== exports);
    var mode;
    var executionIndex;
    var branchCoverageInfo;

    mode = (function (str) {
        switch (str) {
            case "analysis":
                return MODE_NO_RR_IGNORE_UNINSTRUMENTED;
            case "inbrowser":
                return MODE_NO_RR;
            case "symbolic":
                return MODE_DIRECT;
            default:
                return MODE_NO_RR;
        }
    }(isBrowser ? window.JALANGI_MODE : process.env.JALANGI_MODE));
    var ANALYSIS = !isBrowser ? process.env.JALANGI_ANALYSIS : undefined;

    if (mode === MODE_DIRECT) {
        /* JALANGI_ANALYSIS file must define all instrumentation functions such as U, B, C, C1, C2, W, R, G, P */
        if (ANALYSIS) {
            sandbox.analysis = require('./' + ANALYSIS);
        }

        sandbox.U = sandbox.analysis.U; // Unary operation
        sandbox.B = sandbox.analysis.B; // Binary operation
        sandbox.C = sandbox.analysis.C; // Condition
        sandbox.C1 = sandbox.analysis.C1; // Switch key
        sandbox.C2 = sandbox.analysis.C2; // case label C1 === C2
        sandbox._ = sandbox.analysis._;  // Last value passed to C

        sandbox.H = sandbox.analysis.H; // hash in for-in
        sandbox.I = sandbox.analysis.I; // Ignore argument
        sandbox.G = sandbox.analysis.G; // getField
        sandbox.P = sandbox.analysis.P; // putField
        sandbox.R = sandbox.analysis.R; // Read
        sandbox.W = sandbox.analysis.W; // Write
        sandbox.N = sandbox.analysis.N; // Init
        sandbox.T = sandbox.analysis.T; // object/function/regexp/array Literal
        sandbox.F = sandbox.analysis.F; // Function call
        sandbox.M = sandbox.analysis.M; // Method call
        sandbox.A = sandbox.analysis.A; // Modify and assign +=, -= ...
        sandbox.Fe = sandbox.analysis.Fe; // Function enter
        sandbox.Fr = sandbox.analysis.Fr; // Function return
        sandbox.Se = sandbox.analysis.Se; // Script enter
        sandbox.Sr = sandbox.analysis.Sr; // Script return 
        sandbox.Rt = sandbox.analysis.Rt; // Value return
        sandbox.Ra = sandbox.analysis.Ra;
        sandbox.Ex = sandbox.analysis.Ex; // try-catch exception
        //sandbox.checkDeclared = sandbox.analysis.checkDeclared;

        sandbox.makeSymbolic = sandbox.analysis.makeSymbolic;
        sandbox.addAxiom = sandbox.analysis.addAxiom;
        sandbox.endExecution = sandbox.analysis.endExecution;
    } else {

//------------------------------- Stats for the paper -----------------------
        var skippedReads = 0;
        var skippedGetFields = 0;
        var unoptimizedLogs = 0;
        var optimizedLogs = 0;

//-------------------------------- Constants ---------------------------------

        var EVAL_ORG = eval;
        var HAS_OWN_PROPERTY = Object.prototype.hasOwnProperty;
        var HAS_OWN_PROPERTY_CALL = Object.prototype.hasOwnProperty.call;

        var PREFIX1 = "J$";
        var SPECIAL_PROP = "*" + PREFIX1 + "*";
        var SPECIAL_PROP2 = "*" + PREFIX1 + "I*";
        var SPECIAL_PROP3 = "*" + PREFIX1 + "C*";
        var DEBUG = false;
        var WARN = false;
        var SERIOUS_WARN = false;
        // make MAX_BUF_SIZE slightly less than 2^16, to allow over low-level overheads
        var MAX_BUF_SIZE = 64000;
        var TRACE_FILE_NAME = 'jalangi_trace';
        // should we keep the trace in memory in the browser?
        // TODO somehow make this a parameter
        var IN_MEMORY_BROWSER_LOG = false;
        //var IN_MEMORY_BROWSER_LOG = isBrowser;

        var T_NULL = 0,
            T_NUMBER = 1,
            T_BOOLEAN = 2,
            T_STRING = 3,
            T_OBJECT = 4,
            T_FUNCTION = 5,
            T_UNDEFINED = 6,
            T_ARRAY = 7;

        var F_TYPE = 0,
            F_VALUE = 1,
            F_IID = 2,
            F_SEQ = 3,
            F_FUNNAME = 4;

        var N_LOG_FUNCTION_ENTER = 4,
            N_LOG_SCRIPT_ENTER = 6,
            N_LOG_GETFIELD = 8,
            N_LOG_ARRAY_LIT = 10,
            N_LOG_OBJECT_LIT = 11,
            N_LOG_FUNCTION_LIT = 12,
            N_LOG_RETURN = 13,
            N_LOG_REGEXP_LIT = 14,
            N_LOG_READ = 17,
            N_LOG_HASH = 19,
            N_LOG_SPECIAL = 20,
            N_LOG_STRING_LIT = 21,
            N_LOG_NUMBER_LIT = 22,
            N_LOG_BOOLEAN_LIT = 23,
            N_LOG_UNDEFINED_LIT = 24,
            N_LOG_NULL_LIT = 25,
            N_LOG_GETFIELD_OWN = 26,
            N_LOG_OPERATION = 27;

        //-------------------------------- End constants ---------------------------------

        var GET_OWN_PROPERTY_NAMES = Object.getOwnPropertyNames;
        Object.getOwnPropertyNames = function() {
            var val = GET_OWN_PROPERTY_NAMES.apply(Object, arguments);
            var idx = val.indexOf(SPECIAL_PROP);
            if (idx > -1) {
                val.splice(idx, 1);
            }
            idx = val.indexOf(SPECIAL_PROP2);
            if (idx > -1) {
                val.splice(idx, 1);
            }
            idx = val.indexOf(SPECIAL_PROP3);
            if (idx > -1) {
                val.splice(idx, 1);
            }
            return val;
        }

        //-------------------------------------- Symbolic functions -----------------------------------------------------------

        var log = (function () {
            var list;

            return {
                reset:function () {
                    list = [];
                },

                log:function (str) {
                    if (list)
                        list.push(str);
                },

                getLog:function () {
                    return list;
                }
            }
        })();


        function getConcrete(val) {
            if (sandbox.analysis && sandbox.analysis.getConcrete) {
                return sandbox.analysis.getConcrete(val);
            } else {
                return val;
            }
        }

        function getSymbolic(val) {
            if (sandbox.analysis && sandbox.analysis.getSymbolic) {
                return sandbox.analysis.getSymbolic(val);
            } else {
                return val;
            }
        }

        function create_fun(f) {
            return function () {
                var len = arguments.length;
                for (var i = 0; i < len; i++) {
                    arguments[i] = getConcrete(arguments[i]);
                }
                return f.apply(getConcrete(this), arguments);
            }
        }

        function getSymbolicFunctionToInvokeAndLog(f, isConstructor) {
            if (f === Array ||
                f === Error ||
                f === String ||
                f === Number ||
                f === Boolean ||
                f === RegExp ||
                f === J$.addAxiom ||
                f === J$.readInput) {
                return [f, true];
            } else if (//f === Function.prototype.apply ||
            //f === Function.prototype.call ||
                f === Object.defineProperty ||
                    f === console.log ||
                    f === RegExp.prototype.test ||
                    f === String.prototype.indexOf ||
                    f === String.prototype.lastIndexOf ||
                    f === String.prototype.substring ||
                    f === String.prototype.substr ||
                    f === String.prototype.charCodeAt ||
                    f === String.prototype.charAt ||
                    f === String.prototype.replace ||
                    f === String.fromCharCode ||
                    f === Math.abs ||
                    f === Math.acos ||
                    f === Math.asin ||
                    f === Math.atan ||
                    f === Math.atan2 ||
                    f === Math.ceil ||
                    f === Math.cos ||
                    f === Math.exp ||
                    f === Math.floor ||
                    f === Math.log ||
                    f === Math.max ||
                    f === Math.min ||
                    f === Math.pow ||
                    f === Math.round ||
                    f === Math.sin ||
                    f === Math.sqrt ||
                    f === Math.tan ||
                    f === parseInt) {
                return  [create_fun(f), false];
            }
            return [null, true];
        }

        function isReturnLogNotRequired(f) {
            if (f === console.log ||
                f === RegExp.prototype.test ||
                f === String.prototype.indexOf ||
                f === String.prototype.lastindexOf ||
                f === String.prototype.substring ||
                f === Math.abs ||
                f === Math.acos ||
                f === Math.asin ||
                f === Math.atan ||
                f === Math.atan2 ||
                f === Math.ceil ||
                f === Math.cos ||
                f === Math.exp ||
                f === Math.floor ||
                f === Math.log ||
                f === Math.max ||
                f === Math.min ||
                f === Math.pow ||
                f === Math.round ||
                f === Math.sin ||
                f === Math.sqrt ||
                f === Math.tan ||
                f === String.prototype.charCodeAt ||
                f === parseInt
                ) {
                return true;
            }
            return false;
        }

        //---------------------------- Utility functions -------------------------------
        function addAxiom(c) {
            if (sandbox.analysis && sandbox.analysis.installAxiom) {
                sandbox.analysis.installAxiom(c);
            }
        }

        function HOP(obj, prop) {
            return HAS_OWN_PROPERTY_CALL.apply(HAS_OWN_PROPERTY, [obj, prop]);
        }


        function debugPrint(s) {
            if (DEBUG) {
                console.log("***" + s);
            }
        }

        function warnPrint(iid, s) {
            if (WARN && iid !== 0) {
                console.log("        at " + iid + " " + s);
            }
        }

        function seriousWarnPrint(iid, s) {
            if (SERIOUS_WARN && iid !== 0) {
                console.log("        at " + iid + " Serious " + s);
            }
        }

        function slice(a, start) {
            return Array.prototype.slice.call(a, start || 0);
        }

        function isNative(f) {
            if(f && f.toString){
                return f.toString().indexOf('[native code]') > -1 || f.toString().indexOf('[object ') === 0;
            } else {
                return false;
            }
        }


        function printValueForTesting(loc, iid, val) {
            return;
            var type = typeof val;
            if (type !== 'object' && type !== 'function') {
                console.log(loc + ":" + iid + ":" + type + ":" + val);
            } else if (val === null) {
                console.log(loc + ":" + iid + ":" + type + ":" + val);
            } else if (HOP(val, SPECIAL_PROP) && HOP(val[SPECIAL_PROP], SPECIAL_PROP)) {
                console.log(loc + ":" + iid + ":" + type + ":" + val[SPECIAL_PROP][SPECIAL_PROP]);
            } else {
                console.log(loc + ":" + iid + ":" + type + ":object");
            }
        }

        //---------------------------- End utility functions -------------------------------


        //-------------------------------- Execution indexing --------------------------------
        function ExecutionIndex() {
            var counters = {};
            var countersStack = [counters];

            function executionIndexCall() {
                counters = {};
                countersStack.push(counters);
            }

            function executionIndexReturn() {
                countersStack.pop();
                counters = countersStack[countersStack.length - 1];
            }

            function executionIndexInc(iid) {
                var c = counters[iid];
                if (c === undefined) {
                    c = 1;
                } else {
                    c++;
                }
                counters[iid] = c;
                counters.iid = iid;
                counters.count = c;
            }

            function executionIndexGetIndex() {
                var i, ret = [];
                var iid;
                for (i = countersStack.length - 1; i >= 0; i--) {
                    iid = countersStack[i].iid;
                    if (iid !== undefined) {
                        ret.push(iid);
                        ret.push(countersStack[i].count);
                    }
                }
                return (ret + "").replace(/,/g, "_");
            }

            if (this instanceof ExecutionIndex) {
                this.executionIndexCall = executionIndexCall;
                this.executionIndexReturn = executionIndexReturn;
                this.executionIndexInc = executionIndexInc;
                this.executionIndexGetIndex = executionIndexGetIndex;
            } else {
                return new ExecutionIndex();
            }
        }

        //-------------------------------- End Execution indexing --------------------------------

        //----------------------------------- Begin Jalangi Library backend ---------------------------------

        var isInstrumentedCaller = false, isConstructorCall = false;
        var returnVal = [];
        var exceptionVal;
        var scriptCount = 0;
        var lastVal;
        var switchLeft;
        var switchKeyStack = [];


        function callAsNativeConstructorWithEval(Constructor, args) {
            var a = [];
            for (var i = 0; i < args.length; i++)
                a[i] = 'args[' + i + ']';
            var eval = EVAL_ORG;
            return eval('new Constructor(' + a.join() + ')');
        }

        function callAsNativeConstructor(Constructor, args) {
            if (args.length === 0) {
                return new Constructor();
            }
            if (args.length === 1) {
                return new Constructor(args[0]);
            }
            if (args.length === 2) {
                return new Constructor(args[0], args[1]);
            }
            if (args.length === 3) {
                return new Constructor(args[0], args[1], args[2]);
            }
            if (args.length === 4) {
                return new Constructor(args[0], args[1], args[2], args[3]);
            }
            if (args.length === 5) {
                return new Constructor(args[0], args[1], args[2], args[3], args[4]);
            }
            return callAsNativeConstructorWithEval(Constructor, args);
        }

        function callAsConstructor(Constructor, args) {
            if (isNative(Constructor)) {
                var ret = callAsNativeConstructor(Constructor, args);
                return ret;
            } else {
                var Temp = function () {
                }, inst, ret;
                Temp.prototype = getConcrete(Constructor.prototype);
                inst = new Temp;
                ret = Constructor.apply(inst, args);
                return Object(ret) === ret ? ret : inst;
            }
        }

        function invokeEval(iid, base, f, args) {
            try {
                if(sandbox.analysis.instrumentCode) {
                    return f(sandbox.analysis.instrumentCode(iid, getConcrete(args[0])));
                } else {
                    return f(getConcrete(args[0]));
                }
            } finally {

            }
        }

        function invokeFun(iid, base, f, args, isConstructor) {
            var g, invoke, val, ic, tmpIsConstructorCall, tmpIsInstrumentedCaller, idx;

            var f_c = getConcrete(f);

            tmpIsConstructorCall = isConstructorCall;
            isConstructorCall = isConstructor;

            if (sandbox.analysis && sandbox.analysis.invokeFunPre) {
                sandbox.analysis.invokeFunPre(iid, f, base, args, isConstructor);
            }

            executionIndex.executionIndexInc(iid);

            var arr = getSymbolicFunctionToInvokeAndLog(f_c, isConstructor);
            tmpIsInstrumentedCaller = isInstrumentedCaller;
            ic = isInstrumentedCaller = f_c === undefined || HOP(f_c, SPECIAL_PROP2) || typeof f_c !== "function";

            if (mode === MODE_NO_RR) {
                invoke = true;
                g = f_c;
            } else if (mode === MODE_NO_RR_IGNORE_UNINSTRUMENTED) {
                invoke = arr[0] || isInstrumentedCaller;
                g = arr[0] || f_c;
            }

            pushSwitchKey();
            try {
                if (g === EVAL_ORG) {
                    val = invokeEval(iid, base, g, args);
                } else if (invoke) {
                    if (isConstructor) {
                        val = callAsConstructor(g, args);
                    } else {
                        val = g.apply(base, args);
                    }
                } else {
                    val = undefined;
                }
            } finally {
                popSwitchKey();
                isInstrumentedCaller = tmpIsInstrumentedCaller;
                isConstructorCall = tmpIsConstructorCall;
            }

            if (sandbox.analysis && sandbox.analysis.invokeFun) {
                val = sandbox.analysis.invokeFun(iid, f, base, args, val, isConstructor);
            }
            //printValueForTesting(2, iid, val);
            return val;
        }

        //var globalInstrumentationInfo;

        function G(iid, base, offset, norr) {
            if (typeof offset === 'number' && isNaN(offset)) {
                console.log('[iid]: '+iid+' offset is ' + offset);
            }

            if (offset === SPECIAL_PROP || offset === SPECIAL_PROP2 || offset === SPECIAL_PROP3) {
                console.log('!!!!!!!!!!!!! offset === SPECIAL_PROP || offset === SPECIAL_PROP2 || offset === SPECIAL_PROP3')
                return undefined;
            }

            var base_c = getConcrete(base);
            if (sandbox.analysis && sandbox.analysis.getFieldPre) {
                sandbox.analysis.getFieldPre(iid, base, offset);
            }

            // what would happen if base_c is undefined?
            var val = base_c[getConcrete(offset)];

            if (sandbox.analysis && sandbox.analysis.getField) {
                val = sandbox.analysis.getField(iid, base, offset, val);
            }
            //printValueForTesting(1, iid, val);

            return val;
        }

        function P(iid, base, offset, val) {

            if (offset === SPECIAL_PROP || offset === SPECIAL_PROP2 || offset === SPECIAL_PROP3) {
                return undefined;
            }

            // window.location.hash = hash calls a function out of nowhere.
            // fix needs to set isInstrumentedCaller to false
            // the following patch is not elegant
            var tmpIsInstrumentedCaller = isInstrumentedCaller;
            isInstrumentedCaller = false;

            var base_c = getConcrete(base);
            if (sandbox.analysis && sandbox.analysis.putFieldPre) {
                val = sandbox.analysis.putFieldPre(iid, base, offset, val);
            }

            if (typeof base_c === 'function' && getConcrete(offset) === 'prototype') {
                base_c[getConcrete(offset)] = getConcrete(val);
            } else {
                base_c[getConcrete(offset)] = val;
            }

            if (sandbox.analysis && sandbox.analysis.putField) {
                val = sandbox.analysis.putField(iid, base, offset, val);
            }


            // the following patch is not elegant
            isInstrumentedCaller = tmpIsInstrumentedCaller;
            return val;
        }


        function F(iid, f, isConstructor) {
            return function () {
                var base = this;
                return invokeFun(iid, base, f, arguments, isConstructor);
            }
        }

        function M(iid, base, offset, isConstructor) {
            return function () {
                var f = G(iid, base, offset);
                return invokeFun(iid, base, f, arguments, isConstructor);
            };
        }

        function Fe(iid, val, dis /* this */) {
            executionIndex.executionIndexCall();
            exceptionVal = undefined;
            returnVal.push(undefined);
            if (sandbox.analysis && sandbox.analysis.functionEnter) {
                sandbox.analysis.functionEnter(iid, val, dis);
            }
        }

        function Fr(iid) {
            var ret = false, tmp;
            executionIndex.executionIndexReturn();

            if (sandbox.analysis && sandbox.analysis.functionExit) {
                ret = sandbox.analysis.functionExit(iid);
            }
            if (exceptionVal !== undefined) {
                tmp = exceptionVal;
                exceptionVal = undefined;
                throw tmp;
            }
            return ret;
        }

        function Ex(iid, e) {
            exceptionVal = e;
        }

        function Ru(name) {
            //console.log('read undeclared! ' + name);
            throw new ReferenceError();
        }

        function checkDeclared(s) {
            try{ eval(s + ';'); }catch(e) { console.log(e); Ru();}
        }

        function Rt(iid, val) {
            if (sandbox.analysis && sandbox.analysis.return_Rt) {
                val = sandbox.analysis.return_Rt(iid, val);
            }
            returnVal.pop();
            returnVal.push(val);
            return val;
        }

        function Ra() {
            var ret = returnVal.pop();
            exceptionVal = undefined;
            if (sandbox.analysis && sandbox.analysis.return_) {
                ret = sandbox.analysis.return_(ret);
            }
            return ret;
        }


        function Se(iid, val) {
            scriptCount++;

            if (sandbox.analysis && sandbox.analysis.scriptEnter) {
                sandbox.analysis.scriptEnter(iid, val);
            }
        }

        function Sr(iid) {
            var tmp;
            scriptCount--;

            if (sandbox.analysis && sandbox.analysis.scriptExit) {
                sandbox.analysis.scriptExit(iid);
            }
            if (mode === MODE_NO_RR_IGNORE_UNINSTRUMENTED && scriptCount === 0) {
                endExecution();
            }
            if (exceptionVal !== undefined) {
                tmp = exceptionVal;
                exceptionVal = undefined;
                throw tmp;
            }
        }

        function I(val) {
            return val;
        }

        function T(iid, val, type) {
            if (sandbox.analysis && sandbox.analysis.literalPre) {
                sandbox.analysis.literalPre(iid, val);
            }

            if (type === N_LOG_FUNCTION_LIT) {
                if (Object && Object.defineProperty && typeof Object.defineProperty === 'function') {
                    Object.defineProperty(val, SPECIAL_PROP2, {
                        enumerable:false,
                        writable:true
                    });
                }
                val[SPECIAL_PROP2] = true;
            }

            if (sandbox.analysis && sandbox.analysis.literal) {
                val = sandbox.analysis.literal(iid, val);
            }

            return val;
        }

        function H(iid, val) {
            return val;
        }


        function R(iid, name, val, isGlobal) {
            if (sandbox.analysis && sandbox.analysis.readPre) {
                sandbox.analysis.readPre(iid, name, val, isGlobal);
            }

            if (sandbox.analysis && sandbox.analysis.read) {
                val = sandbox.analysis.read(iid, name, val, isGlobal);

            }
            //printValueForTesting(3, iid, val);
            return val;
        }

        function W(iid, name, val, lhs) {
            // just in case in front end some code like: window = {};
            // this will make J$ unavailable in the global namespace
            if (window && name == 'window' && !isWorker) {
                if (val != window) {
                    console.log('this piece of code is trying to change the window object with ' + val);
                    val.J$ = J$;
                }
            }

            if (sandbox.analysis && sandbox.analysis.writePre) {
                sandbox.analysis.writePre(iid, name, val, lhs);
            }

            if (sandbox.analysis && sandbox.analysis.write) {
                val = sandbox.analysis.write(iid, name, val, lhs);
            }
            return val;
        }

        function N(iid, name, val, isArgumentSync) {
            if (sandbox.analysis && sandbox.analysis.declare) {
                sandbox.analysis.declare(iid, name, val, isArgumentSync);
            }
            return val;
        }


        function A(iid, base, offset, op) {
            var oprnd1 = G(iid, base, offset);
            return function (oprnd2) {
                var val = B(iid, op, oprnd1, oprnd2);
                return P(iid, base, offset, val);
            };
        }

        function B(iid, op, left, right) {
            var left_c, right_c, result_c, isArith = false;

            if (sandbox.analysis && sandbox.analysis.binaryPre) {
                sandbox.analysis.binaryPre(iid, op, left, right);
            }

            left_c = getConcrete(left);
            right_c = getConcrete(right);

            switch (op) {
                case "+":
                    isArith = true;
                    result_c = left_c + right_c;
                    break;
                case "-":
                    isArith = true;
                    result_c = left_c - right_c;
                    break;
                case "*":
                    isArith = true;
                    result_c = left_c * right_c;
                    break;
                case "/":
                    isArith = true;
                    result_c = left_c / right_c;
                    break;
                case "%":
                    isArith = true;
                    result_c = left_c % right_c;
                    break;
                case "<<":
                    isArith = true;
                    result_c = left_c << right_c;
                    break;
                case ">>":
                    isArith = true;
                    result_c = left_c >> right_c;
                    break;
                case ">>>":
                    isArith = true;
                    result_c = left_c >>> right_c;
                    break;
                case "<":
                    isArith = true;
                    result_c = left_c < right_c;
                    break;
                case ">":
                    isArith = true;
                    result_c = left_c > right_c;
                    break;
                case "<=":
                    isArith = true;
                    result_c = left_c <= right_c;
                    break;
                case ">=":
                    isArith = true;
                    result_c = left_c >= right_c;
                    break;
                case "==":
                    result_c = left_c == right_c;
                    break;
                case "!=":
                    result_c = left_c != right_c;
                    break;
                case "===":
                    result_c = left_c === right_c;
                    break;
                case "!==":
                    result_c = left_c !== right_c;
                    break;
                case "&":
                    isArith = true;
                    result_c = left_c & right_c;
                    break;
                case "|":
                    isArith = true;
                    result_c = left_c | right_c;
                    break;
                case "^":
                    isArith = true;
                    result_c = left_c ^ right_c;
                    break;
                case "instanceof":
                    result_c = left_c instanceof right_c;
                    break;
                case "in":
                    result_c = left_c in right_c;

                    break;
                case "&&":
                    result_c = left_c && right_c;
                    break;
                case "||":
                    result_c = left_c || right_c;
                    break;
                case "regexin":
                    result_c = right_c.test(left_c);
                    break;
                default:
                    throw new Error(op + " at " + iid + " not found");
                    break;
            }


            if (sandbox.analysis && sandbox.analysis.binary) {
                result_c = sandbox.analysis.binary(iid, op, left, right, result_c);
            }
            return result_c;
        }


        function U(iid, op, left) {
            var left_c, result_c, isArith = false;

            if (sandbox.analysis && sandbox.analysis.unaryPre) {
                sandbox.analysis.unaryPre(iid, op, left);
            }

            left_c = getConcrete(left);

            switch (op) {
                case "+":
                    isArith = true;
                    result_c = +left_c;
                    break;
                case "-":
                    isArith = true;
                    result_c = -left_c;
                    break;
                case "~":
                    isArith = true;
                    result_c = ~left_c;
                    break;
                case "!":
                    result_c = !left_c;
                    break;
                case "typeof":
                    result_c = typeof left_c;
                    break;
                default:
                    throw new Error(op + " at " + iid + " not found");
                    break;
            }


            if (sandbox.analysis && sandbox.analysis.unary) {
                result_c = sandbox.analysis.unary(iid, op, left, result_c);
            }
            return result_c;
        }

        function pushSwitchKey() {
            switchKeyStack.push(switchLeft);
        }

        function popSwitchKey() {
            switchLeft = switchKeyStack.pop();
        }

        function last() {
            return lastVal;
        };

        function C1(iid, left) {
            var left_c;

            left_c = getConcrete(left);
            switchLeft = left;
            return left_c;
        };

        function C2(iid, left) {
            var left_c, ret;
            executionIndex.executionIndexInc(iid);

            left_c = getConcrete(left);
            left = B(iid, "===", switchLeft, left);

            if (sandbox.analysis && sandbox.analysis.conditionalPre) {
                sandbox.analysis.conditionalPre(iid, left);
            }

            ret = !!getConcrete(left);

            if (sandbox.analysis && sandbox.analysis.conditional) {
                sandbox.analysis.conditional(iid, left, ret);
            }

            if (branchCoverageInfo) {
                branchCoverageInfo.updateBranchInfo(iid, ret);
            }

            log.log("B" + iid + ":" + (left_c ? 1 : 0));
            return left_c;
        };

        function C(iid, left) {
            var left_c, ret;
            executionIndex.executionIndexInc(iid);
            if (sandbox.analysis && sandbox.analysis.conditionalPre) {
                sandbox.analysis.conditionalPre(iid, left);
            }

            left_c = getConcrete(left);
            ret = !!left_c;

            if (sandbox.analysis && sandbox.analysis.conditional) {
                lastVal = sandbox.analysis.conditional(iid, left, ret);
            } else {
                lastVal = ret;
            }

            if (branchCoverageInfo) {
                branchCoverageInfo.updateBranchInfo(iid, ret);
            }

            log.log("B" + iid + ":" + (left_c ? 1 : 0));
            return lastVal;
        }

        function endExecution() {
            if (branchCoverageInfo)
                branchCoverageInfo.storeBranchInfo();
            var pSkippedReads = 100.0 * skippedReads / (unoptimizedLogs - optimizedLogs);
            var pOptimizedLogs = 100.0 * optimizedLogs / unoptimizedLogs;
            //console.log("Reads Skipped, GetFields Skipped, Total Logs (unoptimized), Total Logs (optimized), % of skips that are local reads, % of reduction in logging = "+
            //    skippedReads+" , "+skippedGetFields+" , "+unoptimizedLogs+" , "+optimizedLogs+ " , "+pSkippedReads+"% , "+pOptimizedLogs+"%");
            if (sandbox.analysis && sandbox.analysis.endExecution) {
                sandbox.analysis.endExecution();
            }
        }


        //----------------------------------- End Jalangi Library backend ---------------------------------
        
        // initialize sandbox.analysis, executionIndex, and require.uncache
        executionIndex = new ExecutionIndex();

        if (ANALYSIS && ANALYSIS.indexOf('Engine') >= 0) {
            var SymbolicEngine = require('./' + ANALYSIS);
            sandbox.analysis = new SymbolicEngine(executionIndex);
        }

        if (!isBrowser && typeof require === 'function') {
            require.uncache = function (moduleName) {
                require.searchCache(moduleName, function (mod) {
                    delete require.cache[mod.id];
                });
            };

            require.searchCache = function (moduleName, callback) {
                var mod = require.resolve(moduleName);

                if (mod && ((mod = require.cache[mod]) !== undefined)) {
                    (function run(mod) {
                        mod.children.forEach(function (child) {
                            run(child);
                        });
                        callback(mod);
                    })(mod);
                }
            };
        }
    
        function instrumentCode(iid, code) {
            if(sandbox.analysis.instrumentCode) {
                sandbox.analysis.instrumentCode(iid, getConcrete(code));
            }
            return code;
        }
    
        var firstRound = true;
        var inputIndex = 0;
    
        function readInput(sample, start, end) {
            if(inputIndex===0 && window.faultLocConfig.inputMatrix.length > 0){
                firstRound = false;
            }
            var result;
            var inputArray;
            if(window.faultLocConfig.isReference === false) {
                if(inputIndex===0){
                    inputArray = [];
                    window.faultLocConfig.inputMatrix.push(inputArray);
                } else {
                    inputArray = window.faultLocConfig.inputMatrix[window.faultLocConfig.inputMatrix.length-1];
                }
                if(firstRound) {
                    inputArray.push(sample);
                    result = sample;
                } else {
                    //generate input according to the type of sample
                    var hisSample = window.faultLocConfig.inputMatrix[0][inputIndex];
                    if(typeof hisSample === 'number') {
                        var range = 1000;
                        var base = 0;
                        if(typeof start === 'number' && typeof end === 'number'){
                            base = start;
                            range = end - start;
                        }
                        if(hisSample === parseInt(hisSample)) { // if integer
                            result = base + parseInt(Math.random()*range);
                        } else {    // double
                            result = base + Math.random()*range;
                        }
                    } // else if () { // other types
                    //}
                    inputArray.push(result);
                }
            } else {
                inputArray = window.faultLocConfig.inputMatrix[window.faultLocConfig.inputMatrix.length-1];
                result = inputArray[inputIndex];
            }
            inputIndex++;
            return result;
        }
        
        function setOutput(output) {
            if(window.faultLocConfig.isReference === true) {
                faultLocConfig.refOracles.push(output);
            } else {
                faultLocConfig.oracles.push(output);
            }
        }
    
        sandbox.U = U; // Unary operation
        sandbox.B = B; // Binary operation
        sandbox.C = C; // Condition
        sandbox.C1 = C1; // Switch key
        sandbox.C2 = C2; // case label C1 === C2
        sandbox.addAxiom = addAxiom; // Add axiom
        sandbox.getConcrete = getConcrete;  // Get concrete value
        sandbox.instrumentCode = instrumentCode;
        sandbox._ = last;  // Last value passed to C

        sandbox.H = H; // hash in for-in
        sandbox.I = I; // Ignore argument
        sandbox.G = G; // getField
        sandbox.P = P; // putField
        sandbox.R = R; // Read
        sandbox.W = W; // Write
        sandbox.N = N; // Init 
        sandbox.T = T; // object/function/regexp/array Literal
        sandbox.F = F; // Function call
        sandbox.M = M; // Method call
        sandbox.A = A; // Modify and assign +=, -= ...
        sandbox.Fe = Fe; // Function enter
        sandbox.Fr = Fr; // Function return
        sandbox.Se = Se; // Script enter
        sandbox.Sr = Sr; // Script return
        sandbox.Rt = Rt; // returned value
        sandbox.Ra = Ra;
        sandbox.Ex = Ex; // try-catch exception
        sandbox.Ru = Ru; // read undeclared
        sandbox.readInput = readInput; // specify test input
        sandbox.setOutput = setOutput; // specify test output
    }
}(J$));

//@todo: handle more types of input and output
//@todo: add more samples
//@todo: modify the description, add explanation, add references

//@todo:@assumption arguments.callee is available
//@todo:@assumptions SPECIAL_PROP = "*J$*" is added to every object, but its enumeration is avoided in instrumented code
//@todo:@assumptions ReferenceError when accessing an undeclared uninitialized variable won't be thrown
//@todo:@assumption eval is not renamed
//@todo: with needs to be handled
//@todo: new Function and setTimeout
//@todo: @assumption implicit call of toString and valueOf on objects during type conversion
//@todo: @assumption JSON.stringify of any float could be inaccurate, so logging could be inaccurate

