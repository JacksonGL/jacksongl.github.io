/* Target code to be transformed and analysed */

if (String.prototype.localeCompare) {
    var string = 'object: {}';
    var result = string.localeCompare();
    result = string.localeCompare('test', 'kf', {}, 'unnecessary argument');
    result = string.localeCompare({}, 'kf');
} else {
    console.log('Your browser does not support String.prototype.localeCompare.')
    console.log('To view this demo, please switch to any one of the browsers listed in the following url:');
    conosle.log('https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/localeCompare#Browser_compatibility');
}