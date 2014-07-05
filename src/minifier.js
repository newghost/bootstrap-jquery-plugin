var UglifyJS   = require("uglify-js")
  , fs       = require("fs")
  ;

var js = function(inputFile, outputFile) {
  console.log('minifier', inputFile, outputFile);
  var result = UglifyJS.minify(inputFile);
  fs.writeFileSync(outputFile, result.code, "utf-8" );
};

module.exports = {
  js: js
};


(function() {
  var inputFile   = process.argv[2]
    , outputFile  = process.argv[3]
    ;

   process.argv[1].indexOf('minifier' > -1) && inputFile && outputFile && js(inputFile, outputFile);
})();