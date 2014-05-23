var jsp 	= require("uglify-js").parser
  , pro 	= require("uglify-js").uglify
  , fs 		= require("fs")
  ;

var js = function(inputFile, outputFile) {
  console.log('minifier', inputFile, outputFile);

  var ast = jsp.parse(fs.readFileSync(inputFile).toString());
  ast = pro.ast_mangle(ast);
  ast = pro.ast_squeeze(ast);
  var final_code = pro.gen_code(ast);
  fs.writeFileSync(outputFile, final_code, "utf-8" );
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