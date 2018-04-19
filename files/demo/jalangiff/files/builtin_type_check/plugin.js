/*
 * Copyright (c) 2015, University of California, Berkeley
 *
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 * 1. Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *
 * 2. Redistributions in binary form must reproduce the above copyright
 * notice, this list of conditions and the following disclaimer in the
 * documentation and/or other materials provided with the distribution.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

// Author: Liang Gong

J$.analysis = {};

// check for the correct use of String (built-in) functions in JavaScript

(function (sandbox) {
    function MyAnalysis() {
        var iidToLocation = function (iid) {
            if (window.getLocationFromIID) {
                return window.getLocationFromIID(iid);
            } else {
                return '[iid]: ' + iid;
            }
        }

        // ---- function DB and check API starts ----
        var functionDB = {};

        function addEntry(name, targetFunction, checkerFunction) {
            functionDB[name] = {
                target : targetFunction,
                checker : checkerFunction
            };
        }

        function checkFunction(f, args) {
            for (var prop in functionDB) {
                if (!functionDB.hasOwnProperty(prop))
                    continue;
                var item = functionDB[prop];
                if (item.target === f) {
                    item.checker.apply({}, args);
                }
            }
        }

        // ---- function DB and check API ends ----

        function argsToString(args) {
            var ret = '[';
            var i = 0;
            for (i = 0; i < args.length - 1; i++) {
                ret += (typeof args[i]) + ',';
            }
            if (i < args.length) {
                ret += (typeof args[i]);
            }
            ret += ']';
            return ret;
        }

        function addDebugInfo(iid, msg) {
            console.log('@' + iidToLocation(iid) + ':\n' + msg);
        }

        // not all environment supports this function
        if (String.prototype.localeCompare) {
            // String.prototype.localeCompare
            addEntry('String.prototype.localeCompare', String.prototype.localeCompare,
                function (iid, f, base, args, result, isConstructor) {
                if (args.length < 1 || args.length > 3) {

                    addDebugInfo(iid, 'function String.prototype.localeCompare should take only 1~3 arguments. \n Runtime Args: ' + argsToString(args));
                } else {
                    if (args.length === 1) {
                        if (typeof args[0] !== 'string') {

                            addDebugInfo(iid, 'the first argument of function String.prototype.localeCompare should be a string value. \n Runtime Args: ' + argsToString(args));
                        }
                    } else if (args.length === 2) {
                        if (typeof args[0] !== 'string' || typeof args[1] !== 'string') {

                            addDebugInfo(iid, 'the arguments\' type of function String.prototype.localeCompare should be string ((-> string) -> object) -> int. \n Runtime Args: ' + argsToString(args));
                        } else if (args[1] !== 'co' && args[1] !== 'kn' && args[2] !== 'kf') {

                            addDebugInfo(iid, 'the second argument of function String.prototype.localeCompare should be a locale string of value "co" or "kn" or "kf" \n Runtime Args: ' + argsToString(args));
                        }
                    } else if (args.length === 3) {
                        if (typeof args[0] !== 'string' || typeof args[1] !== 'string') {

                            addDebugInfo(iid, 'the arguments\' type of function String.prototype.localeCompare should be string ((-> string) -> object) -> int. \n Runtime Args: ' + argsToString(args));
                        } else if (args[1] !== 'co' || args[1] !== 'kn' || args[2] !== 'kf') {

                            addDebugInfo(iid, 'the second argument of function String.prototype.localeCompare should be a locale string of value "co" or "kn" or "kf". \n Runtime Args: ' + argsToString(args));
                        } else if (typeof args[2] !== 'object') {

                            addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. \n Runtime Args: ' + argsToString(args));
                        } else {
                            var config_obj = args[2];
                            if (config_obj.localeMatcher && (config_obj.localeMatcher !== 'lookup') && (config_obj.localeMatcher !== 'best fit')) {

                                addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The localeMatcher property of that object should be of value "lookup" or "best fit". \n Runtime property value: ' + config_obj.localeMatcher);
                            } else if (config_obj.usage && (config_obj.usage !== 'sort') && (config_obj.usage !== 'search')) {

                                addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The usage property of that object should be of value "sort" or "search". \n Runtime property value: ' + config_obj.usage);
                            } else if (config_obj.sensitivity && (config_obj.sensitivity !== 'base') && (config_obj.sensitivity !== 'accent') && (config_obj.sensitivity !== 'case') && (config_obj.sensitivity !== 'variant')) {

                                addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The sensitivity property of that object should be of value "base" or "accent" or "case" or "variant". \n Runtime property value: ' + config_obj.sensitivity);
                            } else if (config_obj.ignorePunctuation && (typeof config_obj.ignorePunctuation !== 'boolean')) {

                                addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The ignorePunctuation property of that object should be of boolean value true or false. \n Runtime property value type: ' + (typeof config_obj.ignorePunctuation));
                            } else if (config_obj.numeric && (typeof config_obj.numeric !== 'boolean')) {

                                addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The numeric property of that object should be of boolean value true or false. \n Runtime property value type: ' + (typeof config_obj.numeric));
                            } else if (config_obj.caseFirst && (config_obj.caseFirst !== 'upper') && (config_obj.caseFirst !== 'lower') && (config_obj.caseFirst !== 'false')) {

                                addDebugInfo(iid, 'the third argument of function String.prototype.localeCompare should be a configuration object. The caseFirst property of that object should be of value "upper" or "lower" or "false". \n Runtime property value: ' + config_obj.caseFirst);
                            }
                        }
                    }
                }
            });
        }

        this.invokeFun = function (iid, f, base, args, result, isConstructor) {
            checkFunction(f, arguments);
        };
    }
    sandbox.analysis = new MyAnalysis();
})(J$);