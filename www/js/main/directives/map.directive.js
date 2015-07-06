'use strict';

(function() {

  angular.module('carApp')
    .directive('map', ['$timeout', 'MapStyle', 'GeocodeFactory',
    function($timeout, MapStyle, GeocodeFactory) {

      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'js/main/templates/map.html',
        scope: {
          input: '=',
          owner: '=',
          type: '@'
        },
        link: function(scope, elem) {

          var map;
          var markers = [];

          var dir = {

            initialize: function() {
              GeocodeFactory.getLocation('Paris, France').then(function(res) {
                var lats = res.geometry.location;
                dir.setMap(lats);
              });
            },

            setMap: function(lats) {
              var mapOptions = {
                center: lats,
                zoom: 11,
                styles: MapStyle,
                panControl: false,
                streetViewControl: false,
                overviewMapControl: false,
                mapTypeControl: false,
                zoomControl: true,
                zoomControlOptions: {
                  style: google.maps.ZoomControlStyle.LARGE,
                  position: google.maps.ControlPosition.LEFT_BOTTOM
                }
              };
              var el = elem[0];
              $timeout(function() {
                map = new google.maps.Map(el, mapOptions);
                angular.forEach(scope.input, function(marker) {
                  dir.setMarker(marker);
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

            setMarker: function(marker) {

              var here = dir.formatAddress(marker);

/*              var image = {
                url: 'medias/oldcar.svg',
                scaledSize: new google.maps.Size(42, 42)
              };
*/
              GeocodeFactory.getLocation(here).then(function(res) {

                markers.push(new google.maps.Marker({
                  map: map,
                  position: res.geometry.location
                }));

                google.maps.event.addListener(markers[markers.length - 1], 'click', function() {
                  map.setZoom(16);
                  map.setCenter(this.getPosition());
                  //map.panBy(-200, 100);
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