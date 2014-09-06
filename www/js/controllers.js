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

  $ionicModal.fromTemplateUrl('templates/twitterCard.html', function(modal) {
    $scope.twitterModal = modal;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('templates/instagramCard.html', function(modal) {
    $scope.instagramModal = modal;
  }, {
    scope: $scope
  });

  $ionicModal.fromTemplateUrl('templates/redditCard.html', function(modal) {
    $scope.redditModal = modal;
  }, {
    scope: $scope
  });

  $scope.twitterResult = function(post) {
    console.log(post);
    $scope.item = post;
    $scope.twitterModal.show();
  };

  $scope.instagramResult = function(post) {
    console.log(post);
    $scope.item = post;
    $scope.instagramModal.show();
  };
  $scope.redditResult = function(post) {
    console.log(post);
    $scope.item = post;
    $scope.redditModal.show();
  };

  $scope.closeFilter = function() {
    $scope.modal.hide();
  };

  $scope.closeTweet = function() {
    $scope.twitterModal.hide();
  };

  $scope.closeInstagram = function() {
    $scope.instagramModal.hide();
  };

  $scope.closePost = function() {
    $scope.redditModal.hide();
  };

  $scope.filter = function() {
    $scope.modal.show();
  };

  $scope.search = function(query) {
    queryFactory.getQuery(query);
  };

  $scope.getResults = function() {
    $scope.results = queryFactory.getResults();
    $scope.results.forEach(function(item) {
      if (item.loc === 'reddit') {
        item.click = $scope.redditResult;
      }

      if (item.loc === 'twitter') {
        item.click = $scope.twitterResult;
      }

      if (item.loc === 'instagram') {
        item.click = $scope.instagramResult;
      }
    });
  };
})
.factory('queryFactory', ['$http', '$state', function($http, $state) {
  var results;

  function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
       array[i] = array[j];
      array[j] = temp;
    }
    return array;
  }

  function timeAgo(unixT) {
    var d = new Date();
    var nowTs = Math.floor(d.getTime()/1000);
    var seconds = nowTs-unixT;

    if (seconds > 12*30*24*60*60) {
      return Math.floor(seconds/(12*30*24*60*60)) + ' years ago';
    } else if (seconds > 30*24*60*60) {
      return Math.floor(seconds/(30*24*60*60)) + ' months ago';
    } else if (seconds > 24*60*60) {
      return Math.floor(seconds/(24*60*60)) + ' days ago';
    } else if (seconds > 60*60) {
       return Math.floor(seconds/(60*60)) + ' hours ago';
    } else if (seconds > 60) {
       return Math.floor(seconds/60) + ' minutes ago';
    } else {
      return Math.floor(seconds) + ' seconds ago';
    }
  }

  return {
    getQuery: function(query) {
      var q = query.replace(' ', '+');
      var search = 'http://socialsearchd.herokuapp.com/api/search?q=' + q + '&callback=JSON_CALLBACK';
      
      
      $http.jsonp(search).success(function(data) {
        
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

            if (key === 'twitter') {
              var d = new Date(post.data);
              post.date = d.toLocaleString();
              post.id = post.link.replace(/.*\/statuses\//, '');
            }

            if (key === 'instagram') {
              var e = new Date(post.date * 1000);
              post.date = e.toLocaleString();
            }
            res.push(post);
          });
        }

        res = shuffle(res);
        res = shuffle(res);
        results = res;

        $state.go('app.results');
      });
    },

    getResults: function() {
      return results;
    }
  };
}])
.factory('filterFactory', [function() {
  var reddit = true;
  var instagram = true;
  var twitter =  true;

  return {
    getReddit: function () {
      return reddit;
    },

    getInstagram: function () {
      return instagram;
    },

    getTwitter: function () {
      return twitter;
    },

    setReddit: function (input) {
      reddit = input;
    },

    setInstagram: function (input) {
      instagram = input;
    },

    setTwitter: function (input) {
      twitter = input;
    },
  };
}]);
