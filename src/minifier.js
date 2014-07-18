var jsp       = require("uglify-js").parser
  , pro       = require("uglify-js").uglify
  , fs        = require("fs")
  ;

var js = function(inputFile, outputFile) {
  console.log('require: npm install uglify-js@1');
  console.log('minifier', inputFile, outputFile);
  var ast = jsp.parse(fs.readFileSync(inputFile).toString()); // parse code and get the initial AST
  ast = pro.ast_mangle(ast); // get a new AST with mangled names
  ast = pro.ast_squeeze(ast); // get an AST with compression optimizations
  var final_code = pro.gen_code(ast); // compressed code here
  fs.writeFileSync(outputFile, final_code, "utf-8");
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