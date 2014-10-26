/**
 * Frogui - Minimal UI for responsive projects.
 * @version v0.0.1
 * @author Acamica
 * @license MIT
 */
/*!
 * classie - class helper functions
 * from bonzo https://github.com/ded/bonzo
 * 
 * classie.has( elem, 'my-class' ) -> true/false
 * classie.add( elem, 'my-new-class' )
 * classie.remove( elem, 'my-unwanted-class' )
 * classie.toggle( elem, 'my-class' )
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false */

(function(window) {

  'use strict';

  // class helper functions from bonzo https://github.com/ded/bonzo
  function classReg( className ) {
    return new RegExp("(^|\\s+)" + className + "(\\s+|$)");
  }

  // classList support for class management
  // altho to be fair, the api sucks because it won't accept multiple classes at once
  var hasClass, addClass, removeClass;

  if ( 'classList' in document.documentElement ) {
    hasClass = function( elem, c ) {
      return elem.classList.contains( c );
    };
    addClass = function( elem, c ) {
      elem.classList.add( c );
    };
    removeClass = function( elem, c ) {
      elem.classList.remove( c );
    };
  }
  else {
    hasClass = function( elem, c ) {
      return classReg( c ).test( elem.className );
    };
    addClass = function( elem, c ) {
      if ( !hasClass( elem, c ) ) {
        elem.className = elem.className + ' ' + c;
      }
    };
    removeClass = function( elem, c ) {
      elem.className = elem.className.replace( classReg( c ), ' ' );
    };
  }

  function toggleClass( elem, c ) {
    var fn = hasClass( elem, c ) ? removeClass : addClass;
    fn( elem, c );
  }

  var classie = {
    // full names
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    // short names
    has: hasClass,
    add: addClass,
    remove: removeClass,
    toggle: toggleClass
  };

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( classie );
  } else {
    // browser global
    window.classie = classie;
  }

})( window );
( function (window) {
  'use strict';

  /**
   * MicroAjax is an small library for call 
   * @example
   * // Get.
   * var request = ajax.get('/courses', function(data){
   *  // do something...
   * });
   * @example
   * // Post.
   * var post = ajax.post('/message', 'Hi john!');
   */

  var request, resp;

  // Constructor
  var MicroAjax = function () {
    return this;
  }

  /**
   * Initialize a new instance of Dropdown and merge custom options with defaults options.
   * @memberof! ch.Dropdown.prototype
   * @function
   * @private
   * @returns {dropdown}
   */
  MicroAjax.prototype.post = function (url, data) {

    // Instance for start request
    var request = new XMLHttpRequest();
    
    // Open the connection
    request.open('POST', url, true);
    
    // Set headers
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    
    // Finish connection
    request.send(data);

  };

  /**
   * Initialize a new instance of Dropdown and merge custom options with defaults options.
   * @memberof! ch.Dropdown.prototype
   * @function
   * @private
   * @returns {dropdown}
   */
  MicroAjax.prototype.get = function (url, callback) {

    // Instance for start request
    request = new XMLHttpRequest();

    // Open the connection
    request.open('GET', url, true);

    // Request id valid
    request.onload = function() {

      if (request.status >= 200 && request.status < 400) {
        
        if (callback) callback(request.responseText);

      } else {

        throw new Error('request: Error in status response ' + request.status);

      }

    };

    // Some are wrong!
    request.onerror = function() {
      throw new Error('request: Error in the request');
    };

    // Finish connection
    request.send();

  };


  // Expose
  window.MicroAjax = MicroAjax;
  window.ajax = new MicroAjax();

}(this));
( function (window) {
  'use strict';

  var settings;

  /**
   * Show
   * @memberof! Modal.prototype
   * @function
   * @private
   * @returns {this}
   */
  var show = function (el) {
    classie.add( el, 'modal-show' );
  };

  /**
   * Hide 
   * @memberof! Modal.prototype
   * @function
   * @private
   * @returns {this}
   */
  var hide = function (el) {
    classie.remove( el, 'modal-show' );
  };

  // Constructor
  var Modal = function () {
    return this;
  };

  /**
   * Initialize a new instance of Modal.
   * @function
   * @public
   * @returns {this}
   */
  Modal.prototype.init = function () {

    var that = this;
    settings = Modal.settings;
    
    [].slice.call(document.querySelectorAll('.modal-trigger')).forEach(function(el, i) {
      
      var modal = document.querySelector('#' + el.getAttribute('data-modal')),
          close = modal.querySelector('.modal-close');
      
      // Show events
      el.addEventListener( 'click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        show(modal);
      });
      // Close envents
      close.addEventListener( 'click', function(event) {
        event.stopPropagation();
        event.preventDefault();
        hide(modal);
      });
      settings.overlay.addEventListener('click', function() {
        hide(modal);
      });
      document.addEventListener('keydown',function(e){
        if (e.keyCode === 27) {
          hide(modal);
        }
      })

    });

  }

  // Settings
  Modal.settings = {
    overlay: document.querySelector('.modal-overlay')
  };

  // Expose
  window.Modal = Modal;
  window.modal = new Modal();

}(this));

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
