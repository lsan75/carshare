'use strict';

(function() {

  angular.module('carApp')
    .directive('amTip', ['$timeout', function($timeout) {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'js/main/templates/tip.html',
        scope: {
          content: '=',
          stop: '='
        },
        link: function(scope, elem) {

          var currentTip = 0;

          scope.dir = {
            next: function() {
              currentTip = ++currentTip < scope.content.length ?
                currentTip : 0;

              scope.dir.render();
            },

            prev: function() {
              currentTip = --currentTip < 0 ?
                scope.content.length - 1 : currentTip;

              scope.dir.render();
            },

            stop: function() {
              scope.stop();
              scope.dir.close();
            },

            close: function() {
              elem.css({opacity: 0});
              $timeout(function() {
                elem.css({display: 'none'});
              }, 300);
            },

            render: function() {
              scope.dir.content = scope.content[currentTip];
              elem.css({
                display: 'block',
                opacity: 1
              });
            }
          };

          scope.$watchCollection('content', function() {
            if (!scope.content) { return; }
            scope.dir.render();
          });

        }
      };

    }]);

})();