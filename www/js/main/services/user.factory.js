'use strict';

(function() {

  angular.module('carApp')
    .factory('UserFactory', ['$q', '$window', '$state', 'Fire',
    function($q, $window, $state, Fire) {

      var usr = {

        getUsers: function() {
          var defer = $q.defer();
          usr.testCurrentUser();

          var db = Fire.db.child('people');
          var otherType = Fire.owner.type === 'proposer' ? 'chercher' : 'proposer';
          db.orderByChild('type').equalTo(otherType).once('value', function(data) {
            var obj = data.val();
            var users = [];
            angular.forEach(obj, function(user) {
              users.push(user);
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
          db.orderByChild('uid').equalTo(Fire.owner.uid).once('value', function(data) {
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

        testCurrentUser: function() {
          if(!Fire.owner) {
            usr.getCurrentUser();
          }
        },

        updateOwner: function(data) {
          var defer = $q.defer();
          usr.testCurrentUser();

          var db = Fire.db.child('people');
          db.orderByChild('uid').equalTo(Fire.owner.uid).once('value', function(res) {
            angular.forEach(res.val(), function(res, key) {
              var owner = db.child(key);

              var updateObj = {
                common: data.common
              };

              if(data.driver) {
                angular.extend(updateObj, {driver: data.driver});
              }

              owner.update(updateObj, function(error) {
                if(error) {
                  defer.reject(error);
                } else {
                  Fire.owner.common = data.common;
                  if(data.driver) {
                    Fire.owner.driver = data.driver;
                  }
                  usr.setCurrentUser(Fire.owner);
                  defer.resolve('done');
                }
              });
            });
          });

          return defer.promise;
        },

        getCurrentUser: function() {
          Fire.owner = JSON.parse($window.sessionStorage.getItem('user'));
          return Fire.owner;
        },

        setCurrentUser: function(user) {
          $window.sessionStorage.setItem('user', JSON.stringify(user));
          Fire.owner = user;
        }
      };

      return {
        getUsers: usr.getUsers,
        getOwner: usr.getOwner,
        updateOwner: usr.updateOwner,
        getCurrentUser: usr.getCurrentUser,
        setCurrentUser: usr.setCurrentUser
      };

    }]);

})();