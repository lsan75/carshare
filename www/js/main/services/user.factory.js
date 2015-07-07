'use strict';

(function() {

  angular.module('carApp')
    .factory('UserFactory', ['$q', '$state', 'Fire',
    function($q, $state, Fire) {

      var currentUser = {};

      var usr = {

        getUsers: function() {
          var defer = $q.defer();

          var db = Fire.db.child('people');
          var otherType = currentUser.type === 'proposer' ? 'chercher' : 'proposer';
          db.orderByChild('type').equalTo(otherType).once('value', function(data) {
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

        getOwner: function() {
          var defer = $q.defer();

          var db = Fire.db.child('people');
          db.orderByChild('uid').equalTo(Fire.uid).once('value', function(data) {
            var obj = data.val();
            angular.forEach(obj, function(user) {
              usr.setCurrentUser(user);
            });
            defer.resolve('done');
          }, function() {
            defer.reject('');
            $state.go('home');
          });

          return defer.promise;
        },

        getCurrentUser: function() {
          return currentUser;
        },

        setCurrentUser: function(user) {
          currentUser = user;
        }
      };

      return {
        getUsers: usr.getUsers,
        getOwner: usr.getOwner,
        getCurrentUser: usr.getCurrentUser,
        setCurrentUser: usr.setCurrentUser
      };

    }]);

})();