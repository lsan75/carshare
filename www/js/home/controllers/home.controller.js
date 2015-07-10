'use strict';

(function() {

  angular.module('carApp')
    .controller('HomeController', ['$scope', '$state',
    function($scope, $state) {

      $scope.home = {
        logTo: function(type) {
          $state.go('login', {type: type});
        }
      };

    }]);

})();