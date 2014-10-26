(function (window) {

    'use strict';

    // Constructor
    function Grayshirts () {
        // Singleton pattern
        if (!(this instanceof Grayshirts) && Grayshirts.instance === undefined) {
            return new Grayshirts();
        }
        if (Grayshirts.instance) {
            return Grayshirts.instance;
        }
        Grayshirts.instance = this;

        this.version = '0.0.1';

        return this;
    }

    Grayshirts.prototype.getInstance = function () {
        return Grayshirts.instance;
    };

    Grayshirts.prototype.svgSupport = function() {
        if (!Modernizr.svg) {
          var $images = $('[data-png]'),
              $classes = $('.png');

          $.each($images, function(i,e){
            $(e).attr('src', $(this).attr('data-png')).removeAttr('data-png');
          });

          $.each($classes, function(i,e){
            $(e).removeClass('svg').addClass('png');
          });
        }
    };

    Grayshirts.prototype.init = function (config) {
        // Init svg support
        this.svgSupport();

        return this;
    };


    // Expose
    window.Grayshirts = Grayshirts;
    window.grayshirts = new Grayshirts();

}(this));