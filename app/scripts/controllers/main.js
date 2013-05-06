'use strict';

angular.module('workouttimerApp')
  .controller('MainCtrl', function ($scope, $timeout) {
    $scope.exercises = [{
      'title': 'stretch',
      'length': 3,
      'complete': false
    }, {
      'title': 'stretch',
      'length': 3,
      'complete': false
    }];

    $scope.$on('Exercise.Done', function(event, index) {
      if( index < $scope.exercises.length - 1 ) {
        $scope.start(++index);
      } else {
        // play the ring
        document.getElementById('quiet-ring').play();
        $scope.inProgress = false;
      }
    });

    $scope.reset = function() {
      for(var i = 0; i < $scope.exercises.length; i++) {
        $scope.exercises[i].complete = false;
      }
      $scope.inProgress = false;
    };

    $scope.addExercise = function() {
      $scope.exercises.push(angular.extend($scope.newExercise, {
        'complete':false
      }));
    };

    $scope.start = function(index) {
      $scope.inProgress = true;
      // set it as the current exercise
      $scope.currentExercise = $scope.exercises[index];
      // and start the timer
      $scope.currentTimeLeft = $scope.currentExercise.length;
      $timeout(function countdown() {
        if( --$scope.currentTimeLeft === 0 ) {
          $scope.exercises[index].complete = true;
          $scope.$broadcast('Exercise.Done', index);
        } else {
          $timeout( countdown, 1000);
        }
      }, 1000);
    };
  });