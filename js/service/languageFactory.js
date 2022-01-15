app.service('languageFactory', function( $resource ) {

    var languageDirectory = "../languages/";

	this.setLanguage = function( $scope, language, cb ) {
	
		var languageFilePath = languageDirectory + language + '.json';

		$resource( languageFilePath ).get( function (data) {
			$scope.text = data;

			cb();
		}, function () {
			console.log("Language \'" + language + "\' not available. Use the english by default");

			languageFilePath = languageDirectory + 'en.json';
			$resource( languageFilePath ).get( function (data) {
				$scope.text = data;
				cb();
			});
		});
	}
	
});