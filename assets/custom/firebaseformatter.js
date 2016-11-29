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

function FirebaseFormatter() {
	this.firebase_has_intialised = false;
	this.attribute_template = $('.object-attributes').html();
	this.parent_object;
}

FirebaseFormatter.prototype = {
	// dynamically add new attributes
	addNewAttribute: function() {
		$('.object-attributes').append(this.attribute_template);
	},
	// begin reformatting database
	reformatDatabase: function(form_class) {
		// preserve 'this' context
		var self = this;
		// capture inputs through form class
		var form_class 				= $('.' + form_class);
		var firebase_database_link 	= form_class.find('[name=firebase_database_link]')[0].value;
		var parent_object_ref 		= form_class.find('[name=parent_object]')[0].value;
		var attribute_names 		= form_class.find('[name=attribute_name]');
		var attribute_functions 	= form_class.find('[name=attribute_function]');

		// initialise firebase
		if(!self.firebase_has_intialised) {
			if(firebase_database_link != '') { 
				self.init(firebase_database_link); 
			} else {		
				console.log('ERROR: firebase link cannot be empty.');
			}
		}

		// execute the firebase data formatting
		if(self.firebase_has_intialised) {
			// read the firebase data
			self.readData(parent_object_ref).then(
				function(data) {
				// format the data
				var formatted_data = self.format(attribute_names, attribute_functions, data);

				// write the data back to firebase
				self.writeData(parent_object_ref, formatted_data).then(
						function(response) {
							console.log('RESULT: ' + response.status_code + ' ' + response.result);
							console.log('SUCCESS: Firebase data written successfully.');
						},
						function() {
							console.log('ERROR: Firebase data write failed.');
						}
					);
				},
				function() {
					console.log('ERROR: Firebase data read failed.');
				}
			);				
		}
	},
	// initialise firebase object
	init: function(firebase_database_link) {
		var config = {
			databaseURL: firebase_database_link
		}

		firebase.initializeApp(config);
		this.firebase_has_intialised = true;
	},
	// read object data from firebase
	readData: function(parent_object_ref) {
		var defer = $.Deferred();
		
		firebase.database().ref(parent_object_ref).once('value').then(function(snapshot) {
			defer.resolve(snapshot.val());
		});

		return defer.promise();
	},
	// write data to firebase
	writeData: function(parent_object_ref, data) {
		var defer = $.Deferred();

		firebase.database().ref(parent_object_ref).set(data).then(function(){
			defer.resolve({
				status_code: 200,
				result: "OK"
			});	
		});

		return defer.promise();
	},
	// formatting process function
	format: function(attributes, attribute_functions, data) {
		// preserve 'this' context
		var self = this;

		$.each(data, function(key, value) {
			for(var i = 0; i < attributes.length; i++) {
				var attribute_value = eval('data.' + key + '.' + attributes[i].value);
				eval('data.' + key + '.' + attributes[i].value + ' = self.executeFormatting(attribute_value, attribute_functions[i].value)');
			}
		});

		return data;
	},
	// execute the formatting function
	executeFormatting: function(value, function_body) {
		function_body = function_body + "; return value;";

		// initialise the format_value function
		format_value = new Function('value', function_body);
		// execute the format_value function
		var formatted_value = format_value(value);

		return formatted_value;
	}	
};
