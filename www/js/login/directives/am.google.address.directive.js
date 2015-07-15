'use strict';

(function() {

  angular.module('carApp')
    .directive('amGoogleAddress', [function() {

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

              scope.login.form.common.street = place.name;
              var post = place.address_components.length < 7 ?
                null : place.address_components[6].long_name;
              scope.login.form.common.postCode = post;
              scope.login.form.common.city = place.vicinity;

              scope.login.form.common.address =
                scope.login.form.common.street + ', ' +
                scope.login.form.common.postCode + ' ' +
                scope.login.form.common.city;
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