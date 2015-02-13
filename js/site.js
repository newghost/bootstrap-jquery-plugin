/*
Demo codes for https://github.com/newghost/bootstrap-jquery-plugin
*/
(function() {
  prettyPrint();
  var $body   = $(document.body);
  $body.scrollspy({target: '.navbar', offset: 90});
})();

var run = function(selector) {
  //console.log($(selector).text(), $(selector + "Result"));

  var result = eval($(selector).text())
    , $result = $(selector + "Result")
    ;

  $result.size() && $result.html(JSON.stringify(result));
};

var apply = function(selector) {
  $('body').append($(selector).text());
};

//datagrid
(function() {

  /*
  load
  */
  var $table = $('#tablewrap1');

  var rows =[
    {"name":"item12","type":"Free","sum":143400},
    {"name":"item13","type":"Free","sum":3426919},
    {"name":"item14","type":"Free","sum":3343312},
    {"name":"item15","type":"Free","sum":120330},
    {"name":"item16","type":"Not Free","sum":319492},
    {"name":"item31","type":"Not Free","sum":321338},
    {"name":"item13","type":"Unknow","sum":342219},
    {"name":"item54","type":"Unknow","sum":231000},
    {"name":"item36","type":"Unknow","sum":259451},
    {"name":"item34","type":"Unknow","sum":449563}
  ];

  $table.datagrid({
      columns:[[
          {title: "Name",   field: "name"}
        , {title: "Type",   field: "type"}
        , {title: "Number", field: "sum"}
      ]]
  }).datagrid("loadData", {rows: rows});

  /*
  edit
  */
  var $editTable = $('#tablewrap2');

  $editTable.datagrid({
    columns:[[
        {title: "Name", field: "name", formatter: function(val) {
          //override default input field
          return val;
        }}
      , {title: "Type", field: "type", readonly: true}
      , {title: "Number", field: "sum"}
    ]]
    , edit: true
    , singleSelect  : true //false allow multi select
    , selectedClass : 'danger'
    , selectChange  : function(selected, rowIndex, rowData, $row) {
        //allow multi-select
        //console.log(selected, rowIndex, rowData, $row);
      }
  }).datagrid("loadData", {rows: rows});


})();


//tree
(function() {

  var $tree = $('#treewrap');

  window.treeDataArr = [
      {
          id:         "root"
        , text:       "Root"
        , attributes: { yourfield: "your value" }
        , children: [
              {
                  id:         "tool"
                , text:       "Tool"
              }
            , {
                  id:         "users"
                , text:       "Users"
                , state:      "close"
                , children:   [
                      {text: "Kris"}
                    , {text: "Tom"}
                    , {text: "Jerry"}
                    , {text: "Dna"}
                  ]
              }
          ]
      }
    , {
          text:       "Guest"
      }
    , {
          id:         "admin"
        , text:       "Admin"
      }
  ];

  $tree.tree({data: treeDataArr});

})();