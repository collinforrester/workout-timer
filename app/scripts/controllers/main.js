'use strict';

/* globals _ */
angular.module('workouttimerApp')
  .controller('MainCtrl', function ($scope, $timeout) {

    $scope.totalTimeLeft = $scope.currentExerciseDisplayTime = $scope.exerciseTimeLeft = $scope.totalDisplayTime = 0;

    $scope.newExercise = {
      length: 2
    };

    $scope.exercises = [];

    $scope.$watch('totalTimeLeft', function(n) {
      $scope.totalDisplayTime = timeFormatter(n);
      $scope.currentExerciseDisplayTime = timeFormatter($scope.exerciseTimeLeft);
    });

    $scope.$on('Exercise.Done', function(event, index) {
      if( index < $scope.exercises.length - 1 ) {
        $scope.start();
      } else {
        // play the ring
        document.getElementById('quiet-ring').play();
        $scope.inProgress = false;
      }
    });

    function timeFormatter(n) {
      var formattedTime = '';
      if( n > 59 ) {
        var minutes = Math.floor(n / 60);
        var seconds = n - minutes * 60;
        formattedTime = ((''+minutes).length > 1 ? minutes : '0' + minutes) + ':' + ((''+seconds).length > 1 ? seconds : '0' + seconds);
      } else {
        formattedTime = '00:' + ((''+n).length > 1 ? n : '0' + n);
      }
      return formattedTime;
    }

    $scope.pause = function() {
      $scope.inProgress = false;
    };

    $scope.updateExercise = function() {
      $scope.isEditing = null;
    };

    $scope.edit = function(index) {
      $scope.isEditing = index;
    };

    $scope.delete = function(index) {
      $scope.totalTimeLeft -= $scope.exercises[index].length;
      $scope.exercises.splice(index,1);
    };

    $scope.reset = function() {
      for(var i = 0; i < $scope.exercises.length; i++) {
        $scope.exercises[i].complete = false;
        $scope.totalTimeLeft += $scope.exercises[i].length;
      }
      $scope.inProgress = false;
    };

    $scope.addExercise = function() {
      $scope.$safeApply(function() {
        $scope.exercises.push(angular.extend($scope.newExercise, {
          'complete':false
        }));
      });
      $scope.totalTimeLeft += $scope.newExercise.length;
      $scope.newExercise = {
        length: 2
      };
    };

    $scope.start = function() {
      $scope.inProgress = true;

      // start at the first one that isn't done
      // this is probably really inefficient. O(n) !!!!!!
      var firstIncomplete = _.findWhere($scope.exercises, {complete: false});
      var index = _.indexOf( $scope.exercises, firstIncomplete );
      console.log('working on exercise ' + index, firstIncomplete );
      $scope.currentExercise = $scope.exercises[index];
      $scope.exerciseTimeLeft = $scope.currentExercise.length;
      $timeout(function countdown() {
        if(!$scope.inProgress) {
          return;
        }
        --$scope.totalTimeLeft;
        if(--$scope.exerciseTimeLeft <= 0 ) {
          $scope.exercises[index].complete = true;
          $scope.$broadcast('Exercise.Done', index);
        } else {
          $timeout( countdown, 1000);
        }
      }, 1000);
    };
  });
