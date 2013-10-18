/*
Description: $.fn.dialog
Author: Kris Zhang
*/

/*


<div class="modal-backdrop fade in"></div>

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
      $(".modal-header .close").click(destroy);
      show();
    };

    var createButton = function() {
      var buttons = options.buttons || {}
        , $btnrow = $msgbox.find(".modal-footer");

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
        var $button = $('<button type="button" class="btn {1}">{0}</button>'.format(text, classed));

        id && $button.attr("id", id);
        click && $button.click(function() {
          console.log("click", click);
          click.call(self);
        });

        $btnrow.append($button);
      }
    };

    var show = function() {
      $msgbox.show();
      $body.addClass("modal-open");
    };

    var destroy = function() {
      $msgbox.hide();
      $body.removeClass("modal-open");
    };

    if (options.constructor == Object) {
      if ($msgbox.size() < 1) {
        create();
        createButton();
      }

      $msgbox.show();
      $(".modal-title", $msgbox).html(options.title || "");      
    }

    if (options == "destroy") {
      console.log("destroy, here", $this);
      destroy();
    }

    return $this;
  };

})(jQuery);