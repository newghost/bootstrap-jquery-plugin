/**
* jquery.bootstrap.js
Copyright (c) Kris Zhang <kris.newghost@gmail.com>
License: MIT (https://github.com/newghost/bootstrap-jquery-plugin/blob/master/LICENSE)
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
*/
;(function($) {

  $.fn.dialog = function(options) {

    var self    = this
      , $this   = $(self)
      , $body   = $(document.body)
      , $msgbox = $this.closest('.dialog')
      , parentDataName = 'dialog-parent'
      , arg1    = arguments[1]
      , arg2    = arguments[2]
      ;

    var create = function() {

      var msghtml
        = ''
        + '<div class="dialog modal fade">'
        + '<div class="modal-dialog">'
        +   '<div class="modal-content">'
        +     '<div class="modal-header">'
        +         '<button type="button" class="close">&times;</button>'
        +         '<h4 class="modal-title"></h4>'
        +     '</div>'
        +     '<div class="modal-body"></div>'
        +     '<div class="modal-footer"></div>'
        +   '</div>'
        + '</div>'
        + '</div>'
        ;


      $msgbox = $(msghtml);
      $(document.body).append($msgbox);
      $msgbox.find(".modal-body").append($this);
    };

    var createButton = function(_options) {
      var buttons = (_options || options || {}).buttons || {}
        , $btnrow = $msgbox.find(".modal-footer");

      //clear old buttons
      $btnrow.empty();

      var isButtonArr = buttons.constructor == Array;

      for (var button in buttons) {
        var btnObj  = buttons[button]
          , id      = ""
          , text    = ""
          , classed = "btn-default"
          , click   = "";

        if (btnObj.constructor == Object) {
          id      = btnObj.id;
          text    = btnObj.text;
          classed = btnObj['class'] || btnObj.classed || classed;
          click   = btnObj.click;
        }

        //Buttons should be an object, etc: { 'close': function { } }
        else if (!isButtonArr && btnObj.constructor == Function) {
          text  = button;
          click = btnObj;
        }

        else {
          continue;
        }

        //<button data-bb-handler="danger" type="button" class="btn btn-danger">Danger!</button>
        $button = $('<button type="button" class="btn">').addClass(classed).html(text);

        id && $button.attr("id", id);
        if (click) {
          (function(click) {
            $button.click(function() {
              click.call(self);
            });
          })(click);
        }

        $btnrow.append($button);
      }

      $btnrow.data('buttons', buttons);
    };

    var show = function() {
      // call the bootstrap modal to handle the show events (fade effects, body class and backdrop div)
      $msgbox.modal('show');
    };

    var close = function(destroy) {
      // call the bootstrap modal to handle the hide events and remove msgbox after the modal is hidden
      $msgbox.modal('hide').one('hidden.bs.modal', function() {
          if (destroy) {
              $this.data(parentDataName).append($this);
              $msgbox.remove();
          }
      });
    };

    if (options.constructor == Object) {
      !$this.data(parentDataName) && $this.data(parentDataName, $this.parent());

      if ($msgbox.size() < 1) {
        create();
      }
      createButton();
      $(".modal-title",  $msgbox).html(options.title || "");
      var $modalDialog = $(".modal-dialog", $msgbox).addClass(options.dialogClass || "");
      $(".modal-header .close", $msgbox).click(function() {
        var closeHandler = options.onClose || close;
        closeHandler.call(self);
      });
      (options['class'] || options.classed) && $msgbox.addClass(options['class'] || options.classed);
      /*
      Passing the options, etc: backdrop, keyboard
      */
      options.autoOpen === false && (options.show = false)
      options.width  && $modalDialog.width(options.width)
      options.height && $modalDialog.height(options.height)
      $msgbox.modal(options)
    }

    if (options == "destroy") {
      close(true);
    }

    if (options == "close") {
      close();
    }

    if (options == "open") {
      show();
    }

    if (options == "option") {
      if (arg1 == 'buttons') {
        if (arg2) {
          createButton({ buttons: arg2 });
          show();
        } else {
          return $msgbox.find(".modal-footer").data('buttons');
        }
      }
    }

    return self;
  };

})(jQuery);
/*
Description: $.messager
Author: Kris Zhang
require: 
  string.format.js
  $.fn.dialog
*/

