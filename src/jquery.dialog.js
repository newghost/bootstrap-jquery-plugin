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
      , $msgbox = $this.closest('.dialog')
      , parentDataName = 'dialog-parent'
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
          classed = btnObj['class'] || btnObj.classed || classed;
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
      // call the bootstrap modal to handle the show events (fade effects, body class and backdrop div)
      $msgbox.modal('show');
    };

    var close = function(destroy) {
      // call the bootstrap modal to handle the hide events and remove msgbox after the modal is hidden
      $msgbox.modal('hide').on('hidden.bs.modal', function() {
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
      $(".modal-title", $msgbox).html(options.title || "");
      $(".modal-header .close", $msgbox).click(function() {
        var closeHandler = options.onClose || close;
        closeHandler.call(self);
      });
      (options['class'] || options.classed) && $msgbox.addClass(options['class'] || options.classed);
      show();
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

    return self;
  };

})(jQuery);
