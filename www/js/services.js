angular.module('storyFactory', [])
.factory("Story", ["$FirebaseObject", "$firebase", "$firebaseUtils", function($FirebaseObject, $firebase, $firebaseUtils) {
  // create a new factory based on $FirebaseObject
  var StoryFactory = $FirebaseObject.$extendFactory({
    $$updated: function(snap) {
    // apply the changes using, here we'll just use the generic "updateRecord"
    $firebaseUtils.updateRec(this, snap);
    // notify listeners
    this.$$conf.notify();
  }
  });
  return function() {
    var ref = new Firebase("https://hacker-news.firebaseio.com/v0/topstories");
    // override the factory used by $firebase
    var sync = $firebase(ref, {objectFactory: StoryFactory});
    return sync.$asObject(); // this will be an instance of UserFactory
  }
}]);