$.messager = (function() {

  var alert = function(title, message) {
    var model = $.messager.model;

    if (arguments.length < 2) {
      message = title || "";
      title   = "&nbsp;"
    }

    $("<div>" + message + "</div>").dialog({
        title:   title
        // override destroy methods;
      , onClose: function() {
          $(this).dialog("destroy");
        }
      , buttons: [{
            text: model.ok.text
          , classed: model.ok.classed || "btn-success"
          , click: function() {
              $(this).dialog("destroy");
            }
        }]
    });
  };

  var confirm = function(title, message, callback) {
    var model = $.messager.model;

    $("<div>" + message + "</div>").dialog({
        title:   title
        // override destroy methods;
      , onClose: function() {
          $(this).dialog("destroy");
        }
      , buttons: [{
            text: model.ok.text
          , classed: model.ok.classed || "btn-success"
          , click: function() {
              $(this).dialog("destroy");
              callback && callback();
            }
        },
        {
            text: model.cancel.text
          , classed : model.cancel.classed || "btn-danger"
          , click: function() {
              $(this).dialog("destroy");
            }
        }]
    });
  };

  /*
  * popup message
  */
  var msghtml
    = ''
    + '<div class="dialog modal fade msg-popup">'
    + '<div class="modal-dialog modal-sm">'
    +   '<div class="modal-content">'
    +     '<div class="modal-body text-center"></div>'
    +   '</div>'
    + '</div>'
    + '</div>'
    ;

  var $msgbox;

  var popup = function(message) {
    if (!$msgbox) {
      $msgbox = $(msghtml);
      $('body').append($msgbox);
    }

    $msgbox.find(".modal-body").html(message);
    $msgbox.modal({show: true, backdrop: false});

    setTimeout(function() {
      $msgbox.modal('hide');
    }, 1500);
  };

  return {
      alert:   alert
    , popup:   popup
    , confirm: confirm
  };

})();


$.messager.model = {
    ok: { text : "OK", classed : 'btn-success' },
    cancel: { text : "Cancel", classed : 'btn-danger' }
};
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


})(jQuery);/*
Dependence: string.js
*/

(function($) {

  $.fn.tree = function(method, options) {

    var self        = this
      , $this       = $(self)
      , pushFn      = Array.prototype.push
      , icon_node   = "glyphicon-file"
      , icon_open   = "glyphicon-folder-open"
      , icon_close  = "glyphicon-folder-close"
      ;

    var build = function(data, root, parentState) {
      var tree = [];
      !root && tree.push('<ul style="display:{0}">'.format(parentState == "close" ? "none" : "block"));

      for (var i = 0, l = data.length; i < l; i++) {
        var node        = data[i]
          , children    = node.children
          , id          = node.id
          , state       = node.state
          , attributes  = node.attributes
          ;

        tree.push('<li>');
        if (1) {
          var type
            = typeof children == "undefined"
            ? icon_node
            : ( state == "close" ?  icon_close : icon_open );
          tree.push('<span class="glyphicon {0}"></span> '.format(type));
        }
        tree.push('<a{1}{2}{3}>{0}</a>'.format(
            node.text
          , children   ? " class='tree-node'" : ""
          , id         ? " data-id='{0}'".format(id) : ""
          , attributes ? " data-attr='{0}'".format(JSON.stringify(attributes)) : ""
        ));
        children && pushFn.apply(tree, build(children, false, state));
        tree.push('</li>');
      };
      !root && tree.push('</ul>')

      return tree;
    };

    var bind = function() {
      $("span.glyphicon-folder-open, span.glyphicon-folder-close", $this).click(function(e) {
        var $icon     = $(this)
          , $children = $icon.closest("li").children("ul");

        if ($icon.hasClass(icon_close)){
          $icon.removeClass(icon_close).addClass(icon_open);
          $children.show();
        } else {
          $icon.removeClass(icon_open).addClass(icon_close);
          $children.hide();
        }
      });
    };

    if (method && method.constructor == Object) {
      var data = method.data;
      if (data && (data.constructor == Array)) {
        var htmlArr = build(data, true);
        $this.html(htmlArr.join(''));
        $this.data("config", method);
        bind();
      }

      var clickHandler = method.onClick;
      if (clickHandler) {
        $("li>a", $this).click(function() {
          var $link = $(this);
              attrs = $link.attr("data-attr");

          clickHandler.call(self, {
              id          : $link.attr("data-id")
            , attributes  : attrs ? JSON.parse(attrs) : {}
            , text        : $link.text()
          }, $link);
        });
      }
    }

    return self;
  };

})(jQuery);