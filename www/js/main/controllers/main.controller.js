'use strict';

(function() {

  angular.module('carApp')
    .controller('MainController', ['$scope', '$timeout', '$stateParams', 'MapData', 'OwnerData',
    function($scope, $timeout, $stateParams, MapData, OwnerData) {

      $scope.main = {
        users: MapData,
        owner: OwnerData,
        type: $stateParams.type
      };

    }]);

})();