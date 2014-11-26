/**
 * Dynamic Tool creation JS 
 **/
var gistutil = {
	buildGistUI: function () {
		gistutil.gistUI = []; //initialize
		var gistArray = [];
		for (var gist in gistList) {
			gistArray.push (gist);
		}
		gistutil.initiateBuilder(gistArray, function () {			
			if (gistutil.gistUI.length) {
				$('.gists-section').html(gistutil.gistUI.join(""));
				$('.launch-button').button();
			}
			afterGistLoaded();
		});
	},
	initiateBuilder: function (gistArray, callback) {
		if (gistArray.length) {
			var gist = gistList[gistArray[0]];
			var xhr = $.ajax({
				url: gist.descriptionHTML,
				dataType: 'text',
				success: function (result) {
					//build gist page
					var template = gistutil.gistTemplate;
					var launchURLs = [];
					for (var i = 0; gist.launchURL && (i < gist.launchURL.length); i++) {
						launchURLs.push (gistutil.gistLaunchTemplate.replace(/{LAUNCH_URL}/, gist.launchURL[i])
								.replace(/{LAUNCH_TITLE}/, gist.launchTitle[i]));
					}
					if (launchURLs.length) { //utilize full height
						template = template.replace(/{LAUNCH_DIV}/, gistutil.gistLaunchContainer.replace(/{LAUNCH_DIV}/, launchURLs.join("")));
					} else {
						template = template.replace(/{LAUNCH_DIV}/, "");
					}
					
					gistutil.gistUI.push(template.replace(/{GIST_ID}/, gistArray[0]).replace(/{GIST_TITLE}/, (gist.title)?gistutil.gistTitle.replace(/{TITLE}/, gist.title):"")
							.replace(/{DESC}/, $(xhr.responseText).html()));
					
					//dynamic JS injection
					if (gist.hasOwnProperty("includeJS") && gist.includeJS.length) {
						var $head = $("head");
						for (var i = 0; i < gist.includeJS.length; i++ ) {
							$head.append("<script src=\"" + gist.includeJS[i] + "\" type=\"text/javascript\"></scr" + "ipt>");
						}
					}
				},
				error: function (xhr, textStatus, errorThrown) {
					console.log("error while loading gist " + gistArray[0] + " error: errorThrown");
				},
				complete: function () {
					gistArray.splice(0, 1);
					gistutil.initiateBuilder(gistArray, callback);
				}
			});
		} else { //completion callback
			if (callback ) { callback(); }
		}
	},
	gistUI: null,
	gistTemplate: '<div class="gist" id="{GIST_ID}">' + 
						'{GIST_TITLE}' + 
						'<div class="gist-description">{DESC}</div>' +
						'{LAUNCH_DIV}' +
					'</div>',
	gistTitle: '<h3>{TITLE}</h3>',
	gistLaunchContainer: '<div class="gist-launch">' +
							'{LAUNCH_DIV}' +
						 '</div>',
	gistLaunchTemplate:  '<a href="{LAUNCH_URL}" class="launch-button" target="_blank">{LAUNCH_TITLE}</a>' 						
};

$(function () {
	gistutil.buildGistUI();
	
	$('.gists-section').on ('submit', 'form.newWebForm', function (e) {
		target_popup(this);
	});
	
	var filterLi = '<li class="goToSlide" data-index="{INDEX}">{GIST_NAME}</li>';
	var $gistFilteeResult = $('#gistFilterResult');
	$('#gistFilter').keyup (function () {
		if (this.value && this.value.length >= 2) {
			var gistKey = this.value;
			var filterPos = $(this).offset();				
			var results = [];
			$gistFilteeResult.show().css({top: filterPos.top + $(this).outerHeight(), left: filterPos.left }).html("<p>Searching...</p>");
			var index = 0;
			var searchString;
			for (key in gistList) {
				searchString = (key + gistList[key].lookupTags.join("")).replace(/ /g, '').toLowerCase();
				if (searchString.indexOf(this.value.toLowerCase().replace(/ /g, '')) >= 0) {
					results.push (filterLi.replace(/{GIST_NAME}/, gistList[key].lookupTitle).replace(/{INDEX}/, index));
				}
				index++;
			}
			
			if (results.length) { //found matching Gist
				$gistFilteeResult.html("<ul>"  + results.join("") + "</ul>");
			} else {
				$gistFilteeResult.html("<p>No such Jump point exist :(</p>");
			}
		} else {
			$gistFilteeResult.html("<p>Jump requires at least 2 letter</p>");
		}
	}).focus (function () {
		$(this).keyup();
	}).blur (function () {
		setTimeout(function () {
			$gistFilteeResult.hide();
		}, 100);
	}).keydown(function (e) {
		if (e.which == 13) {				
			var $li = $gistFilteeResult.find('.goToSlide');
			if ($li.length == 1) { //just 1 slide
				$li.click(); //trigger goToSlide
			}
		}
	}).focus();
	
	$gistFilteeResult.on ('click', '.goToSlide', function () {
		$gistFilteeResult.hide();
		if (gistutil.sliderInstance) {
			gistutil.sliderInstance.goToSlide(parseInt($(this).data('index'), 10));
			$('#gistFilter').val('');//clear value
		}
	});
	
	$('#page').on('click', 'a[href^="http"]', function (e) {
		if (!$(this).hasClass('no-external-icon')) {
			e.preventDefault();
			window.open(this.href, "_blank", '');
		}
	});	
});
function target_popup(form) {
    window.open('', 'formpopup', 'width=1000,height=500,scrollbars=yes, menubar=no,location=yes,status=0,resizable=yes, toolbar=no');
    form.target = 'formpopup';
}

function afterGistLoaded () {
	$('#aboutme_link').click (function () {
		if ($(document).scrollTop() == 0) {
			$('#meetselva').slideToggle();
		} else {
			$("html, body").animate({ scrollTop: 0}, 200);
			setTimeout(function () { $('#meetselva').slideDown(); }, 400);
		}
	});
	
	$('.showDetailsLink').click (function () {
		$(this).parent().find('.details').slideToggle();
	});
}