

faultLocCore = {};

((function (module) {
	var faultLocAlgorithm;
	var config;
	var orderedIIDs; // all iids that are executed at least once, iids are ordered according to the iid number, ascending order
	var nef, nep, nnf, nnp;
	var oracleFlag;
	var ISNAN = isNaN;
	
	function setFaultLocAlgorithm(alg) {
		faultLocAlgorithm = alg;
	}
	
	function faultLocalization() {
		config = window.faultLocConfig;
		collectStatistics();
		return faultLocAlgorithm(nef, nep, nnf, nnp, orderedIIDs);
	}	
	
	// need to be extended
	function compareOracle(value1, value2) {
		if(typeof value1 !== 'object' || typeof value2 !== 'object') {
			// check NaN case
			if(typeof value1 === 'number' && ISNAN(value1) && typeof value2 === 'number' && ISNAN(value2)) {
				return true;
			}
			if(value1 === value2){
				return true;
			} else {
				return false;
			}
		} else {
			// check regular expression case
			if(value1.constructor.name === 'RegExp' && value2.constructor.name === 'RegExp') {
				if(value1.toString() === value2.toString()) {
					return true;
				} else {
					return false;
				}
			}
			
			try{
				if (JSON.stringify(value1) === JSON.stringify(value2)) {
					return true;
				} else {
					return false;
				}
			}catch(e) { // consider circular reference
				return false; // to be added
			}
		}
		
		return false;
	}
	
	function collectStatistics(){		
		// scan entire matrix, collect all iids
		var flag = [];
		for(var i=0;i<config.traces.length;i++) {
			var array = config.traces[i];
			for(var j=0;j<array.length;j++){
				if(typeof array[j] === 'number') {
					flag[j] = true;
				}
			}
		}
		
		orderedIIDs = [];
		for(var i=0;i<flag.length;i++){
			if(flag[i]){
				orderedIIDs.push(i);
			}
		}
		
		oracleFlag = [];
		// collect oracle
		for(var i=0;i<config.oracles.length;i++){
			if(compareOracle(config.oracles[i], config.refOracles[i])) {
				oracleFlag.push(true);
			} else {
				oracleFlag.push(false);
			}
		}
		
		//console.log('oracles:');
		//console.log(JSON.stringify(oracleFlag));
		
		nef = [];
		nep = [];
		nnf = [];
		nnp = [];
		
		// count nef, nep, nnf, nnp
		for(var k=0;k<orderedIIDs.length;k++){
			var iid = orderedIIDs[k];
			nep[iid] = nef[iid] = nnp[iid] = nnf[iid] = 0;
			for(var i=0;i<config.traces.length;i++){
				var array = config.traces[i];
				if(array[iid]){
					if(oracleFlag[i]){
						nep[iid] += array[iid];
					} else {
						nef[iid] += array[iid];
					}
				} else {
					if(oracleFlag[i]){
						nnp[iid] += array[iid];
					} else {
						nnf[iid] += array[iid];
					}
				}
			}
		}
	}
	
	
	
	module.faultLocalization = faultLocalization;
	module.setFaultLocAlgorithm = setFaultLocAlgorithm;
})(faultLocCore))


