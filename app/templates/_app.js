(function () {
  "use strict";

  /**
  * App Module
  *
  */

  var app = angular.module('<%= _.camelize(appName) %>', []);


  app.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'main.tpl.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  }]);

  app.controller('MainCtrl', ['$scope', function ($scope) {
      // controller logic;
  }]);

})();