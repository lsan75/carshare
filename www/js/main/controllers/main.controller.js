'use strict';

(function() {

  angular.module('carApp')
    .controller('MainController', ['$scope', 'MapData', 'UserFactory',
    function($scope, MapData, UserFactory) {

      $scope.main = {
        users: MapData,
        owner: UserFactory.getCurrentUser()
      };

    }]);

})();