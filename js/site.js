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

//dialog
(function() {
  $("#btn_dialog_demo1").click(function() {
    $("#loginwrap").dialog({ title:    "Login" });
  });

  $("#btn_dialog_demo1_1").click(function() {
    $("#loginwrap").dialog("open");
  });

  $("#btn_dialog_demo2").click(function() {
    $("#loginwrap").dialog({
        title:    "Login"
      , buttons: [
          {
              text: "Close"
            , classed: "btn-primary"
            , click: function() {
                $(this).dialog("close");
              }
          },
          {
              text: "Login"
            , classed: "btn-success"
            , click: function() {
                //your login handler

                $(this).dialog("close");
              }
          },
          {
              text: "Destroy"
            , classed: "btn-warning"
            , click: function() {
                //your login handler

                $(this).dialog("destroy");
              }
          }
        ]
    });
  });
})();

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
        {title: "Name", field: "name", readonly: true}
      , {title: "Type", field: "type"}
      , {title: "Number", field: "sum"}
    ]]
    , edit: true
    , singleSelect: true //false allow multi select
    , selectChange: function(selected, rowIndex, rowData, $row) {
        //allow multi-select
        //console.log(selected, rowIndex, rowData, $row);
      }
  }).datagrid("loadData", {rows: rows});


})();