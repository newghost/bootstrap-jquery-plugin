/**
* jquery.bootstrap.js
Copyright (c) Kris Zhang <kris.newghost@gmail.com>
License: MIT 
*/
/* Extend string method */

/*
string.format, ref: http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format/4673436#4673436
*/
if (!String.prototype.format) {
  String.prototype.format = function() {
    var args = arguments;
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}/*
Description: $.fn.dialog
Author: Kris Zhang
require: 
  string.format.js
*/
(function($) {

  $.fn.dialog = function(options) {

    var self    = this
      , $this   = $(self)
      , $body   = $(document.body)
      , $msgbox = $this.closest(".dialog");

    var create = function(msg, func, opts) {

      var msghtml
        = ''
        // + '<div class="dialog">'
        // + '<div class="msg">'
        // +   '<h3 class="msgh"></h3>'
        // +   '<div class="msgb"></div>'
        // +   '<table class="msgf">'
        // +   '<tr></tr>'
        // +   '</table>'
        // + '</div>'
        // + '<div class="mask"></div>'
        // + '</div>'
        + '<div class="dialog modal fade in">'
        + '<div class="modal-dialog">'
        +   '<div class="modal-content">'
        +     '<div class="modal-header">'
        +         '<button type="button" class="close">×</button>'
        +         '<h4 class="modal-title"></h4>'
        +     '</div>'
        +     '<div class="modal-body"></div>'
        +     '<div class="modal-footer"></div>'
        +   '</div>'
        + '</div>'
        + '<div class="modal-backdrop fade in" style="z-index:-1"></div>'
        + '</div>'
        ;


      $msgbox = $(msghtml);
      $(document.body).append($msgbox);
      $msgbox.find(".modal-body").append($this);
      
      //bind event & show
      $(".modal-header .close").click(close);
    };

    var createButton = function() {
      var buttons = options.buttons || {}
        , $btnrow = $msgbox.find(".modal-footer");

      //clear old buttons
      $btnrow.html('');

      for (var button in buttons) {
        var btnObj  = buttons[button]
          , id      = ""
          , text    = ""
          , classed = "btn-default"
          , click   = "";

        if (btnObj.constructor == Object) {
          id      = btnObj.id;
          text    = btnObj.text;
          classed = btnObj.classed || classed;
          click   = btnObj.click;
        }

        if (btnObj.constructor == Function) {
          click = btnObj;
        }

        //<button data-bb-handler="danger" type="button" class="btn btn-danger">Danger!</button>
        $button = $('<button type="button" class="btn {1}">{0}</button>'.format(text, classed));

        id && $button.attr("id", id);
        if (click) {
          (function(click) {
            $button.click(function() {
              console.log("click", click);
              click.call(self);
            });
          })(click);
        }

        $btnrow.append($button);
      }
    };

    var show = function() {
      $msgbox.show();
      $body.addClass("modal-open");
    };

    var close = function() {
      $msgbox.hide();
      $body.removeClass("modal-open");
    };

    if (options.constructor == Object) {
      if ($msgbox.size() < 1) {
        create();
      }
      createButton();
      $(".modal-title", $msgbox).html(options.title || "");
      show();
    }

    if (options == "destroy") {
      close();
      $msgbox.remove();
    }

    if (options == "close") {
      close();
    }

    if (options == "open") {
      show();
    }

    return $this;
  };

})(jQuery);/*
Author: Kris Zhang
require: 
  string.format.js
*/

(function($) {

  $.fn.datagrid = function(method, options) {

    var self          = this
      , selectedClass = "success"
      , $this         = $(this)
      ;

    var bindRows = function($rows) {
      var conf          = $this.data("config")
        , selectChange  = conf.selectChange
        , singleSelect  = conf.singleSelect
        , edit          = conf.edit
        ;

      var selectHandler = function(e) {
        var $row              = $(this)
          , hasSelectedClass  = $row.hasClass(selectedClass)
          , idx               = $("tbody tr", $this).index($row)
          , row               = $this.data("rows")[idx] || {}
          ;

        //rows may added dynamiclly
        singleSelect && $("tbody tr", $this).removeClass(selectedClass);
        $row.toggleClass(selectedClass);

        //API selectChange: function( selected, rowIndex, rowData )
        selectChange && selectChange(!hasSelectedClass, idx, row, $row);
      };
      (selectChange || typeof singleSelect != "undefined") && $rows.click(selectHandler);


      var editHandler = function(e) {
        var $input  = $(this)
          , $row    = $input.closest("tr")
          , idx     = $("tbody tr", $this).index($row)
          , row     = $this.data("rows")[idx] || {}
          , name    = $input.attr("name")
          ;

        name && (row[name] = $input.val());
      }
      edit && $rows.find("input").keyup(editHandler);
    };

    var getRow = function(columns, row, conf) {
      var trow = "<tr>";

      for (var j = 0, m = columns[0].length; j < m; j++) {
        var column = columns[0][j]
          , format = column.formatter
          , field  = column.field
          , tip    = column.tip
          , value  = row[field]
          , maxlength = column.maxlength
          , readonly  = column.readonly
          ;

        typeof value == "undefined" && (value = "");

        if (conf.edit) {
          maxlength = maxlength
            ? ' maxlength="{0}"'.format(column.maxlength)
            : '';

          readonly  = readonly ? ' readonly="readonly"' : '';

          trow
            = trow
            + '<td>'
            + '<input name="{0}" value="{1}" class="form-control"{2}{3}/>'.format(column.field, value, maxlength, readonly)
            + '</td>';
        } else {
          value = format ? format(value, row) : value;
          trow = trow + "<td>" + value + "</td>";
        }
      };
      trow += "</tr>";
      return trow;
    };

    var getData = function(edit) {
      if (!options) return;

      var config  = $this.data("config") || {}
        , columns = config.columns
        , rows    = options.rows || options;

      var body = "<tbody>";
      if (rows) {
        for (var i = 0, l = rows.length; i < l; i++) {
          body += getRow(columns, rows[i], config);
        }
      }
      body += "</tbody>";

      $("tbody", $this).remove();
      $this
        .data("rows", rows)
        .append(body);

      //add "edit" class if it's edit mode.
      config.edit && $this.addClass("edit");
      //rebind events
      bindRows($("tbody tr", $this));
    };

    //handle: $().datagrid({column: [[]]})
    if (method && method.constructor == Object) {
      var columns = method.columns;
 
      if (columns) {
        $("thead", $this).size() < 1
          && $this.append("<thead></thead>");

        var header = "<tr>";
        //method.del && (header += "<td></td>");
        for (var i = 0, l = columns[0].length; i < l; i++) {
          var col = columns[0][i];
          header += '<th>' + (col.title || "") + '</th>';
        }
        header += "</tr>";

        $this.data("config",  method);
        $("thead", $this).html(header);
      }
    }

    //handle: $().datagrid("loadData", {rows: []}) or $().data("loadData", [])
    if (method == "loadData") getData();

    if (method == "getData") {
      return $this.data("rows");
    }

    if (method == "getConfig") {
      return $this.data("config");
    }

    if (method == "getColumns") {
      return $this.data("config").columns;
    }

    if (method == "unselectRow") {
      typeof options != "undefined"
        ? $("tbody tr", $this).eq(options).removeClass(selectedClass)
        : $("tbody tr", $this).removeClass(selectedClass);
    }

    if (method == "updateRow") {
      var idx     = options.index
        , conf    = $this.data("config")
        , rows    = $this.data("rows")
        , row     = options.row
        , columns = conf.columns
        ;

      if (rows) {
        row = $.extend(rows[idx], row);
        $this.data("rows", rows);
      }

      var $row = $(getRow(columns, row, conf));

      $("tbody tr", $this).eq(idx)
        .after($row)
        .remove();

      bindRows($row);
    }

    if (method == "getSelections") {
      var rows    = $this.data("rows")
        , selRows = [];

      $("tbody tr", $this).each(function(idx) {
        $(this).hasClass(selectedClass) && selRows.push(rows[idx]);
      });

      return selRows;
    }

    if (method == "insertRow") {
      var idx   = options.index || 0
        , row   = options.row
        , conf  = $this.data("config")
        , rows  = $this.data("rows") || []
        ;

      if (!conf || !row) return $this;

      var $rows  = $("tbody tr", $this)
        , $row   = $(getRow(conf.columns, row, conf))
        , $tar   = $rows.eq(idx)
        ;

      bindRows($row);
      $tar.size() ? $tar.before($row) : $("tbody", $this).append($row);
      rows.splice(idx, 0, row);
    }

    if (method == "deleteRow") {
      if (options > -1) {
        $("tbody tr", $this).eq(options).remove();
        var rows = $this.data("rows");
        rows.splice(options, 1);
      }
    }

    return $this;
  };


})(jQuery);