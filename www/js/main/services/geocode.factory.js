'use strict';

(function() {

  angular.module('carApp')
    .factory('GeocodeFactory', ['$q', function($q) {

      var geocoder = new google.maps.Geocoder();

      var geo = {
        getLocation: function(address) {
          var defer = $q.defer();
          geocoder.geocode({address: address}, function(res) {
            defer.resolve(res[0]);
          });
          return defer.promise;
        }
      };

      return {
        getLocation: geo.getLocation
      };

    }]);

})();