'use strict';

(function() {

  angular.module('carApp')
    .directive('map', ['$timeout', '$compile', '$q', 'MapOptions', 'GeocodeFactory',
    function($timeout, $compile, $q, MapOptions, GeocodeFactory) {

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
          var markerOwner;

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
                dir.setMarker(scope.owner).then(function(marker) {
                  markerOwner = marker;
                });
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
              var vehicleType;
              if (marker.driver) {
                vehicleType = marker.driver.vehicleType === 'moto' ?
                  'motorcycle' :
                  'car';
              }

              var basePath = 'img/icons/';

              if(scope.owner.type === 'proposer') {
                return marker.type === 'proposer' ?
                  basePath + 'icone-' + vehicleType + '.dark.png' :
                  basePath + 'icone-member.light.min.png';
              } else {
                return marker.type === 'chercher' ?
                  basePath + 'icone-member.light.png' :
                  basePath + 'icone-' + vehicleType + '.dark.min.png';
              }
            },

            setMarker: function(marker) {
              var defer = $q.defer();
              var here = dir.formatAddress(marker);
              var image = {
                url: dir.getIcon(marker)
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

                defer.resolve(myMarker);
              });

              return defer.promise;
            },

            setInfoWindow: function() {
              infoWindow = new google.maps.InfoWindow();
            }

          };

          scope.$watch('owner', function() {

            // object not set yet
            if(!markerOwner) { return; }

            // apply new address and position
            var here = dir.formatAddress(scope.owner);
            GeocodeFactory.getLocation(here).then(function(res) {
              markerOwner.setPosition(res.geometry.location);
            });

            // apply new marker icon
            markerOwner.setIcon({url: dir.getIcon(scope.owner)});
          });

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