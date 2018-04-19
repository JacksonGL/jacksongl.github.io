/*
 * Copyright 2013 Samsung Information Systems America, Inc.
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

// Author: Koushik Sen
// Refactored by Liang Gong for front-end analysis

J$.analysis = {};
(function (module) {

  var iidToLocation = module.iidToLocation;
  function ObjectAllocationTrackerEngine(executionIndex) {
    var SPECIAL_PROP = '*J$*SHADOW';
    var DEFINEPROPERTY = Object.defineProperty;
    if (!(this instanceof ObjectAllocationTrackerEngine)) {
      return new ObjectAllocationTrackerEngine(executionIndex);
    }

    // iid or type could be object(iid) | array(iid) | function(iid)
    var iidToObjectInfo = {}; // type -> (field -> type -> iid -> true)

    function HOP(obj, prop) {
      return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    function isArr(val) {
      return Object.prototype.toString.call(val) === '[object Array]';
    }

    function getShadowInfo(obj) {
      var type = typeof obj;
      if ((type === "object" || type === "function") && obj !== null && obj.name !== "eval") {
        return obj[SPECIAL_PROP];
      } else {
        return undefined;
      }
    };

    function setShadowInfo(obj, shadowInfo) {
      var type = typeof obj;
      if ((type === "object" || type === "function") && obj !== null && obj.name !== "eval") {
        DEFINEPROPERTY(obj, SPECIAL_PROP, {
          value : shadowInfo.shadow,
          writable : true,
          enumerable : false,
          configurable : true
        });
      }

    };

    function ShadowInfo(concrete, shadow) {
      if (!(this instanceof ShadowInfo)) {
        return new ShadowInfo(concrete, shadow);
      }
      this.concrete = concrete;
      this.shadow = shadow;
    }

    function getSetFields(map, key) {
      if (!HOP(map, key)) {
        return map[key] = {
          nObjects : 0,
          maxLastAccessTime : 0,
          averageLastAccessTime : 0,
          isWritten : false
        };
      }
      var ret = map[key];
      return ret;
    }

    function getFields(map, key) {
      if (!HOP(map, key)) {
        return undefined;
      }
      var ret = map[key];
      return ret;
    }

    function updateObjectInfo(base, offset, value, updateLocation, isWritten) {
      var shadowInfo,
      iid;
      shadowInfo = getShadowInfo(base);
      if (shadowInfo) {
        iid = shadowInfo.loc;
        var oldLastAccessTime = shadowInfo.lastAccessTime;
        shadowInfo.lastAccessTime = instrCounter;
        var objectInfo = getFields(iidToObjectInfo, iid);
        if (typeof objectInfo === 'undefined') {
          return;
        }
        objectInfo.averageLastAccessTime = objectInfo.averageLastAccessTime + instrCounter - oldLastAccessTime;
        var max = shadowInfo.lastAccessTime - shadowInfo.originTime;
        if (max > objectInfo.maxLastAccessTime) {
          objectInfo.maxLastAccessTime = max;
        }
        if (isWritten) {
          objectInfo.isWritten = true;
        }
      }
    }

    function annotateObject(creationLocation, obj) {
      var type,
      ret = obj,
      i,
      s;
      if (!getShadowInfo(obj)) {
        type = typeof obj;
        if ((type === "object" || type === "function") && obj !== null && obj.name !== "eval") {
          if (isArr(obj)) {
            type = "array";
          }
          s = type + "(" + creationLocation + ")";
          ret = new ShadowInfo(obj, {
              loc : s,
              originTime : instrCounter,
              lastAccessTime : instrCounter
            });
          var objectInfo = getSetFields(iidToObjectInfo, s);
          objectInfo.nObjects++;
        }
      }
      return ret;
    }

    var instrCounter = 0;

    this.literalPre = function (iid, val) {

      instrCounter++;
    }

    this.invokeFunPre = function (iid, f, base, args, isConstructor) {

      instrCounter++;
    }

    this.getFieldPre = function (iid, base, offset) {
      instrCounter++;
    }

    this.readPre = function (iid, name, val) {
      instrCounter++;
    }

    this.writePre = function (iid, name, val) {
      instrCounter++;
    }

    this.binaryPre = function (iid, op, left, right) {
      instrCounter++;
    }

    this.unaryPre = function (iid, op, left) {
      instrCounter++;
    }

    this.conditionalPre = function (iid, left) {
      instrCounter++;
    }

    this.literal = function (iid, val) {
      setShadowInfo(val, annotateObject(iid, val));
      return val
    }

    this.putFieldPre = function (iid, base, offset, val) {
      instrCounter++;
      updateObjectInfo(base, offset, val, iid, true);
      return val;
    }

    this.invokeFun = function (iid, f, base, args, val, isConstructor) {
      if (isConstructor) {
        var shadowInfo = annotateObject(iid, val);
        if (!getShadowInfo(val)) {
          setShadowInfo(val, shadowInfo);
        }
      }
      return val;
    }

    this.getField = function (iid, base, offset, val) {
      if (typeof val !== 'undefined') {

        updateObjectInfo(base, offset, val, iid, false);
      }
      return val;
    }

    function sizeOfMap(obj) {
      var count = 0;
      for (var i in obj) {
        if (HOP(obj, i)) {
          count++;
        }
      }
      return count;
    }

    function typeInfoWithLocation(type) {
      if (type.indexOf("(") > 0) {
        var type1 = type.substring(0, type.indexOf("("));
        var iid = type.substring(type.indexOf("(") + 1, type.indexOf(")"));
        if (iid === "null") {
          throw new Error("Not expecting null");
        } else {
          return "Location [" + iidToLocation(iid) + "] has created " + type1;
        }
      } else {
        throw new Error('type: ' + type + " Expecting '(' in object location");
        //return iid;
      }
    }

    var printItemLimit = 200;

    this.setPrintLimit = function (limit) {
      printItemLimit = limit;
    };

    var printObjectInfo = function () {
      var stats = [];
      for (var iid in iidToObjectInfo) {
        if (HOP(iidToObjectInfo, iid)) {
          var objectInfo = iidToObjectInfo[iid];
          objectInfo.iid = iid;
          stats.push(objectInfo);
        }
      }
      stats.sort(function (a, b) {
        return b.nObjects - a.nObjects;
      });

      var len = stats.length;
      for (var i = 0; i < len && i < printItemLimit; i++) {
        objectInfo = stats[i];
        iid = objectInfo.iid;
        var str = typeInfoWithLocation(iid);
        str = str + " " + objectInfo.nObjects +
          " times\n with max last access time since creation = " + objectInfo.maxLastAccessTime + " instructions " +
          "\n and average last access time since creation = " + (objectInfo.averageLastAccessTime / objectInfo.nObjects) + " instructions " +
          (objectInfo.isWritten ? "" : "\n and seems to be Read Only");
        console.log(str);
      }
    }
	
	this.endExecution = function () {
		printObjectInfo();
	}
  }

  module.analysis = new ObjectAllocationTrackerEngine();

}(J$));
