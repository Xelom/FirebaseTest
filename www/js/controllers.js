angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {
  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})
.controller('SearchCtrl', function($scope, $firebase, $http, Story) {
  $scope.topstories = [];
  var addStory = function(story, isNew) {
    $http.get('https://hacker-news.firebaseio.com/v0/item/'+story.$value+'.json')
    .success(function(data, status, headers, config) {
      if(isNew) {
        $scope.topstories.splice(story.$id,0,data);
      } else {
        $scope.topstories.splice(story.$id,1,data);
      }
    }).
    error(function(data, status, headers, config) {
      var excp = "";
    });
  };
  var ref = new Firebase("https://hacker-news.firebaseio.com/v0/topstories");
  var sync = $firebase(ref);
  var topstoriesRef = sync.$asArray();
  topstoriesRef.$loaded()
      .then(function(data) {
          angular.forEach(data, function(story){
            addStory(story,true);
          });
      });
  var unwatch = topstoriesRef.$watch(function(data) {
    if(data.event === "child_changed") {
      addStory(topstoriesRef.$getRecord(data.key), false);
    }
  });



})
.controller('PlaylistCtrl', function($scope, $stateParams, $http, $ionicPopover) {
    var url = 'http://ddragon.leagueoflegends.com/cdn/4.4.3/data/en_US/mastery.json';
    $http.get(url).
  success(function(data, status, headers, config) {
    $scope.masteries = data;
  }).
  error(function(data, status, headers, config) {
    var excp = "";
  });

  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope,
  }).then(function(popover) {
    $scope.popover = popover;
  });
  $scope.openPopover = function($event, masteryId) {
    $scope.currentMasteryId = masteryId;
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
});
