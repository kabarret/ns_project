/**
*  Ajax Autocomplete for jQuery, version 1.2.5
*  (c) 2013 Tomas Kirda
*
*  Ajax Autocomplete for jQuery is freely distributable under the terms of an MIT-style license.
*  For details, see the web site: http://www.devbridge.com/projects/autocomplete/jquery/
*
*/
// Expose plugin as an AMD module if AMD loader is present:
(function (factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery'], factory);
    } else {
        // Browser globals
        factory(Zepto)
    }
}


(function ($) {
    'use strict';

    var
        utils = (function () {
            return {

                extend: function (target, source) {
                    return $.extend(target, source);
                },

                addEvent: function (element, eventType, handler) {
                    if (element.addEventListener) {
                        element.addEventListener(eventType, handler, false);
                    } else if (element.attachEvent) {
                        element.attachEvent('on' + eventType, handler);
                    } else {
                        throw new Error('Browser doesn\'t support addEventListener or attachEvent');
                    }
                },

                removeEvent: function (element, eventType, handler) {
                    if (element.removeEventListener) {
                        element.removeEventListener(eventType, handler, false);
                    } else if (element.detachEvent) {
                        element.detachEvent('on' + eventType, handler);
                    }
                },

                createNode: function (html) {
                    var div = document.createElement('div');
                    div.innerHTML = html;
                    return div.firstChild;
                }

            };
        }()),

        keys = {
            ESC: 27,
            TAB: 9,
            RETURN: 13,
            UP: 38,
            DOWN: 40
        };

    function Autocomplete(el, options) {
        var noop = function () { },
            that = this,
            defaults = {
                autoSelectFirst: false,
                appendTo: 'body',
                serviceUrl: null,
                serviceTopUrl: null,
                lookup: null,
                onSelect: null,
                width: 'auto',
                minChars: 0,
                maxHeight: 300,
                maxTimeEditDistance: 100,
                deferRequestBy: 0,
                params: {},
                formatResult: Autocomplete.formatResult,
                normalize : Autocomplete.normalize,
                regExpHighLighing: Autocomplete.regExpHighLighing,
                delimiter: null,
                zIndex: 9999,
                type: 'GET',
                noCache: false,
                onSearchStart: noop,
                onSearchComplete: noop,
                containerClass: 'autocomplete-suggestions',
                tabDisabled: false,
                dataType: 'json',
                lookupFilter: function (suggestion, originalQuery, queryLowerCase) {
                    return suggestion.toLowerCase().indexOf(queryLowerCase) !== -1;
                },
                paramName: 'q',
                transformResult: function (response) {
                    return typeof response === 'string' ? $.parseJSON(response) : response;
                }
            };

        // Shared variables:
        that.element = el;
        that.el = $(el);
        that.suggestions = {};
        that.top = [];
        that.suggestions.keywords = [];
        that.suggestions.brands = [];
        that.suggestions.departments = [];
        that.suggestions.suggestedTerm = "";
        that.badQueries = [];
        that.selectedIndex = -1;
        that.currentValue = that.element.value;
        that.intervalId = 0;
        that.cachedResponse = [];
        that.cachedTopResponse = [];
        that.cachedEditDistance = [];
        that.onChangeInterval = null;
        that.onChange = null;
        that.ignoreValueChange = false;
        that.isLocal = false;
        that.suggestionsContainer = null;
        that.options = $.extend({}, defaults, options);
        that.classes = {
            selected: 'autocomplete-selected',
            suggestion: 'autocomplete-suggestion'
        };

        // Initialize and set options:
        that.initialize();
        that.setOptions(options);
    }

    Autocomplete.utils = utils;

    $.Autocomplete = Autocomplete;

    Autocomplete.normalize = function (term) {
        term = $.trim(term);
        term = term.replace(/[\u00E0\u00E1\u00E2\u00E3]/gi, 'a').
                    replace(/[\u00E8\u00E9\u00EA]/gi, 'e').
                    replace(/[\u00EC\u00ED\u00EE]/gi, 'i').
                    replace(/[\u00F2\u00F3\u00F4\u00F5]/gi, 'o').
                    replace(/[\u00F9\u00FA\u00FB]/gi, 'u').
                    replace(/[\u00E7]/gi, 'c');
        return term;
    };

    Autocomplete.regExpHighLighing = function (autocomplete, currentValue) {
        var values = autocomplete.options.normalize(currentValue).replace(/[^a-zA-Z0-9]/, ' ').toLowerCase().split(" ");
        var index, index2;
        var valuesSimple = [];

        //For para não gerar Regexp prar o mesmo termo na caixa de busca
        for(index in values){
            if(valuesSimple.length == 0){
                valuesSimple[index] = values[index];
            }else{
                var useTerm = false;
                for(index2 in valuesSimple){
                    if(valuesSimple[index2].indexOf(values[index]) != 0){
                        useTerm = true;
                        break;
                    }   
                }
                if(useTerm == true){
                    valuesSimple[index] = values[index];
                }
            }
            
        }
        var terms = "";
        for(index in valuesSimple){
            terms += "(^|\\s|-)" + values[index].replace(/[aàáãâ]/gi, '[aàáãâ]').
            replace(/[eéèê]/gi, '[eéèê]').
            replace(/[iíìî]/gi, '[iíìî]').
            replace(/[oóòôõ]/gi, '[oóòôõ]').
            replace(/[uúùû]/gi, '[uúùû]').
            replace(/[-]/gi, ' ').
            replace(/[cç]/gi, '[cç]') + '|';  
        }
        terms = terms.substring(0, terms.length - 1);
        return new RegExp('(' + terms + ')', 'gi');
    }

    Autocomplete.formatResult = function (index, suggestion, regExp) {
    	suggestion = suggestion.replace(regExp, '<strong>$1</strong>') + " ";
        return suggestion;
    };

    Autocomplete.prototype = {

        killerFn: null,

        initialize: function () {
            var that = this,
                suggestionSelector = '.' + that.classes.suggestion,
                selected = that.classes.selected,
                options = that.options,
                container;
            // Remove autocomplete attribute to prevent native suggestions:
            that.element.setAttribute('autocomplete', 'off');

            that.killerFn = function (e) {
                if ($(e.target).closest('.' + that.options.containerClass).length === 0) {
                    that.killSuggestions();
                    that.disableKillerFn();
                }
            };

            // Determine suggestions width:
            if (!options.width || options.width === 'auto') {
                options.width = that.el.width();
            }

            that.suggestionsContainer = Autocomplete.utils.createNode('<div class="' + options.containerClass + '" style="position: absolute; display: none;"></div>');

            container = $(that.suggestionsContainer);

            container.appendTo(options.appendTo).width(options.width);

            // Listen for mouse over event on suggestions list:
            container.on('mouseover.autocomplete', suggestionSelector, function () {
                that.activate($(this).data('index'));
            });

            // Deselect active element when mouse leaves suggestions container:
            container.on('mouseout.autocomplete', function () {
                that.selectedIndex = -1;
                container.children('.' + selected).removeClass(selected);
            });

            // Listen for click event on suggestions list:
            container.on('click.autocomplete', suggestionSelector, function () {
                that.select($(this).data('index'), false);
            });

            container.on('submit.autocomplete', suggestionSelector, function () {
                that.select($(this).data('index'), false);
            });

            that.fixPosition();

             that.fixPositionCapture = function () {
                if (that.visible) {
                    that.fixPosition();
                }
            };

            // Opera does not like keydown:
            if (window.opera) {
                that.el.on('keypress.autocomplete', function (e) { that.onKeyPress(e); });
            } else {
                that.el.on('keydown.autocomplete', function (e) { that.onKeyPress(e); });
            }

            that.el.on('keyup.autocomplete', function (e) { that.onKeyUp(e); });
            that.el.on('blur.autocomplete', function () { that.onBlur(); });
            that.el.on('focus.autocomplete', function () { that.fixPosition(); }).on('focus.autocomplete', function () { that.showTopSuggestions(); });
        },

        onBlur: function () {
            this.enableKillerFn();
        },

        setOptions: function (suppliedOptions) {
            var that = this,
                options = that.options;

            utils.extend(options, suppliedOptions);

            that.isLocal = $.isArray(options.lookup);

            if (that.isLocal) {
                options.lookup = that.verifySuggestionsFormat(options.lookup);
            }

            // Adjust height, width and z-index:
            $(that.suggestionsContainer).css({
                'max-height': options.maxHeight + 'px',
                'width': options.width + 'px',
                'z-index': options.zIndex
            });
        },

        clearCache: function () {
            this.cachedResponse = [];
            this.cachedTopResponse = [];
            this.badQueries = [];
        },

        disable: function () {
            this.disabled = true;
        },

        enable: function () {
            this.disabled = false;
        },

        showTopSuggestions: function () {
            var that = this;
            var value = that.getQuery(that.currentValue);
            if(value == ""){
                that.getTopSuggestions();
                that.visibleTop = true;
            }
        },

        fixPosition: function () {
            var that = this,
                offset;

            // Don't adjsut position if custom container has been specified:
            if (that.options.appendTo !== 'body') {
                return;
            }

            offset = that.el.offset();

            $(that.suggestionsContainer).css({
                top: (offset.top + that.el.height()) + 'px',
                left: offset.left + 'px'
            });
        },

        enableKillerFn: function () {
            var that = this;
            $(document).on('click.autocomplete', that.killerFn);
        },

        disableKillerFn: function () {
            var that = this;
            $(document).off('click.autocomplete', that.killerFn);
        },

        killSuggestions: function () {
            var that = this;
            that.stopKillSuggestions();
            that.intervalId = window.setInterval(function () {
                that.hide();
                that.stopKillSuggestions();
            }, 300);
        },

        stopKillSuggestions: function () {
            window.clearInterval(this.intervalId);
        },

        onKeyPress: function (e) {
            var that = this;
            // If suggestions are hidden and user presses arrow down, display suggestions:
            if (!that.disabled && !that.visible && !that.visibleTop && (e.keyCode === keys.DOWN || e.keyCode === keys.UP)&& that.currentValue) {
                that.suggest();
                return;
            }

            if ((that.disabled)) {
                return;
            }
            switch (e.keyCode) {
            
                case keys.ESC:
                    that.el.val(that.currentValue);
                    that.hide();
                    break;
                case keys.TAB:
                case keys.RETURN:
                    if (that.selectedIndex === -1) {
                        that.hide();
                        return;
                    }
                    that.select(that.selectedIndex, e.keyCode === keys.RETURN);
                    if (e.keyCode === keys.TAB && this.options.tabDisabled === false) {
                        return;
                    }
                    break;
                case keys.UP:
                    that.moveUp();
                    break;
                case keys.DOWN:
                    that.moveDown();
                    break;
                default:
                    that.hideTop();
                	return;
            }

            // Cancel event if function did not return:
            e.stopImmediatePropagation();
            e.preventDefault();
        },

        onKeyUp: function (e) {
            var that = this;

            if (that.disabled) {
                return;
            }

            switch (e.keyCode) {
                case keys.UP:
                case keys.DOWN:
                    return;
            }

            clearInterval(that.onChangeInterval);

            if (that.currentValue !== that.el.val()) {
                if (that.options.deferRequestBy > 0) {
                    // Defer lookup in case when value changes very quickly:
                    that.onChangeInterval = setInterval(function () {
                        that.onValueChange();
                    }, that.options.deferRequestBy);
                } else {
                    that.onValueChange();
                }
            }
        },

        onValueChange: function () {
            var that = this,
                q;
            
            clearInterval(that.onChangeInterval);
            that.currentValue = that.element.value;
            q = that.getQuery(that.element.value);
            that.selectedIndex = -1;

            if (that.ignoreValueChange) {
                that.ignoreValueChange = false;
                return;
            }

            if (q.length < that.options.minChars) {
                that.hide();
            } else {
            	//if(that.currentValue.trim() != q.trim()){
            		that.getSuggestions(q);
            	//}
            }
        },

        getQuery: function (value) {
            var delimiter = this.options.delimiter,
                parts;

            if (!delimiter) {
                return $.trim(value);
            }
            parts = value.split(delimiter);
            return $.trim(parts[parts.length - 1]);
        },

        getSuggestionsLocal: function (query) {
            var that = this,
                queryLowerCase = query.toLowerCase(),
                filter = that.options.lookupFilter;

            return {
                suggestions: $.grep(that.options.lookup, function (suggestion) {
                    return filter(suggestion, query, queryLowerCase);
                })
            };
        },

        getTopSuggestions: function () {
            var response,
                that = this,
                options = that.options;
            if (that.cachedTopResponse.length > 0) {
                that.top  = that.cachedTopResponse;
                that.suggestTop();
            } else {
                $.ajax({
                    url: options.serviceTopUrl,
                    type: options.type,
                    dataType: options.dataType,
                    success: function (data) {
                        var result = options.transformResult(data);
                        that.top = result.terms;
                        that.cachedTopResponse = that.top;
                        that.suggestTop();
                    }
                });
            }
        },

        getSuggestions: function (q) {
            var response,
                that = this,
                options = that.options;

            response = that.isLocal ? that.getSuggestionsLocal(q) : that.cachedResponse[q];

            if (response && $.isArray(response.suggestions)) {
                that.suggestions.keywords = response.suggestions;
                that.suggest();
            } else if (!that.isBadQuery(q)) {
                options.params[options.paramName] = q;
                options.onSearchStart.call(that.element, options.params);
                $.ajax({
                    url: options.serviceUrl,
                    data: options.params,
                    type: options.type,
                    dataType: options.dataType,
                    success: function (data) {
                        that.processResponse(data, q);
                        options.onSearchComplete.call(that.element, q);
                    }
                });
            }
        },

        isBadQuery: function (q) {
            var badQueries = this.badQueries,
                i = badQueries.length;

            while (i--) {
                if (q.indexOf(badQueries[i]) === 0) {
                    return true;
                }
            }

            return false;
        },

        hide: function () {
            var that = this;
            that.visible = false;
            that.visibleTop = false;
            that.selectedIndex = -1;
            $(that.suggestionsContainer).hide();
        },

         hideTop: function () {
            var that = this;
            that.visibleTop = false;
            that.selectedIndex = -1;
        },

        suggest: function () {
            if (( this.suggestions == undefined || this.suggestions.suggestedTerm === undefined ) &&(this.suggestions.keywords == undefined || this.suggestions.keywords.length === 0) && (this.suggestions.brands == undefined || this.suggestions.brands.length === 0) && (this.suggestions.departments ==undefined || this.suggestions.departments.length === 0)) {
                this.hide();
                return;
            }

            var that = this,
                regExp = that.options.regExpHighLighing,
                formatResult = that.options.formatResult,
                value = that.getQuery(that.currentValue),
                className = that.classes.suggestion,
                classSelected = that.classes.selected,
                container = $(that.suggestionsContainer),
                html = '';

            // Build suggestions inner HTML:
            var j = 0;
            var regExpHighLighting = regExp(that, value);
            var suggestedTerm = formatResult(0, that.suggestions.suggestedTerm, regExpHighLighting);
            html += '<div class="' + className + '" data-index="' + j++ + '">' + formatResult(0, suggestedTerm, regExpHighLighting) + '</div>';
            if(that.suggestions.departments != undefined){
                for (var i = 0; i < that.suggestions.departments.length; i++) {
                     var suggestedTermContent = "<div id='suggest_department'>"+ suggestedTerm +" em " + that.suggestions.departments[i] + "</div>";
                    html += '<div class="' + className + '" data-index="' + j++ + '">' + suggestedTermContent + '</div>';
                };
                
            }
            if(that.suggestions.keywords != undefined){
                $.each(that.suggestions.keywords, function (i, suggestion) {
                    html += '<div class="' + className + '" data-index="' + j++ + '">' + formatResult(i , suggestion, regExpHighLighting) + '</div>';
                });
            }
            

            container.html(html).show();
            that.visible = true;

            // Select first value by default:
            if (that.options.autoSelectFirst) {
                that.selectedIndex = 0;
                container.children().first().addClass(classSelected);
            }
        },

         suggestTop: function () {
            if ((!this.top || this.top.length === 0)) {
                this.hide();
                return;
            }

            var that = this,
                className = that.classes.suggestion,
                classSelected = that.classes.selected,
                container = $(that.suggestionsContainer),
                html = '';

            // Build suggestions inner HTML:
            var j = 0;
            $.each(that.top, function (i, suggestion) {
                html += '<div class="' + className + '" data-index="' + j++ + '">' +  suggestion + '</div>';
            });
            

            container.html(html).show();
            that.visibleTop = true;
        },

        verifySuggestionsFormat: function (suggestions) {
            // If suggestions is string array, convert them to supported format:
            if (suggestions.length && typeof suggestions[0] === 'string') {
                return suggestions.terms = suggestions;
            }

            return suggestions;
        },

        processResponse: function (response, originalQuery) {
            var that = this,
                options = that.options,
                result = options.transformResult(response, originalQuery);

            //result.keywords = that.verifySuggestionsFormat(result.keywords);

            // Cache results if cache is not disabled:
            if (!options.noCache) {
                that.cachedResponse[result.searchedTerm] = result;
                if (result.terms == undefined || result.terms.length === 0 ) {
                    that.badQueries.push(result[options.paramName]);
                }
            }

            // Display suggestions only if returned query matches current value:
            if (originalQuery === that.getQuery(that.currentValue)) {
                that.suggestions.suggestedTerm = result.suggestedTerm;
                if(result.terms != undefined ){
                    that.suggestions.keywords = result.terms;    
                }else{
                    that.suggestions.keywords = [];
                }
                if(result.brands != undefined){
                    that.suggestions.brands = result.brands;    
                }else{
                     that.suggestions.brands = [];
                }
                if(result.departments != undefined){
                    that.suggestions.departments = result.departments;    
                }else{
                    that.suggestions.departments = [];
                }
                
                that.suggest();
            }
        },

        activate: function (index) {
            var that = this,
                activeItem,
                selected = that.classes.selected,
                container = $(that.suggestionsContainer),
                children = container.children();

            container.children('.' + selected).removeClass(selected);

            that.selectedIndex = index;

            if (that.selectedIndex !== -1 && children.length > that.selectedIndex) {
                activeItem = children.get(that.selectedIndex);
                $(activeItem).addClass(selected);
                return activeItem;
            }

            return null;
        },

        select: function (i, shouldIgnoreNextValueChange) {
            var that = this,
                selectedValue = that.getSuggestionByIndex(i);
            if (selectedValue) {
                that.el.val(selectedValue.suggestionItem);
                that.ignoreValueChange = shouldIgnoreNextValueChange;
                that.onSelect(i);
                that.hide();
            }
        },

        moveUp: function () {
            var that = this;

            if (that.selectedIndex === -1) {
                that.selectedIndex = that.getSuggestionLength();
            }

            if (that.selectedIndex === 0) {
                $(that.suggestionsContainer).children().first().removeClass(that.classes.selected);
                that.selectedIndex = -1;
                that.el.val(that.currentValue);
                return;
            }

            that.adjustScroll(that.selectedIndex - 1);
        },

        moveDown: function () {
            var that = this;

            if (that.selectedIndex === -1) {
                that.selectedIndex = -1;
            }

            if (that.selectedIndex === (that.getSuggestionLength() - 1)) {
                $(that.suggestionsContainer).children().last().removeClass(that.classes.selected);
                that.selectedIndex = -1;
                that.el.val(that.currentValue);
                return;
            }

            that.adjustScroll(that.selectedIndex + 1);
        },

        adjustScroll: function (index) {
            var that = this,
                activeItem = that.activate(index),
                offsetTop,
                upperBound,
                lowerBound,
                heightDelta = 25;

            if (!activeItem) {
                return;
            }

            offsetTop = activeItem.offsetTop;
            upperBound = $(that.suggestionsContainer).scrollTop();
            lowerBound = upperBound + that.options.maxHeight - heightDelta;

            if (offsetTop < upperBound) {
                $(that.suggestionsContainer).scrollTop(offsetTop);
            } else if (offsetTop > lowerBound) {
                $(that.suggestionsContainer).scrollTop(offsetTop - that.options.maxHeight + heightDelta);
            }
            that.el.val(that.getValue(that.getSuggestionByIndex(index).suggestionItem));
        },

        onSelect: function (index) {
            var that = this,
                onSelectCallback = that.options.onSelect,
                suggestion = that.getSuggestionByIndex(index);

            that.el.val(that.getValue(suggestion.suggestionItem));

            if ($.isFunction(onSelectCallback)) {
                onSelectCallback.call(that.element, suggestion);
            }
        },
        
        getSuggestionByIndex: function (index) {
            
            var that = this;
            var suggestion = {"suggestionItem": "", "department":""};
            if(!that.visibleTop){
                var keyIndex = that.suggestions.keywords.length ;
                var deptIndex = 0;
                if(that.suggestions.departments != undefined){
                    deptIndex = that.suggestions.departments.length;   
                }

                if(index == 0){
                    suggestion.suggestionItem = that.suggestions.suggestedTerm;
                }else{
                    if(deptIndex > 0 && index <= deptIndex){
                        suggestion.suggestionItem = that.suggestions.suggestedTerm;
                        suggestion.department = that.suggestions.departments[index - 1];
                    }else{
                        if(index >= deptIndex-1 && index <= keyIndex + deptIndex){
                             suggestion.suggestionItem = that.suggestions.keywords[index - deptIndex - 1];
                        }
                    }

                }
            }else{
                suggestion.suggestionItem = that.top[index];
            }
            return suggestion;
        },
        
        getSuggestionLength: function (index) {
        	var that = this;
            var length = that.top.length;
            if(!that.visibleTop || that.visibleTop==false){
                length = that.suggestions.keywords.length;
                length += that.suggestions.departments.length;
                length += that.suggestions.brands.length;
                if(that.suggestions.suggestedTerm != undefined){
                    length += 1;
                }
            }
            return length;
        },
        
        getValue: function (value) {
            var that = this,
                delimiter = that.options.delimiter,
                currentValue,
                parts;

            if (!delimiter) {
                return value;
            }

            currentValue = that.currentValue;
            parts = currentValue.split(delimiter);

            if (parts.length === 1) {
                return value;
            }

            return currentValue.substr(0, currentValue.length - parts[parts.length - 1].length) + value;
        }
    };

    // Create chainable jQuery plugin:
    $.fn.autocomplete = function (options, args) {
        return this.each(function () {
            var dataKey = 'autocomplete',
                inputElement = $(this),
                instance;

            if (typeof options === 'string') {
                instance = inputElement.data(dataKey);
                if (typeof instance[options] === 'function') {
                    instance[options](args);
                }
            } else {
                instance = new Autocomplete(this, options);
                inputElement.data(dataKey, instance);
            }
        });
    };
}));