$(document).ready(function() {
	firebase.database().ref('/customers').once('value').then(function(snapshot) {
		objtester = snapshot.val();

		for(obj in objtester) {
			objtester[obj].name = capitalize(objtester[obj].name);
		}

		console.log(objtester);
	});
});

function capitalize(str) {
	var new_str = '';
	var str_arr = str.toLowerCase().split(' ');
	str_arr.forEach(function(string) {
		initial = string.charAt(0);
		initial = initial.toUpperCase();
		string  = string.replace(string.charAt(0), initial);
		new_str += string + ' ';
	})
	return new_str.trim();
}
