'use strict';

(function() {

  angular.module('carApp')
    .controller('HomeController', ['$scope', '$window', '$state',
    function($scope, $window, $state) {

      $scope.home = {
        logTo: function(type) {
          $state.go('main', {type: type});
        }
      };

    }]);

})();