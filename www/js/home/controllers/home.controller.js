'use strict';

(function() {

  angular.module('carApp')
    .controller('HomeController', ['$scope', '$window', '$state',
    function($scope, $window, $state) {

      $scope.home = {
        logTo: function(type) {

          var currentUser = $window.localStorage.getItem('user');
          if (currentUser) {
            $state.go('main', {type: type});
          } else {
            $state.go('login', {type: type});
          }

        }
      };

    }]);

})();