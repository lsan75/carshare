'use strict';

(function() {

  angular.module('carApp')
    .controller('LoginController', ['$scope', '$state', 'LoginFactory',
    function($scope, $state, LoginFactory) {

      $scope.login = {
        type: $state.params.type,
        form: {
          signin: {},
          common: {},
          driver: {}
        },
        signin: true,

        signForm: function() {

          LoginFactory.initialize(
            $state.params.type,
            $scope.login.signin,
            $scope.login.form
          ).then(
            function() {
              $state.go('main', {type: $state.params.type});
            },
            function(error) {

            }
          );

        }

      };

    }]);

})();