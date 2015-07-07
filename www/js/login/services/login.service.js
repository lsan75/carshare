'use strict';

(function() {

  angular.module('carApp')
    .factory('LoginFactory', ['$state', '$window', '$q', 'Fire', 'UserFactory',
    function($state, $window, $q, Fire, UserFactory) {

      var log = {

        initialize: function(type, signin, form) {

          var defer = $q.defer();

        // signin
          if (signin) {
            log.signin(form.signin).then(
              function() {
                defer.resolve('signed in');
              },
              function() {
                defer.reject('wrong creds');
              });
          } else {

        // signup
            log.createUser(form.signin).then(
              function(uid) {
                Fire.uid = uid;
                log.signin(form.signin).then(function() {
                  log.addUserData(type, form).then(function() {
                    defer.resolve('signed');
                  });
                });
              },
              function(error) {
                defer.reject('Error creating user:', error);
              });

          }

        // return promise
          return  defer.promise;

        },

        createUser: function(creds) {
          var defer = $q.defer();

          Fire.db.createUser({
            email    : creds.email,
            password : creds.password
          }, function(error, userData) {
            if (error) {
              defer.reject(error);
            } else {
              defer.resolve(userData.uid);
            }
          });

          return defer.promise;
        },

        addUserData: function(type, form) {
          var defer = $q.defer();
          var obj = {
            uid: Fire.uid,
            email: form.signin.email,
            common: form.common,
            type: type
          };

          if(type === 'proposer') {
            obj = angular.extend(obj, {driver: form.driver});
          }

          var child = Fire.db.child('people');
          child.push(obj, function(error) {
            if (error) {
              defer.reject('');
            } else {
              UserFactory.setCurrentUser(obj);
              defer.resolve('');
            }
          });

          return defer.promise;
        },

        signin: function(creds) {

          var defer = $q.defer();

          Fire.db.authWithPassword({
            email    : creds.email,
            password : creds.password
          }, function(error, authData) {
            if (error) {
              defer.reject(error);
            } else {
              Fire.uid = authData.uid;
              UserFactory.getOwner().then(function() {
                defer.resolve(authData.uid);
              });
            }
          },
          {
            remember: 'none' // or 'sessionOnly'
          });

          return defer.promise;
        }
      };

      return {
        initialize: log.initialize
      };
    }]);

})();