(function() {
  let btTimer = function(Timer, Tasks) {
    const analog = '/templates/directives/bt_analog_timer.html';
    const digital = '/templates/directives/bt_timer.html';
    return {
      replace: true,
      restrict: 'E',
      // transclude: true,
      scope: {
        handleStart: '&',
      },
      link: function(scope, element, attrs) {
        scope.tasks = function tasks() {
          return Tasks;
        }
        scope.timer = function timer() {
          return Timer;
        }

        scope.contentUrl = digital;
        attrs.$observe('aord', function(s) {
          scope.contentUrl = Timer.showAnalogTimer ? analog : digital;
        });

        attrs.$observe('title', function(value) {
          scope.title = value;
        });

        attrs.$observe('clock', function(value) {
          scope.clock = value;
        });

        attrs.$observe('label', function(value) {
          scope.label = value;
        });

        scope.handleStartButton = function handleStartButton() {
          scope.handleStart()
        }

        scope.$watch('clock', function() {
          Timer.playSound();
        });
      },
      template: '<div ng-include="contentUrl"></div>',
    }
  }

  angular
    .module('blocTime')
    .directive('btTimer', ['Timer', 'Tasks', btTimer])
})()
