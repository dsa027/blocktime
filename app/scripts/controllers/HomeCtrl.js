(function() {
  function HomeCtrl(Timer) {
    this.timer = Timer;
  }

  angular
    .module('blocTime')
    .controller('HomeCtrl', ['Timer', HomeCtrl])
})()
