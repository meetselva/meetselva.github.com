/**
 * Dynamic Tool creation JS 
 **/
var gistutil = {
	buildGistUI: function (finalCallback) {
		gistutil.gistUI = []; //initialize
		var gistArray = [];
		//var category = window.location.hash.substring(1);
		for (var gist in gistList) {
			/*if (category != '' && category != 'all') {
				if (gistList[gist].category == category) {
					gistArray.push (gist);
				}
				window.onhashchange = function() { //Need some clarity
					//reload page with new hash
					window.location.reload();
				}
			} else */ if (gistList[gist].mode == 'server') {
				gistutil.gistServer.push (gist);
			} else {
				gistArray.push (gist);
			}
		}
		
		gistutil.gistList = gistArray.slice(0); //final list
		gistutil.initiateBuilder(gistArray, gistutil.gistInitiateBuilderCallback, finalCallback);
	},
	gistInitiateBuilderCallback: function (finalCallback) {
		if (gistutil.gistUI.length) {
			$('.gists-section').append(gistutil.gistUI.join(""));

			//dynamic JS injection
			for (var i = 0; i < gistutil.gistUIScripts.length; i++ ) {
				$("head").append(gistutil.gistUIScripts[i]);						
			}			
			
			$('.gists-section').find('.qTitle').filter(function () {
				return $(this).find('.ui-icon.ui-icon-triangle-1-e').length == 0;
			}).prepend('<span class="ui-icon ui-icon-triangle-1-e"></span>').next().hide();
		}
				
		hideInfoBox();
		
		//reset for next Server Gist Download
		gistutil.gistUI = [];
		gistutil.gistUIScripts = [];
		
		if (finalCallback) { finalCallback(); }
		
	},
	initiateBuilder: function (gistArray, callback, finalCallback) {
		if (gistArray.length) {
			var gist = gistList[gistArray[0]];
			var xhr = $.ajax({
				url: gist.descriptionHTML,
				dataType: 'text',
				cache: false,
				success: function () {
					//build gist page
					gistutil.buildGistUICore($(xhr.responseText).html(), gist, gistArray[0]);
				},
				error: function (xhr, textStatus, errorThrown) {
					console.log("error while loading gist " + gistArray[0] + " error: errorThrown");
				},
				complete: function () {
					gistArray.splice(0, 1);
					gistutil.initiateBuilder(gistArray, callback, finalCallback);
				}
			});
		} else { //completion callback
			if (callback ) { callback(finalCallback); }
		}
	},
	buildGistUICore: function(result, gist, gistID) {
		//build gist page
		var template = gistutil.gistTemplate,
			launchURLs = [];
		for (var i = 0; gist.launchURL && (i < gist.launchURL.length); i++) {
			launchURLs.push (gistutil.gistLaunchTemplate.replace(/{LAUNCH_URL}/, gist.launchURL[i])
					.replace(/{LAUNCH_TITLE}/, gist.launchTitle[i]));
		}
		if (!launchURLs.length) { //utilize full height
			template = template.replace(/{LAUNCH_CSS}/, "no-launch").replace(/{LAUNCH_DIV}/, "");			
		} else {
			template = template.replace(/{LAUNCH_CSS}/, "").replace(/{LAUNCH_DIV}/, gistutil.gistLaunchContainer.replace(/{LAUNCH_DIV}/, launchURLs.join("")));
		}
		
		gistutil.gistUI.push(template.replace(/{NAME}/gi, gist.title)
				.replace(/{DESC}/, result).replace(/{GIST_ID}/, gistID));
							
		for (var i = 0; gist.hasOwnProperty("includeJS") && i < gist.includeJS.length; i++ ) {
			gistutil.gistUIScripts.push("<script src=\"" + gist.includeJS[i] + "\" type=\"text/javascript\"></scr" + "ipt>");						
		}
	},
	gistUI: null,
	gistList: [],
	gistUIScripts: [],
	gistServer: [],
	gistTemplate: '<div class="gist {LAUNCH_CSS}" id="gist-section-{GIST_ID}">' + 
						'<h3 id="gist-{GIST_ID}" class="gistHeader">{NAME}</h3>' + 
						'<div class="gist-description">{DESC}</div>' +
						'{LAUNCH_DIV}' +
					'</div>',
	gistLaunchContainer: '<div class="gist-launch">' +
						'{LAUNCH_DIV}' +
					'</div>',
	gistLaunchTemplate:  '<a href="{LAUNCH_URL}" class="launch-button" target="_blank">{LAUNCH_TITLE}</a>',
	gistListLITemplate: '<li><input type="checkbox" class="serverGistSelect" {CHECKED} id="gist-select-{GIST_ID}" data-gist-id="{GIST_ID}"/><label for="gist-select-{GIST_ID}" class="{LABEL_CLASS}">{TITLE}</label></li>'
};

$(function () {
	gistutil.buildGistUI(afterGistLoaded);
	
	$('.gists-section').on ('submit', 'form.newWebForm', function (e) {
		target_popup(this);
	});
	
	$('#page').on('click', 'a[href^="http"]', function (e) {
		if (!$(this).hasClass('no-external-icon')) {
			e.preventDefault();
			window.open(this.href, "_blank", '');
		}
	});	
	
	$('#blockui').css('height', $(window).height());
});
function target_popup(form) {
    window.open('', 'formpopup', 'width=1000,height=500,scrollbars=yes, menubar=no,location=yes,status=0,resizable=yes, toolbar=no');
    form.target = 'formpopup';
}

function afterGistLoaded () {
	$('.showDetailsLink').click (function () {
		$(this).parent().find('.details').slideToggle();
	});
	
	$('.view_code').click(function () {
		$($(this).data('code-div')).slideToggle();
	});

	$('#gist-section-meetselva').closest('.gist').hide();

	//reset hash
	window.location.hash = window.location.hash;
	
}

function showInfoBox(msg, autoHide, duration) {
	$('#info-boxMsg').html(msg);
	var $infoBox = $('#info-box'),
	    $window = $(window);
	$infoBox.stop(true, true).css({
		'top':Math.abs((($window.height() - $infoBox.outerHeight()) / 2) + $window.scrollTop()),
	    'left':Math.abs((($window.width() - $infoBox.outerWidth()) / 2) + $window.scrollLeft())
	}).slideDown();
	if (autoHide ){
		setTimeout(function () {
			$('#info-box').slideUp(500);
		}, (duration)?duration:2000);
	}
}

function hideInfoBox() {
	$('#info-box').slideUp();
}