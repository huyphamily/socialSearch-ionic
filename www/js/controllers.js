angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $http, $state, queryFactory) {
  $scope.redditFilter = true;
  $scope.instagramFilter = true;
  $scope.twitterFilter = true;

  $ionicModal.fromTemplateUrl('templates/filter.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.closeFilter = function() {
    $scope.modal.hide();
    $state.go($state.current, {}, {reload: true});
  };

  $scope.filter = function() {
    $scope.modal.show();
  };

  $scope.search = function(query) {
    queryFactory.getQuery(query);
  };

  $scope.getResults = function() {
    $scope.results = queryFactory.getResults();
  };
})
.factory('queryFactory', ['$http', '$state', function($http, $state) {
  var results;

  return {
    getQuery: function(query) {
      var q = query.replace(' ', '+');
      var search = 'http://socialsearchd.herokuapp.com/api/search?q=' + q + '&callback=JSON_CALLBACK';
      
      
      $http.jsonp(search).success(function(data) {
        console.log('hihi');
        console.log(data.reddit);
        var res = [];

        for (var key in data) {
          data[key].forEach(function(post) {
            post.loc = key;

            if (key === 'reddit') {
              if (post.title.length > 100) {
                post.title = post.title.substr(0,100) + '...';
              }
              post.date = timeAgo(post.date);
            }
            res.push(post);
          });
        }

        /*res = shuffle(res);
        res = shuffle(res);*/
        results = res;

        $state.go('app.results');
      });
    },

    getResults: function() {
      return results;
    }
  };
}]);
