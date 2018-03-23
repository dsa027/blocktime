(function() {
  function HomeCtrl(Timer, Tasks) {
    this.timer = Timer;
    this.tasks = Tasks;
  }

  angular
    .module('blocTime')
    .controller('HomeCtrl', ['Timer', 'Tasks', HomeCtrl])
})()
