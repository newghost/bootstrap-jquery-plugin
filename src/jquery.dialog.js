/*
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

    var create = function() {

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
      $(".modal-header .close", $msgbox).click(function() {
        var closeHandler = options.onClose || close;
        closeHandler.call(self);
      });
      options.classed && $msgbox.addClass(options.classed);
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

})(jQuery);