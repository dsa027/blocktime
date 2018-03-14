(function() {
  let btTimer = function(Timer) {
    return {
      templateUrl: '/templates/directives/bt_timer.html',
      replace: true,
      restrict: 'E',
      // transclude: true,
      scope: {
        handleStart: '&',
      },
      link: function(scope, element, attrs) {
        // var btTimer = $(element);

        attrs.$observe('title', function(value) {
          scope.title = value;
        })

        attrs.$observe('clock', function(value) {
          scope.clock = value;
        })

        attrs.$observe('label', function(value) {
          scope.label = value;
        })

        scope.handleStartButton = function handleStartButton() {
          scope.handleStart()
        }

        scope.$watch('clock', function() {
          Timer.playSound();
        });
      }
    }
  }

  angular
    .module('blocTime')
    .directive('btTimer', ['Timer', btTimer])
})()
