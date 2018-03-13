(function() {
  function TimerCtrl(Timer) {
    this.timer = Timer;
  }

  angular
    .module('blocTime')
    .controller('TimerCtrl', ['Timer', TimerCtrl])
})()
