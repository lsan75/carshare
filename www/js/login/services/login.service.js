'use strict';

(function() {

  angular.module('carApp')
    .factory('LoginFactory', ['$q', 'Fire', 'UserFactory',
    function($q, Fire, UserFactory) {

      var log = {

        initialize: function(type, signin, form) {

          var defer = $q.defer();

        // signin
          if (signin) {
            log.signin(form.signin).then(
              function() {
                defer.resolve('signed in');
              },
              function(msg) {
                defer.reject(msg);
              });
          } else {

        // signup
            log.createUser(form.signin).then(
              function(uid) {
                log.signin(form.signin).then(function() {
                  log.addUserData(type, form, uid).then(function() {
                    defer.resolve('signed');
                  });
                });
              },
              function(msg) {
                defer.reject(msg);
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
              defer.reject(error.message);
            } else {
              defer.resolve(userData.uid);
            }
          });

          return defer.promise;
        },

        addUserData: function(type, form, uid) {
          var defer = $q.defer();

          form.common.address = null;
          var obj = {
            uid: uid,
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
              defer.reject(error.message);
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
              defer.reject(error.message);
            } else {
              Fire.owner = {
                uid: authData.uid
              };
              UserFactory.getOwner().then(function() {
                defer.resolve(authData.uid);
              });
            }
          },
          {
            remember: 'sessionOnly' // or 'none'
          });

          return defer.promise;
        }
      };

      return {
        initialize: log.initialize
      };
    }]);

})();