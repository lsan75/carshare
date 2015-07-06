'use strict';

(function() {

  angular.module('carApp')
    .directive('amGoogleAddress', ['$timeout', function($timeout) {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'js/login/templates/am.google.address.html',
        link: function(scope) {

          var autocomplete, unbindPlaceChanged;
          var dir = {
            initialize: function() {
              autocomplete = new google.maps.places.Autocomplete(
                document.getElementById('address'),
                {
                  types: ['geocode']
                }
              );
              unbindPlaceChanged = google.maps.event.addListener(autocomplete,
                'place_changed',
                function() {
                  dir.fillInAddress();
                });
            },
            fillInAddress: function() {
              var place = autocomplete.getPlace();

              $timeout(function() {
                scope.login.form.common.street = place.name;
                scope.login.form.common.postCode = place.address_components[6].long_name;
                scope.login.form.common.city = place.vicinity;
              });
            }
          };

          dir.initialize();

          scope.$on('$destroy', function() {
            unbindPlaceChanged.remove();
          });

        }
      };

    }]);

})();