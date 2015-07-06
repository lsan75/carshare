'use strict';

(function() {

  angular.module('carApp')
    .factory('UserFactory', ['$q', '$state', 'Fire',
    function($q, $state, Fire) {

      var usr = {

        getUsers: function(type) {
          var defer = $q.defer();

          var db = Fire.db.child(type === 'proposer' ? 'passengers' : 'drivers');

          db.once('value', function(data) {
            var obj = data.val();
            var users = [];
            angular.forEach(obj, function(user, key) {
              users.push(
                angular.extend(user, {id: key})
              );
            });
            defer.resolve(users);
          }, function() {
            defer.reject('');
            $state.go('home');
          });

          return defer.promise;
        },

        getOwner: function(type) {
          var defer = $q.defer();

          var db = Fire.db.child(type === 'proposer' ? 'drivers' : 'passengers');
          db.orderByChild('uid').equalTo(Fire.uid).once('value', function(data) {
            var obj = data.val();
            var owner = [];
            angular.forEach(obj, function(user, key) {
              owner.push(
                angular.extend(user, {id: key})
              );
            });
            defer.resolve(owner[0]);
          }, function() {
            defer.reject('');
            $state.go('home');
          });

          return defer.promise;
        }
      };

      return {
        getUsers: usr.getUsers,
        getOwner: usr.getOwner
      };

    }]);

})();