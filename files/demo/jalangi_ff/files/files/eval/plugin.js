/*
* Copyright 2014 University of California, Berkeley.
*
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*
* http://www.apache.org/licenses/LICENSE-2.0
*
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
*/
// Author: Koushik Sen, Liang Gong

(function (sandbox) {
	function EvalUsageAnalysisEngine() {
		var iidToLocation = function(iid){return getLocation(iid);}
		function getLocation(iid) {
			if(window.getLocationFromIID){
				return window.getLocationFromIID(iid);
			} else {
				return '[iid]: ' + iid;
			}
		}
		var HAS_OWN_PROPERTY = Object.prototype.hasOwnProperty;
		var HAS_OWN_PROPERTY_CALL = Object.prototype.hasOwnProperty.call;
		var HOP = function (obj, prop) {
			return (prop + "" === '__proto__') || HAS_OWN_PROPERTY_CALL.apply(HAS_OWN_PROPERTY, [obj, prop]);
		}
		var THRESHOLD = 5;

		var evalIidsToStats = Object.create(null); // iid -> {isJSON: true/false, codes: {code1:count1, code2:count2}, count: count3, variants: 2}
		var modified;

		function getValueObject(obj, key) {
			if (HOP(obj, key)) {
				modified = false;
				return obj[key];
			} else {
				var val = Object.create(null);
				obj[key] = val;
				modified = true;
				return val;
			}
		}

		function incField(obj, field) {
			if (obj[field] === undefined) {
				obj[field] = 1;
				modified = true;
			} else {
				obj[field]++;
				modified = false;
			}
		}

		function stripParen(str) {
			str = str.trim();
			if (str.indexOf('(') === 0 && str.lastIndexOf(')')===str.length-1) {
				str = str.substring(0,str.length-1).substring(1);
				str = stripParen(str);
			}
			return str;
		}

		function addEvalString(iid, code) {
			var info = getValueObject(evalIidsToStats, iid);
			info["location"] = iidToLocation(iid);
			if (modified) {
				info["isJSON"] = true;
			}
			incField(info, "count");
			var codes = getValueObject(info, "codes");
			incField(codes, code);
			if (modified) {
				incField(info, "variants");
			}
			try {
				JSON.parse(stripParen(code));
			} catch(e) {
				info["isJSON"] = false;
			}
		}

		this.instrumentCode = function (iid, code) {
			addEvalString(iid, code);
			return code;
		};

		function isUnnecessaryEval(objectInfo) {
			return (objectInfo.variants < THRESHOLD && (objectInfo.count / objectInfo.variants) > 1.0)

		}

		this.endExecution = function () {
			var stats = [];
			var jsons = []
			for (var iid in evalIidsToStats) {
				if (HOP(evalIidsToStats, iid)) {
					var objectInfo = evalIidsToStats[iid];
					if (objectInfo.isJSON) {
						jsons.push(objectInfo);
					} else {
						stats.push(objectInfo);
					}
				}
			}
			stats.sort(function (a, b) {
					return b.count - a.count;
			});

			jsons.sort(function (a, b) {
				return b.count - a.count;
			});

			var len = jsons.length;
			for (var i = 0; i < len; i++) {
				objectInfo = jsons[i];
				var location = objectInfo.location;
				var str = "JSON.parse can replace eval at "+location+" called "+objectInfo.count+" times with "+
					objectInfo.variants+" code string variants:\n	"+JSON.stringify(objectInfo.codes);
				console.log(str);
			}

			len = stats.length;
			for (i = 0; i < len; i++) {
				objectInfo = stats[i];
				if (isUnnecessaryEval(objectInfo)) {
					location = objectInfo.location;
					str = "can eliminate eval at "+location+" is called "+objectInfo.count+" times with "+
						objectInfo.variants+" code string variants:\n	"+JSON.stringify(objectInfo.codes);
					console.log(str);
				}
			}

			for (i = 0; i < len; i++) {
				objectInfo = stats[i];
				if (!isUnnecessaryEval(objectInfo)) {
					location = objectInfo.location;
					str = "eval at "+location+" is called "+objectInfo.count+" times with "+
						objectInfo.variants+" code string variants:\n	"+JSON.stringify(objectInfo.codes);
					console.log(str);
				}
			}
		};

	}

	sandbox.analysis = new EvalUsageAnalysisEngine();
	
}(typeof J$ === 'undefined'? (J$={}):J$));
