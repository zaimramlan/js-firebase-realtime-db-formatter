// intialise fireformatter
var fireformatter = new FirebaseFormatter();

$(document).ready(function() {
	$('.btn-add-attribute').click(function() {
		fireformatter.addNewAttribute();
	});

	$('.btn-reformat-db').click(function() {
		fireformatter.reformatDatabase('fireformatter-form');
	});
});