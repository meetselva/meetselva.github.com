$(function () {

});

var util = {
		
		/* Utility function to show overlay over a div element  */
		showOverlay: function (el, txt, callback, callbackArgs) {
			var overlay = $('#c_overlay');
			if (overlay.length == 0) {
				el.append('<div id="c_overlay" ></div>');
				overlay = $('#c_overlay');
			} 
			if ($('#c_overlay_status').length == 0) {
				el.append('<div id="c_overlay_status" class="ui-corner-all" >' + 					
						'<span id="c_overlay_status_msg"></span>' +
						'</div>');			
			} 
			$('#c_overlay_status_msg').html(txt);
			overlay.fadeIn(400, function () {
				callback(callbackArgs);
			});
			$('#c_overlay_status').show();
			
			overlay.css({"width": el.outerWidth() + "px", "height": (el.outerHeight()) + "px"});
			
			overlay.position({
				of: el,
				my: 'left top',
				at: 'left top',
				offset: '0 0',
				collision: 'none none'
			});
			
			overlay = null;
		},

		/* Utility function to hide overlay shown over a div element */
		hideOverlay: function () { $("#c_overlay").fadeOut(500); $("#c_overlay_status").hide(); }
};