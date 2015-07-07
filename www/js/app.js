'use strict';

(function() {

  angular.module('carApp', [
    'ui.router'
  ])

  .config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$locationProvider', '$compileProvider',
  function($stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $compileProvider) {

    $stateProvider

      .state('home', {
        url: '/home',
        controller: 'HomeController',
        templateUrl: 'js/home/templates/home.html'
      })

      .state('login', {
        url: '/login/:type',
        controller: 'LoginController',
        templateUrl: 'js/login/templates/login.html'
      })

      .state('main', {
        url: '/main',
        controller: 'MainController',
        templateUrl: 'js/main/templates/main.html',
        resolve: {
          MapData: ['UserFactory',
          function(UserFactory) {
            return UserFactory.getUsers();
          }]
        }
      })
    ;
    $urlRouterProvider.otherwise('/home');

    $locationProvider.html5Mode(false);
    $compileProvider.debugInfoEnabled(false);
  }])

  .value('Fire', {
    path: 'https://dazzling-heat-9916.firebaseio.com',
    db: null,
    uid: null
  })

  .run(['Fire',
  function(Fire) {
    Fire.db = new Firebase(Fire.path);
  }]);

})();