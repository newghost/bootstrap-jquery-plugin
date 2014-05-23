/*
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