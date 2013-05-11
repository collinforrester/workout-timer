'use strict';

angular.module('workouttimerApp')
  .controller('MainCtrl', function ($scope, $timeout) {

    $scope.currentTimeLeft = $scope.displayTime = 0;

    $scope.newExercise = {
      length: 45
    };

    $scope.exercises = [];
    // $scope.exercises = [{
    //   'title': 'stretch',
    //   'length': 3,
    //   'complete': false
    // }, {
    //   'title': 'stretch',
    //   'length': 3,
    //   'complete': false
    // }];

    $scope.$watch('currentTimeLeft', function(n) {
      if( n > 59 ) {
        var minutes = Math.floor(n / 60);
        var seconds = n - minutes * 60;
        $scope.displayTime = ((''+minutes).length > 1 ? minutes : '0' + minutes) + ':' + ((''+seconds).length > 1 ? seconds : '0' + seconds);
      } else {
        $scope.displayTime = '00:' + ((''+n).length > 1 ? n : '0' + n);
      }
    });

    $scope.getReady = function() {
      $scope.prepare = true;
      $scope.iterations = 5;
      $timeout(function getReadyCountdown() {
        if( --$scope.iterations === 0 ) {
          $scope.prepare = false;
          $scope.start(0);
        } else {
          $timeout( getReadyCountdown, 1000);
        }
      }, 1000);
    };

    $scope.$on('Exercise.Done', function(event, index) {
      if( index < $scope.exercises.length - 1 ) {
        $scope.start(++index);
      } else {
        // play the ring
        document.getElementById('quiet-ring').play();
        $scope.inProgress = false;
      }
    });

    $scope.updateExercise = function() {
      $scope.isEditing = null;
    };

    $scope.edit = function(index) {
      $scope.isEditing = index;
    };

    $scope.delete = function(index) {
      $scope.currentTimeLeft -= $scope.exercises[index].length;
      $scope.exercises.splice(index,1);
    };

    $scope.reset = function() {
      for(var i = 0; i < $scope.exercises.length; i++) {
        $scope.exercises[i].complete = false;
      }
      $scope.inProgress = false;
    };

    $scope.addExercise = function() {
      $scope.$safeApply(function() {
        $scope.exercises.push(angular.extend($scope.newExercise, {
          'complete':false
        }));
      });
      $scope.currentTimeLeft += $scope.newExercise.length;
      $scope.newExercise = {
        length: 45
      };
    };

    $scope.start = function(index) {
      $scope.inProgress = true;
      // set it as the current exercise
      $scope.currentExercise = $scope.exercises[index];
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
