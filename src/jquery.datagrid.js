/*
Description: $.fn.combobox
Author: Kris Zhang
require: 
  string.js
  jquery.dialog.js
*/

(function($) {

  //tips for edit fields
  var tips = {};

  $.fn.datagrid = function(method, options) {

    var $this = $(this);

    var bindRows = function($rows) {
      var onSelect = $this.data("onSelect")
        , conf     = $this.data("config");

      var clickHandler = function() {
        //rows may added dynamiclly
        $("tbody tr", $this).removeClass("selected");
        $(this).addClass("selected");
        onSelect && onSelect();
      };

      (conf.del || onSelect) && $rows.click(clickHandler);

      $("input + .tip", $rows).click(function() {
        var $icon = $(this)
          , id    = "tip-" + $icon.attr("data-field");

        //There is more than one tips? popup message.
        $("#{0} ul li".format(id)).size() > 1
          &&  $("#" + id).dialog({
                title: "请选择一个值",
                buttons: [
                  { "关闭": function() {  
                    $(this).dialog("destroy")
                  }}
                ]
              });
      });
    };

    var bind = function() {
      var conf = $this.data("config");

      bindRows($("tbody tr", $this));

      $("tfoot .icon-minus", $this).click(function() {
        Msg.confirm(conf.del, function() {
          var $target = $("tbody tr.selected", $this);
          $target.size() && $target.remove();
        });
      });

      $("tfoot .icon-plus", $this).click(function() {
        var $row = $(getRow(conf.columns, {}, conf));
        $("tbody", $this).append($row);
        bindRows($row);
      });

      $("tfoot .icon-up", $this).click(function() {
        var $target = $("tbody tr.selected", $this);

        if ($target.size()) {
          var $rows = $("tbody tr", $this)
            , idx = $rows.index($target);

          idx && $target.after($rows.eq(idx - 1));
        }
      });

      $("tfoot .icon-down", $this).click(function() {
        var $target = $("tbody tr.selected", $this);

        if ($target.size()) {
          var $rows = $("tbody tr", $this)
            , idx = $rows.index($target);

          idx < $rows.size() - 1 && $target.before($rows.eq(idx + 1));
        }
      });

      $(".tips input[type=radio]").click(function() {
        var $radio = $(this)
          , $input = $("tr.selected input[name={0}]".format($radio.attr("name").replace('tip-', '')), $this);

        $input.val($radio.val());
        //close it's parent dialog
        $radio.dialog("close");
      });
    };

    //Get tips inputs
    var getTips = function() {
      for (var key in tips) {
        var id      = 'tip-' + key
          , arr     = tips[key]
          , tipHtml = '';

        tipHtml += '<div id="{0}" class="tips hide">'.format(id);
        tipHtml += '<ul>';
        var arr = tips[key];
        for (var i = 0, l = arr.length; i < l; i++) {
          tipHtml += '<li>';
          tipHtml += '<input type="radio" name="tip-{0}" value="{1}" id="{2}" />'.format(key, arr[i], id + i);
          tipHtml += '<label for="{0}">{1}</label>'.format(id + i, arr[i]);
          tipHtml += '</li>';
        }
        tipHtml += '</ul>';
        tipHtml += '</div>';

        $("#" + id).remove();
        $(document.body).append(tipHtml);
      }
    };

    var getRow = function(columns, row, conf) {
      var trow = "<tr>";

      for (var j = 0, m = columns[0].length; j < m; j++) {
        var column = columns[0][j]
          , format = column.formatter
          , field  = column.field
          , tip    = column.tip
          , value  = row[field];

        typeof value == "undefined" && (value = "");

        if (conf.edit) {
          var maxlength = column.maxlength
            ? 'maxlength="{0}"'.format(column.maxlength)
            : '';

          trow
            = trow + '<td>'
            + '<input name="{0}" value="{1}" class="{2}" {3}/>'.format(column.field, value, tip ? "hastip" : "", maxlength)
            + (tip ? '<a data-field="{0}" class="icon-info tip"></a>'.format(field) : "")
            + '</td>';

          if (tip) {
            //allow user select empty string.
            !tips[field] && (tips[field] = ['&nbsp;']);
            value.toString().trim() != ""
              && tips[field].indexOf(value) < 0
              && tips[field].push(value);
          }

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
        };
      }
      body += "</tbody>";
      if (config.add || config.del) {
        body += '<tfoot><tr><td colspan="{0}" class="toolbar">'.format(columns[0].length);

        config.add  && (body += '<a class="icon-plus">'  + config.add + '</a>');
        config.del  && (body += '<a class="icon-minus">' + config.del + '</a>');
        config.up   && (body += '<a class="icon-up">'   + config.up   + '</a>');
        config.down && (body += '<a class="icon-down">' + config.down + '</a>');

        body += '</td></tr></tfoot>';
      }

      $("tbody", $this).remove();
      $this
        .data("rows", rows)
        .append(body);

      getTips();

      //add "edit" class if it's edit mode.
      config.edit && $this.addClass("edit");
      //rebind events
      bind();
    };

    //handle: $().datagrid({column: [[]]})
    if (method.constructor == Object) {
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

        $this
          //.removeClass("c1 c2 c3 c4 c5 c6 c7 c8 c9 c10 c11 c12")
          //.addClass("c" + l)
          .addClass("data")
          .data("config",  method)
          .data("onSelect", method.onSelect);

        $("thead", $this).html(header);
      }
    }

    //handle: $().datagrid("loadData", {rows: []}) or $().data("loadData", [])
    if (method == "loadData") getData();

    if (method == "getColumnFields") {
      return $this.data("columns");
    }

    if (method == "unselectRow") {
      $("tbody tr", $this).eq(options).removeClass("selected");
    }

    if (method == "updateRow") {
      var idx     = options.index
        , row     = options.row
        , columns = $this.data("columns")
        , rows    = $this.data("rows");

      if (rows) {
        row = $.extend(rows[idx], row);
        $this.data("rows", rows);
      }

      var $row = $(getRow(columns, row));

      $("tbody tr", $this).eq(idx)
        .after($row)
        .remove();

      bindRows($row);
    }

    if (method == "getSelections") {
      var rows    = $this.data("rows")
        , selRows = [];

      $("tbody tr", $this).each(function(idx) {
        $(this).hasClass("selected") && selRows.push(rows[idx]);
      });

      return selRows;
    }

    return $this;
  };

})(jQuery);