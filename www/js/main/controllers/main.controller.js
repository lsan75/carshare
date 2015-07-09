'use strict';

(function() {

  angular.module('carApp')
    .controller('MainController', ['$scope', '$timeout', 'MapData', 'UserFactory',
    function($scope, $timeout, MapData, UserFactory) {

      $scope.main = {
        users: MapData,
        owner: UserFactory.getCurrentUser(),
        credsHidden: true,
        accountOpen: false,
        message: false,

        signForm: function() {
          UserFactory.updateOwner($scope.login.form).then(
            function() {
              $scope.main.message = true;
              $timeout(function() {
                $scope.main.message = false;
              }, 3 * 1000);
            }
          );
        },

        closeForm: function() {
          $scope.main.accountOpen = !$scope.main.accountOpen;
          $scope.main.owner = UserFactory.getCurrentUser();
        }
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