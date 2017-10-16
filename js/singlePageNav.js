/*
 * jQuery Single Page Navigation Plugin
 * http://github.com/davinskiy/singlePageNavigation
 *
 * @version 1.0.0
 *
 */

;(function($){
	var name = "singlePageNavigation";
	$.fn[name] = function(options){
		
		var container = $(this);
		if (!container.data(name)){	

			var f = function(){

				// Settings
				options.exceptClass = options.exceptClass || "";
				options.disabledClass = options.disabledClass || "";
				options.current = options.current || "current";
				options.duration = options.duration || 700;
				options.delay = options.delay || 0;
				options.ease = options.ease || "swing";
				options.offset = options.offset || 0;
				options.changeAddress = options.changeAddress || false;
				options.currentClickable = options.currentClickable || true;
				options.beforeScrolling = options.beforeScrolling || function(){};
				options.finishScrolling = (options.finishScrolling)? options.finishScrolling : null;

				var menu_items_li = $(container).children("li");
				var menu_items_a = $(container).find("a");
				var scrolled = false;

				// Scroll processing
				$(document).on("scroll", function() {

					if (scrolled) return;

					setTimeout(function(){
						var documentScroll = $(this).scrollTop();
						var doc_view = (documentScroll + $( window ).height());

						for(var i = 0; i < menu_items_a.length; i++){
							if(menu_items_li.eq(i).hasClass(options.exceptClass)){
								continue;
							}
							var this_id = menu_items_a.eq(i).attr("href");
							var this_section = $(this_id);
							var item_pos = this_section.offset().top;


							if (doc_view > item_pos) {
								menu_items_li.removeClass("active");
								menu_items_li.eq(i).addClass("active");
							}

						}
						scrolled = false;

					}, 50);
					scrolled = true;
				});

				// Click processing
				menu_items_a.on("click", function(e){
					
					if( !$(this).parent().hasClass(options.exceptClass) ){
						e.preventDefault();

						// Disable menu item for click
						if ($(this).parent().hasClass(options.disabledClass)) {
							return false;
						}

						// Clickable current menu item
						if (options.currentClickable === false) {
							if ($(this).parent().hasClass(options.current)) {
								return false;
							}
						}

						// Function that execute before scrolling
						if(options.beforeScrolling)
							options.beforeScrolling();

						// If we choice to change address of our browser, we do it
						if (options.changeAddress) {
							try {
								history.pushState(null, null, $(this).attr("href"));
							} catch(e) {
								location.hash = $(this).attr("href");
							}
						}

						// Position to scroll with offset
						var scrollTo = $($(this).attr("href")).offset().top - options.offset;
						var completeCalled = false;

						setTimeout(function(){

							// Scrolling to the position that we need
							$('html, body').animate({
								scrollTop: scrollTo
							}, {
								duration : options.duration,
								easing : options.ease,
								complete : function(){
									if(!completeCalled){
										completeCalled = true;
										options.finishScrolling();
									}
								}
							});
						}, options.delay);
					}
				});
			}
			container.data( name, f() );
		}
		else {
			return container.data(name);
		}
	}
})(jQuery);