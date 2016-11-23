$(document).ready(function() {
	var formatter = new FirebaseFormatter();
	formatter.formatData();

	$('.btn-add-attribute').click(function() {
		formatter.addNewAttribute();
	});
});