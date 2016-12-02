/**
* jquery.bootstrap.js
Copyright (c) Kris Zhang <kris.newghost@gmail.com>
License: MIT (https://github.com/newghost/bootstrap-jquery-plugin/blob/master/LICENSE)
Version: 0.0.4
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
}

/*
Description: $.fn.dialog
Author: Kris Zhang
Dependence: N/A
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
        + '<div class="dialog modal fade" tabindex="-1" role="dialog">'
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
      var $modalDialog = $(".modal-dialog", $msgbox)

      $modalDialog
        .removeClass('modal-sm', 'modal-lg')
        .addClass(options.dialogClass || "")

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
      typeof options.padding != 'undefined ' && $msgbox.find('.modal-body').css('padding', options.padding)
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
Dependence: string.format.js $.fn.dialog
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
              callback && callback();
              $(this).dialog("destroy");
            }
        },{
            text: model.cancel.text
          , classed : model.cancel.classed || ""
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
    +     '<div class="modal-close-btn"><i class="glyphicon glyphicon-remove"></i></div>'
    +   '</div>'
    + '</div>'
    + '</div>'
    ;

  var $msgbox = $('.dialog.msg-popup')

  var popup = function(message) {
    if (!$msgbox.size()) {
      $msgbox = $(msghtml);
      $('body').append($msgbox);
    }

    $msgbox.find(".modal-body").html(message);
    $msgbox.modal({show: true, backdrop: false});

    // $msgbox.find('.modal-close-btn').on('click', function() {
    //   $(this).closest('.dialog').remove()
    // })

    //click on background, close the message
    $msgbox.on('click', function(e) {
      if ($(e.target).closest('.modal-body').size()) {
        return
      }
      $(this).remove()
    })

    setTimeout(function() {
      $msgbox.remove()
    }, 60000);
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
Dependence: string.format.js
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
    };

    var updateRows = function() {
      $("tbody tr", $this).each(function(idx) {
        var $row  = $(this)
        var row   = rows[idx] || {}

        $row.find('input[name]').each(function() {
          var $input  = $(this)
          var name    = $input.attr('name')

          name && (row[name] = $input.val())
        })

        rows[idx] = row
      })
    }

    var getRow = function(columns, row) {
      var trow = "<tr>";

      if (conf.rowClass) {
        trow = '<tr class="' + conf.rowClass + '">'
      }

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

    var loadData = function(edit) {
      if (!options) return;

      var columns = conf.columns;
      rows = options.rows || options;

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
    if (method == "loadData") loadData();

    if (method == "getData") {
      updateRows();
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

      updateRows();
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
      $tar.size() ? $tar.after($row) : $("tbody", $this).append($row);
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

/*
Description: $.fn.tree
Author: Kris Zhang
Dependence: string.format.js
*/
(function($) {

  $.fn.tree = function(method, options) {

    var self          = this
      , $this         = $(self)
      , pushFn        = Array.prototype.push
      , treeClass     = 'nav'
      , activeClass   = 'active'    /*on LI*/
      , selectedClass = 'selected'  /*on A*/
      , folderIcon    = ''
      , itemIcon      = ''
      , indentIcon    = ''


    var build = function(data, indent) {
      var tree = [];

      tree.push('<ul class="{0} {1}">'.format(indent ? '' : 'tree-nav' , treeClass))

      for (var i = 0, l = data.length; i < l; i++) {
        var node        = data[i]
          , nodes       = node.nodes
          , id          = node.id
          , active      = node.active
          , classed     = node.classed
          , attr        = node.attr
          , href        = node.href
          , iconClass   = node.icon
          , itemClass   = node.itemClass  || ''


        if ( !nodes && method.hideItem ) {
          continue
        }

        tree.push('<li class="{0} {1} {2}">'.format(active ? activeClass : '', nodes && nodes.length ? '' : 'no-child', itemClass))

        icon = '<i class="tree-icon {0} {1}"></i>'.format(iconClass || (nodes ? 'glyphicon tree-folder' : 'glyphicon tree-item'),  iconClass ? '' :  (nodes ? folderIcon : itemIcon))

        var item = '<a{1}{2} class="{3}" data-path="{5}" title="{4}" href="{6}">{0}<span>{4}</span></a>'.format(
            indent + icon
          , id      ? " id='{0}'".format(id) : ""
          , attr    ? " data-attr='{0}'".format(JSON.stringify(attr)) : ""
          , classed || ''
          , node.text
          , typeof node.path == 'undefined' ? node.text : node.path
          , href || '#'
        )

        tree.push(item)
        nodes && pushFn.apply(tree, build(nodes, indent + '<i class="tree-indent {0}"></i>'.format(indentIcon)))
        tree.push('</li>')
      }

      tree.push('</ul>')

      return tree
    }

    /*
    If no parameter provided, using selected nodes or return the whole tree
    */
    var getCurrentNode = function ($node) {
      if (!$node) {
        $node = $this.find('.' + selectedClass)
      }

      if ($node.size() < 1) {
        $node = $this
      }

      if ($node[0].tagName != 'A') {
        var $tmp = $node.find('>a')

        $node = $tmp.size() ? $tmp : $node.closest('a')
      }

      return $node
    }

    var getParents = function($node) {
      $node = getCurrentNode($node)

      var path      = []
        , $parents  = $node.parents()
        , size      = $parents.size()

      for (var i = 0; i < size; i++) {
        var $parent = $parents.eq(i)

        if ($parent.hasClass('tree-nav')) {
          return path
        }

        if ($parent[0].tagName == 'LI') {
          var $link = $parent.find('>a')

          path.push({
              id      : $link.attr("id") || ''
            , text    : $link.text()
            , path    : $link.data('path') || ''
            , attr    : JSON.parse($link.attr("data-attr") || '{}')
          })
        }
      }

      return path
    }

    var getChildren = function($node) {
      $node = getCurrentNode($node)

      var children = []

      $node.parent().find('>ul>li>a').each(function() {
        var $link = $(this)

        children.push({
            id    : $link.attr('id')
          , path  : $link.data('path')
          , text  : $link.text()
          , attr  : JSON.parse($link.attr('data-attr') || '{}')
        })
      })

      return children
    }

    var getPath = function(nodes) {
      var pathArr = []

      for (var i = nodes.length - 1; i > -1 ; i--) {
        var node = nodes[i]
        pathArr.push(node.path)
      }

      return pathArr.join('/')
    }

    var selectNode = function(path) {
      var $node
        , i

      if (typeof path == 'string') {
        var $path   = []
          , $link
          , pathArr = path.split('/')
          , pathStr

        $node = $this.find('>ul')

        for (i = 0; i < pathArr.length; i++) {
          pathStr = pathArr[i]
          //jquery will popup error
          if (pathStr && pathStr != '#') {
            $link = $node.find('>li>[data-path="{0}"]'.format(pathStr))
          } else {
            $link = $node.find('>li>[data-path]').filter(function() {
              return !$(this).data('path')
            })
          }

          if ($link.size() < 1 || $link.data('path') != pathStr) {
            return null
          }
          $node = $link.parent().find('>ul')
        }

        $node = $link.parent()
      } else {
        $node = path
      }

      $node = getCurrentNode($node)
      $node.click()

      var $parents  = $node.parents('li')
        , size      = $parents.size()

      for (i = 0; i < size; i++) {
        var $parent = $parents.eq(i)
        $parent.addClass(activeClass)
      }

      return $node
    }

    var updateNode = function(update) {
      var $node = getCurrentNode()

      typeof update.id   != 'undefined' && $node.attr('id'   , update.id)
      typeof update.path != 'undefined' && $node.data('path' , update.path)
      typeof update.text != 'undefined' && $node.find('span').text(update.text)
      typeof update.attr != 'undefined' && $node.data('attr', JSON.stringify(update.attr))

      return $this
    }

    var removeNode = function(update) {
      var $node = getCurrentNode()
      $node.closest('a').remove()
      return $this
    }

    var insertNode = function(nodes) {
      var $parent = getCurrentNode()

      if (!$parent.size() || !nodes.length) {
        return
      }

      var deepth = $parent.find('.tree-indent').size()
        , indent = ''

      for (var i = 0; i <= deepth; i++) {
        indent += '<i class="tree-indent"></i>'
      }

      //去除ul即为添加的nodes
      var nodes = $(build(nodes, indent).join('')).html()

      $parent.closest('li').find('>ul').prepend(nodes)

      return $this
    }

    if (method && method.constructor == Object) {
      treeClass     = method.treeClass      || treeClass
      activeClass   = method.activeClass    || activeClass
      selectedClass = method.selectedClass  || selectedClass
      folderIcon    = typeof method.folderIcon == 'undefined' ? folderIcon  : method.folderIcon
      itemIcon      = typeof method.itemIcon == 'undefined'   ? itemIcon    : method.itemIcon
      indentIcon    = typeof method.indentIcon == 'undefined' ? indentIcon  : method.indentIcon

      var data = method.data
      if (data && (data.constructor == Array)) {
        var htmlArr = build(data, '')
        $this.html(htmlArr.join(''))
        $this.data("config", method)
      }

      var clickHandler = method.onClick

      var onIcon = function() {
        var $wrap = $(this).closest('li')
        $wrap.toggleClass(activeClass)
      }

      var onLink = function(e) {
        var $link = $(this)
          , $item = $link.closest('li')
          , $prev = $this.find('a.' + selectedClass)
          , attr  = $link.attr("data-attr")

        $prev.removeClass(selectedClass)
        $link.addClass(selectedClass)

        e.preventDefault()

        /*
        只有没有点击在图标上才进行判断
        */
        if (e.target.tagName != 'I') {
          if ($item.hasClass(activeClass)) {
            method.closeOnClick   !== false && $item.removeClass(activeClass)
          } else {
            method.expandOnClick  !== false && $item.addClass(activeClass)
          }
        }

        if (clickHandler) {
          var nodes = getParents($link)
            , path  = getPath(nodes)

          clickHandler.call(self, e, {
              id          : $link.attr("id")
            , attr        : attr ? JSON.parse(attr) : {}
            , text        : $link.text()
            , nodes       : nodes
            , path        : path
            , href        : $link.attr('href')
          }, $link)
        }
      }

      //It may trigger many times, turn the previous event handler off
      $this.off('click', 'li>a>i').on('click', 'li>a>i', onIcon)
      $this.off('click', 'li>a').on('click', "li>a", onLink)
    }

    else if (method == 'getChildren') {
      return getChildren(options)
    }

    else if (method == 'getParents') {
      return getParents(options)
    }

    else if (method == 'getPath') {
      return getPath(getParents(options))
    }

    else if (method == 'select') {
      return selectNode(options)
    }

    else if (method == 'update') {
      return updateNode(options)
    }

    else if (method == 'remove') {
      return removeNode(options)
    }

    else if (method == 'insert') {
      return insertNode(options)
    }

    else if (method == 'getSelected') {
      var $node = getCurrentNode()
      return {
          id   : $node.attr('id')
        , text : $node.find('span').text()
        , path : $node.data('path')
        , attr : JSON.parse($node.data('attr') || '{}')
      }
    }

    else if (method == 'getSelectedNode') {
      return getCurrentNode()
    }


    return self
  };

})(jQuery);
