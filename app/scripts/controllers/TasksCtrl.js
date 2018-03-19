(function() {
  function TasksCtrl(Tasks) {
    this.tasks = Tasks;
  }

  angular
    .module('blocTime')
    .controller('TasksCtrl', ['Tasks', TasksCtrl])
})()
