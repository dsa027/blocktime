(function() {
  function Timer($interval, $filter) {
    const FIVE_MINUTES = 5 * 60 * 1000;
    const TEN_MINUTES = 10 * 60 * 1000;
    const TWENTY_FIVE_MINUTES = 25 * 60 * 1000;
    const THIRTY_MINUTES = 30 * 60 * 1000;

    const SESSION_INTERVAL = TWENTY_FIVE_MINUTES;
    const BREAK_INTERVAL = FIVE_MINUTES;
    const LONG_BREAK_INTERVAL = THIRTY_MINUTES;


    let Timer = {}

    Timer.interruptions = 0;
    Timer.breaks = 0;

    Timer.inSession = true;
    Timer.timerOn = false;
    Timer.interval = SESSION_INTERVAL;
    Timer.justReset = true;

    Timer.alarm = new buzz.sound("/assets/sounds/alarm.wav", {preload:true});
    Timer.ding = new buzz.sound("/assets/sounds/ding.wav", {preload:true});
    Timer.doubleDing = new buzz.sound("/assets/sounds/double_ding.wav", {preload:true});

    Timer.title = function title() {
      return this.inSession ?
          "In Session"
          : (Timer.breaks % 4 === 0) ? "On Long Break" : "On Break";
    }

    Timer.startLabel = function startLabel() {
      return Timer.timerOn ? "Reset" : "Start";
    }

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
        Timer.inSession = !Timer.inSession;
        Timer.interval = getInterval();
        Timer.justReset = true;
        Timer.ticksToTime();
      }
    }

    function getInterval() {
      return Timer.inSession ?
          SESSION_INTERVAL
          : (++Timer.breaks % 4 === 0) ? LONG_BREAK_INTERVAL : BREAK_INTERVAL;
    }

    Timer.timerTicks = function timerTicks() {
      Timer.ticks++;
      Timer.ticksToTime();
    }

    Timer.playSound = function playSound() {
      if (Timer.justReset) {
        Timer.justReset = false;
        return;
      }
      switch(Timer.rightNow) {
        case 0: Timer.alarm.play(); break;  // done
        case TEN_MINUTES: Timer.ding.play(); break; // warning
        case FIVE_MINUTES: Timer.doubleDing.play(); break; // warning
      }
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

    Timer.interruptStyle = function interruptStyle() {
      switch (Timer.interruptions) {
        case 0: return {color:'green'}; break;
        case 1: return {color:'brown'}; break;
        default: return {color:'red'};
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
