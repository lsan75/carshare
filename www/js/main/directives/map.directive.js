'use strict';

(function() {

  angular.module('carApp')
    .directive('map', ['$timeout', 'MapOptions', 'GeocodeFactory',
    function($timeout, MapOptions, GeocodeFactory) {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'js/main/templates/map.html',
        scope: {
          input: '=',
          owner: '='
        },
        link: function(scope, elem) {

          var map;
          var markers = [];

          var dir = {

            initialize: function() {
              var address = dir.formatAddress(scope.owner);
              GeocodeFactory.getLocation(address).then(function(res) {
                var lats = res.geometry.location;
                dir.setMap(lats);
              });
            },

            setMap: function(lats) {
              var el = elem[0];
              MapOptions.center = lats;
              $timeout(function() {
                map = new google.maps.Map(el, MapOptions);
                angular.forEach(scope.input, function(user) {
                  dir.setMarker(user);
                });
                dir.setMarker(scope.owner);
              });
            },

            formatAddress: function(marker) {
              return marker.common.street +
                ' ' +
                marker.common.postCode +
                ' ' +
                marker.common.city +
                ', France';
            },

            getIcon: function(marker) {
              return marker.type === 'proposer' ?
                'icone-car.png' :
                'icone-member.png';
            },

            setMarker: function(marker) {

              var here = dir.formatAddress(marker);
              var image = {
                url: 'img/icons/' + dir.getIcon(marker)
              };

              GeocodeFactory.getLocation(here).then(function(res) {

                markers.push(new google.maps.Marker({
                  map: map,
                  position: res.geometry.location,
                  icon: image
                }));

                google.maps.event.addListener(markers[markers.length - 1], 'click', function() {
                  map.setZoom(16);
                  map.setCenter(this.getPosition());
                });
              });
            }

          };

          scope.$on('$destroy', function() {
            angular.forEach(markers, function(marker) {
              google.maps.event.removeListener(marker);
            });
          });

          dir.initialize();
        }
      };

    }]);

})();