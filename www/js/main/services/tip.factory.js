'use strict';

(function() {

  angular.module('carApp')
    .factory('TipFactory', ['$window', 'TipValue',
    function($window, TipValue) {

      var obj = {
        getTips: function() {
          if ($window.localStorage.getItem('stopTips')) {
            return null;
          }
          return TipValue;
        },

        stopTips: function() {
          $window.localStorage.setItem('stopTips', 1);
        }
      };

      return {
        getTips: obj.getTips,
        stopTips: obj.stopTips
      };
    }]);

})();