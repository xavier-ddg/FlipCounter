;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName = 'flipCounter',
      defaults = {
          speed: 0.2,
          onFlip: function() {},
          onResize: function() {}
      };

    // Constructor
    function FlipCounter(startNum, digits, element, options)
    {
        this.element 	= $(element);
        this.options 	= $.extend({}, defaults, options);
        this._defaults 	= defaults;
        this._name 		= pluginName;
        this.init(startNum, digits);
    }

    FlipCounter.prototype.init = function (startNum, digits) {

        var elem = this.element;
        elem.html('<ul class="flipcounter"></ul>');

        var digitsValue = parseInt(digits);

        this.ul = elem.children('ul');
        this.ulWidth = 0;
        this.digits = new Array();

        for (i=startNum.length-1; i>=0; i=i-1)
        {
            this.addDigit(startNum[i]);
            if(i == 0 && digitsValue > startNum.length)
            {
                for(i = digitsValue - startNum.length; i > 0; --i)
                    this.addDigit(0);
            }
        }

    };

    FlipCounter.prototype.addDigit = function (num) {

        // Add separator after every 3rd digit
        // if (this.digits.length % 3 == 0 && this.digits.length != 0)
        // {
        //     this.addSeparator();
        // }

        this.ul.prepend('<li>\
            <div class="numberwrap">\
                <div class="flipper_top flipper_top1"></div>\
                <div class="flipper_top flipper_top2 flipper_top_back">\
                    <span>'+num+'</span>\
                    <div class="rings"></div>\
                </div>\
                <div class="flipper_top flipper_top_front">\
                    <span>'+num+'</span>\
                    <div class="rings"></div>\
                </div>\
                <div class="flipper_bottom flipper_bottom4"></div>\
                <div class="flipper_bottom flipper_bottom3"></div>\
                <div class="flipper_bottom flipper_bottom2"></div>\
                <div class="flipper_bottom flipper_bottom1 flipper_bottom_back">\
                    <span>'+num+'</span>\
                    <div class="rings"></div>\
                </div>\
                <div class="flipper_bottom flipper_bottom_front">\
                    <span>'+num+'</span>\
                    <div class="rings"></div>\
                </div>\
            </div>\
        </li>');

        var li 			= this.ul.find('li:first-child');
        var digit 		= new Digit(li, num);
        digit.manager 	= this;

        this.digits.push(digit);

        // Update width
        // this.ulWidth = this.ulWidth + digit.li.outerWidth(true);
        // this.ul.css('min-width', this.ulWidth);
        // this.ul.css('min-height', digit.li.outerHeight(true));
    };

    FlipCounter.prototype.removeDigit = function () {

        var digit = this.digits.splice(this.digits.length-1, 1)[0];

        this.ulWidth = this.ulWidth - digit.li.outerWidth(true);

        digit.li.remove();

        // Remove separators
        if (this.digits.length % 3 == 0)
        {
            var comma = this.ul.find('li.comma:first-child');

            this.ulWidth = this.ulWidth - comma.outerWidth(true);

            comma.remove();
        }

        // Update width to current
        this.ul.css('min-width', this.ulWidth);
    }

    FlipCounter.prototype.addSeparator = function (num) {

        this.ul.prepend('<li class="comma">,</li>');

        // Update width
        var comma = this.ul.find('li.comma:first-child');

        this.ulWidth = this.ulWidth + comma.outerWidth(true);

        this.ul.css('min-width', this.ulWidth);
    };

    FlipCounter.prototype.updateTo = function ( num, loop ) {

        var numValue 	= parseInt(num);
        var numStr 		= numValue.toString();

        if(numValue <= 9999 && numValue > 999 )
        {
            numStr = "0" + numStr;
        }
        else if(numValue <= 999 && numValue > 99 )
        {
            numStr = "00" + numStr;
        }
        else if(numValue <= 99 && numValue > 9 )
        {
            numStr = "000" + numStr;
        }
        else if(numValue <= 9)
        {
            numStr = "0000" + numStr;
        }

        /*
         // Change the number of digits displayed if needed
         if (numStr.length != this.digits.length)
         {
         var diff = numStr.length - this.digits.length;
         if (diff > 0)
         {
         for (i=0; i<diff; i=i+1) {
         this.addDigit(0);
         }
         }
         else
         {
         for (i=diff; i<0; i=i+1) {
         this.removeDigit();
         }
         }

         this.options['onResize']();
         }
         */

        // Change all digit values
        for (i=0; i < numStr.length; ++i)
        {
            this.digits[i].setLoop(loop);
            this.digits[i].flipTo(numStr[numStr.length - 1 - i]);
        }
    };

    function Digit( element, currentNumber )
    {

        currentNumber = parseInt(currentNumber);

        this.li = $(element);
        this.topFrontDiv 		= this.li.find('.flipper_top_front');
        this.bottomFrontDiv 	= this.li.find('.flipper_bottom_front');
        this.topNumBack 		= this.li.find('.flipper_top_back span');
        this.topNumFront 		= this.li.find('.flipper_top_front span');
        this.bottomNumBack 		= this.li.find('.flipper_bottom_back span');
        this.bottomNumFront 	= this.li.find('.flipper_bottom_front span');
        this.targetNum 			= currentNumber;
        this.currentNum 		= currentNumber;
        this.nextNum 			= currentNumber;
        this.loop 				= false;
        this.currentlyAnimating = false;
    }

    Digit.prototype.flipTo = function (num)
    {
        if(this.currentNum === num)
            return;

        this.targetNum = num;
        if(this.currentlyAnimating)
            return;

        this.animNext();
    };

    Digit.prototype.animNext = function ()
    {
        if(this.currentNum == this.targetNum && this.loop == false)
        {
            this.currentlyAnimating = false;
            return;
        }

        var doRandomDelay = !this.currentlyAnimating;
        this.currentlyAnimating = true;
        this.nextNum = this.currentNum + 1;
        if (this.nextNum > 9)
            this.nextNum = 0;

        var delay = Math.random()/5;
        if (!doRandomDelay) delay = 0.01;

        // Animate top flipper
        var digit = this;
        digit.topNumBack.html(digit.nextNum);
        digit.topFrontDiv.tween({
            transform:
            {
                start: 'scaleY(1)',
                stop: 'scaleY(0)',
                time: delay,
                duration: this.manager.options.speed,
                units: '',
                effect: 'easeIn'
            }
        }).play();

        // Animate bottom flipper with delay
        digit.bottomFrontDiv.tween({
            transform:
            {
                start: 'scaleY(0)',
                stop: 'scaleY(1)',
                time: delay + this.manager.options.speed,
                duration: this.manager.options.speed * 0.5,
                units: '',
                effect: 'easeOut',
                onStart: function() {
                    digit.bottomNumFront.html(digit.nextNum);
                },
                onStop: function() {
                    digit.currentNum = digit.nextNum;
                    digit.topNumFront.html(digit.currentNum);
                    digit.topFrontDiv.removeAttr('style', '');
                    digit.bottomNumBack.html(digit.currentNum);
                    digit.animNext();
                    digit.manager.options['onFlip']();
                }
            }
        }).play();
    }

    Digit.prototype.setLoop = function( param )
    {
        this.loop = param;
    }


    /*
     Removed default values from func signatures because it was breaking
     IE/Edge since it doesn't support them
     */
    $.fn[pluginName+'Init'] = function ( startNum, digits, options ) {
        startNum = startNum || ""; digits = digits || "";
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                  new FlipCounter( startNum, digits, this, options ));
            }
        });
    }

    $.fn[pluginName+'Update'] = function ( num , loop ) {
        loop = loop || false;
        return this.each(function () {
            var obj = $.data(this, 'plugin_' + pluginName);
            if (obj) {
                obj.updateTo(num, loop);
            }
        });
    }

})( jQuery, window, document );