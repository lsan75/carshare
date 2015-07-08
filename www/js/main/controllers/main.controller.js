'use strict';

(function() {

  angular.module('carApp')
    .controller('MainController', ['$scope', 'MapData', 'UserFactory',
    function($scope, MapData, UserFactory) {

      $scope.main = {
        users: MapData,
        owner: UserFactory.getCurrentUser(),

        signForm: function() {

        },
        credsHidden: true,
        accountOpen: false
      };

      $scope.login = {
        signin: false,
        type: $scope.main.owner.type,
        form: {
          common: $scope.main.owner.common,
          driver: $scope.main.owner.driver
        }
      };

    }]);

})();