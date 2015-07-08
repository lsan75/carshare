'use strict';

(function() {

  angular.module('carApp')
    .directive('amPopupmap', [function() {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'js/main/templates/popup.map.html',
        scope: {
          data: '='
        },
        link: function(scope, elem) {



        }
      };

    }]);

})();