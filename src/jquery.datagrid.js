/*
Description: $.fn.datagrid
Author: Kris Zhang
require: 
  string.format.js
*/

(function($) {

  $.fn.datagrid = function(method, options) {

    var self          = this
      , $this         = $(self)
      , conf          = $this.data("config")  || {}
      , rows          = $this.data("rows")    || []
      , selectedClass = conf.selectedClass    || "success"
      , singleSelect  = conf.singleSelect
      ;

    var bindRows = function($rows) {
      var selectChange  = conf.selectChange
        , edit          = conf.edit
        ;

      var selectHandler = function(e) {
        var $row              = $(this)
          , hasSelectedClass  = $row.hasClass(selectedClass)
          , idx               = $("tbody tr", $this).index($row)
          , row               = rows[idx] || {}
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
          , row     = rows[idx] || {}
          , name    = $input.attr("name")
          ;

        name && (row[name] = $input.val());
      }
      edit && $rows.find("input").keyup(editHandler);
    };

    var getRow = function(columns, row) {
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

          value
            = '<input name="{0}" value="{1}" class="form-control"{2}{3}/>'.format(
                column.field
              , value
              , maxlength
              , readonly
            );
        }

        //if it has 'formatter' attribute override the content
        value = format ? format(row[field], row) : value;
        trow = trow + "<td>" + value + "</td>";
      };
      trow += "</tr>";
      return trow;
    };

    var getData = function(edit) {
      if (!options) return;

      var columns = conf.columns
        , rows    = options.rows || options;

      if (!columns) {
        return
      }

      var body = "<tbody>";
      if (rows) {
        for (var i = 0, l = rows.length; i < l; i++) {
          body += getRow(columns, rows[i]);
        }
      }
      body += "</tbody>";

      $("tbody", $this).remove();
      $this
        .data("rows", rows)
        .append(body);

      //add "edit" class if it's edit mode.
      conf.edit && $this.addClass("edit");
      //rebind events
      bindRows($("tbody tr", $this));
    };

    var getSelectedIndex = function() {
      if (options && typeof options.index != "undefined") {
        return [ options.index ];
      } else {
        var selected = [];
        $this.find('tbody tr').each(function(index) {
          var $tr = $(this);
          $tr.hasClass(selectedClass) && selected.push(index)
        });
        return selected;
      }
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
      return rows;
    }

    if (method == "getConfig") {
      return conf;
    }

    if (method == "getColumns") {
      return conf.columns;
    }

    if (method == "selectRow") {
      if (typeof singleSelect ==  "undefined") {
        return
      }

      if (typeof options == "number") {
        singleSelect && $this.datagrid('unselectRow');
        $("tbody tr", $this).eq(options).addClass(selectedClass);
      }

      else if(!singleSelect) {
        $("tbody tr", $this).addClass(selectedClass);
      }
    }

    if (method == "unselectRow") {
      typeof options != "undefined"
        ? $("tbody tr", $this).eq(options).removeClass(selectedClass)
        : $("tbody tr", $this).removeClass(selectedClass);
    }

    if (method == "updateRow") {
      var ids     = getSelectedIndex()
        , row     = options.row
        , columns = conf.columns
        ;

      for (var i = 0, l = ids.length; i < l; i++) {
        var id = ids[i];

        rows && (row = $.extend(rows[id], row));

        var $row = $(getRow(columns, row, conf));

        typeof options.index == "undefined" && $row.addClass(selectedClass);

        $("tbody tr", $this).eq(id)
          .after($row)
          .remove();

        bindRows($row);
      }
    }

    if (method == "getSelections") {
      var selRows = [];

      $("tbody tr", $this).each(function(idx) {
        $(this).hasClass(selectedClass) && selRows.push(rows[idx]);
      });

      return selRows;
    }

    if (method == "getSelectedIndex") {
      return getSelectedIndex();
    }

    if (method == "insertRow") {
      var idx   = getSelectedIndex()[0]
        , row   = options.row
        ;

      if (typeof idx == 'undefined' || idx < 0) {
        idx = rows.length
      }

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
      var ids = typeof options == "number" ? [ options ] : getSelectedIndex();

      for (var i = ids.length - 1; i > -1; i--) {
        var idx = ids[i];
        $("tbody tr", $this).eq(idx).remove();
        rows.splice(idx, 1);
      }
    }

    return self;
  };


})(jQuery);