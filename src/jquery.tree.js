/*
Dependence: string.js
*/

(function($) {

  $.fn.tree = function(method, options) {

    var $this = $(this),
        pushFn  = Array.prototype.push;

    var build = function(data, root) {
      var tree = [];
      tree.push('<ul {0}>'.format(root ? 'class="tree"' : ''));

      data.forEach(function(node) {
        var children    = node.children
          , id          = node.id
          , state       = node.state
          , attributes  = node.attributes;

        tree.push('<li>');
        tree.push('<a{1}{2}{3}>{0}</a>'.format(
            node.text
          , children   ? " class='tree-node'" : ""
          , id         ? " data-id='{0}'".format(id) : ""
          , attributes ? " data-attr='{0}'".format(JSON.stringify(attributes)) : ""
        ));
        if (children) {
          tree.push('<span class="icon-down {0}"></span>'.format(state == 'closed' ? 'hide' : ''));
          pushFn.apply(tree, build(children));
        }
        tree.push('</li>');
      });
      tree.push('</ul>')

      return tree;
    };

    var folder = function() {
      $("span.icon-down", $this).click(function(e) {
        $(this).toggleClass("hide");
      });
    };

    if (method && method.constructor == Object) {
      var data = method.data;
      if (data && (data.constructor == Array)) {
        var htmlArr = build(data, true);
        $this.html(htmlArr.join(''));
        folder();
        //console.log(htmlArr);
      }

      var clickHandler = method.onClick;
      if (clickHandler) {
        $("li>a", $this).click(function() {
          var $this = $(this);
              attrs = $this.attr("data-attr");
          clickHandler({
              id          : $this.attr("data-id")
            , attributes  : attrs ? JSON.parse(attrs) : {}
            , text        : $this.text()
          });
        });
      }
    }

    if (method == "destory") {
      
    }

    return $this;
  };

})(jQuery);