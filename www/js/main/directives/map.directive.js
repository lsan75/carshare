'use strict';

(function() {

  angular.module('carApp')
    .directive('map', ['$timeout', '$compile', 'MapOptions', 'GeocodeFactory',
    function($timeout, $compile, MapOptions, GeocodeFactory) {

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
          var unbindMarkers = [];
          var infoWindow;

          var dir = {

            initialize: function() {
              var address = dir.formatAddress(scope.owner);
              GeocodeFactory.getLocation(address).then(function(res) {
                var lats = res.geometry.location;
                dir.setMap(lats);
                dir.setInfoWindow();
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
              if(scope.owner.type === 'proposer') {
                return marker.type === 'proposer' ?
                  'icone-car-darck.png' :
                  'icone-member.light.min.png';
              } else {
                return marker.type === 'chercher' ?
                  'icone-member.light.png' :
                  'icone-car.darck.min.png';
              }
            },

            setMarker: function(marker) {

              var here = dir.formatAddress(marker);
              var image = {
                url: 'img/icons/' + dir.getIcon(marker)
              };

              GeocodeFactory.getLocation(here).then(function(res) {

                var myMarker = new google.maps.Marker({
                  map: map,
                  position: res.geometry.location,
                  icon: image,
                  data: marker
                });

                unbindMarkers.push(
                  google.maps.event.addListener(myMarker, 'click', function() {
                    var subscope = scope.$new();
                    subscope.marker = marker;
                    var content =
                      $compile('<div><am-popupmap data="marker"></am-popupmap></div>')(subscope);

                    infoWindow.setPosition(marker.position);
                    infoWindow.setContent(content[0]);
                    infoWindow.open(map, myMarker);
                  })
                );
              });
            },

            setInfoWindow: function() {
              infoWindow = new google.maps.InfoWindow();
            }

          };

          scope.$on('$destroy', function() {
            angular.forEach(unbindMarkers, function(marker) {
              marker.remove();
            });
          });

          dir.initialize();
        }
      };

    }]);

})();