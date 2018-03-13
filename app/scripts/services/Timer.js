(function() {
  function Timer($interval, $filter) {
    let Timer = {}

    Timer.album = "";
    Timer.interruptions = 0;

    Timer.timerOn = false;
    Timer.interval = 25 * 60 * 1000; // 25 minutes;

    Timer.toggleTimer = function toggleTimer() {
      if (!Timer.timerOn) {
        Timer.timerOn = true;
        Timer.ticks = 0;
        Timer.timer = $interval(Timer.timerTicks, 1000)
      }
      else {
        Timer.timerOn = false;
        Timer.ticks = 0;
        $interval.cancel(Timer.timer);
        Timer.ticksToTime();
      }
    }

    Timer.timerTicks = function timerTicks() {
      Timer.ticks++;
      Timer.ticksToTime();
    }

    Timer.ticksToTime = function ticksToTime() {
      if (Timer.ticks * 1000 > Timer.interval) {
        Timer.rightNow = -((Timer.ticks * 1000) - Timer.interval);
      }
      else {
        Timer.rightNow = Timer.interval - (Timer.ticks * 1000);
      }
    }

    Timer.timeMmSs = function timeMmSs() {
      var negative = Timer.rightNow < 0;
      var t = negative ? -Timer.rightNow : Timer.rightNow;

      return `${negative ? "-" : ""}${$filter('date')(t, "mm:ss")}`
    }

    Timer.interruption = function interruption() {
      if (Timer.timerOn) {
        Timer.toggleTimer();
        Timer.interruptions++;
      }
    }

    Timer.ticks = 0;
    Timer.ticksToTime();

    return Timer
  }

angular
   .module('blocTime')
   .factory('Timer', ['$interval', '$filter', Timer])
})();
