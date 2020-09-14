$('#datepicker')
	.datepicker({
		changeMonth: true,
		changeYear: true,
		dateFormat: 'dd M yy',
		yearRange: '2015:c+100',
		maxDate: '+0D',
		showButtonPanel: true,
	})
	.datepicker('setDate', new Date());

$(document).on('click', 'button.ui-datepicker-current', function () {
	$('.datePicker').datepicker('setDate', new Date());
});
