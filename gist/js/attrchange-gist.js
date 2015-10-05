$(function () {
	var $attrchangeMethodDialog = $( "#attrchangePollingvsStandardMethod" ).dialog({
		autoOpen: false,
	    show: {
	      effect: "blind",
	      duration: 300
	    },
	    hide: {
	      effect: "blind",
	      duration: 300
	    },
	    width: 1100,
	    modal: true,
	    title: 'attrchange method comparision: Standard Methods vs Polling',
	    closeOnEscape: true
	});
    
	$('.showPollingvsStandardMethod').click(function () {
		$attrchangeMethodDialog.dialog('open');
	});
});