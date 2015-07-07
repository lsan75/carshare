'use strict';

(function() {

  angular.module('carApp')
    .factory('LoginFactory', ['$state', '$window', '$q', 'Fire',
    function($state, $window, $q, Fire) {

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

            log.createUser(form.signin).then(
              function() {
                log.signin(form.signin).then(
                  function() {
                    log.addUserData(type, form);
                    defer.resolve('signed');
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
          }, function(error) {
            if (error) {
              defer.reject(error);
            } else {
              defer.resolve('signed up');
            }
          });

          return defer.promise;
        },

        addUserData: function(type, form) {

          var obj = {
            uid: Fire.uid,
            email: form.signin.email,
            common: form.common
          };
          var base = 'passengers';

          if(type === 'proposer') {
            base = 'drivers';
            obj = angular.extend(obj, {driver: form.driver});
          }

          var child = Fire.db.child(base);
          child.push(obj);
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
              defer.resolve(authData.uid);
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