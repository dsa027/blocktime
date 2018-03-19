(function() {
  function Tasks($firebaseArray, Timer) {
    const Tasks = {};
    const tNow = Date.now();
    const dZero = new Date(0);

    Tasks.ref = firebase.database().ref().child("tasks").orderByChild('created');
    Tasks.all = $firebaseArray(Tasks.ref);

    Tasks.newTaskName = "";
    Tasks.currentTask = {};
    Tasks.DEFAULT_TEXT = "Please Choose a Task";
    Tasks.currentTask.name = Tasks.DEFAULT_TEXT;
    Tasks.editing = false;
    Tasks.newTaskName = "";
    Tasks.isOpen = [];

    // Tasks.ref.on('value', function(snapshot) {
    // });

    Tasks.add = function add() {
      if (!Tasks.newTaskName) return;

      Tasks.all.$add({
        name: Tasks.newTaskName,
        valid_on: tNow,
        expire_on: 0,
        completed_on: 0,
        session_estimate: 0,
        session_actual: 0,
        created: tNow,
        updated: tNow,
      });
      Tasks.newTaskName = "";
    }

    Tasks.endOfSession = function endOfSession() {
      Tasks.currentTask.session_actual += 1;
      const idx = findCurrentTask();
      if (idx !== -1) {
        Tasks.save(idx);
      }
    }
    Timer.registerOnToggle(Tasks.endOfSession);

    function findCurrentTask() {
      return Tasks.all.findIndex(task => {
        return Tasks.currentTask.$id === task.$id;
      });
    }

    function millisToDate(what) {
      Object.entries(what).forEach(entry => {
        const key = entry[0];
        const val = entry[1];
        if (key.endsWith('_on')) {
          if (val === 0) what[key] = "";
          else what[key] = new Date(val);
        }
      });
    }

    function dateToMillis(what) {
      Object.entries(what).forEach(entry => {
        const key = entry[0];
        const val = entry[1];
        if (key.endsWith('_on')) {
          if (!val || val === dZero || val == "Invalid Date") {
            what[key] = 0;
          }
          else {
            what[key] = val.getTime();
          }
        }
      });
    }

    Tasks.save = function save(idx) {
      Tasks.all[idx] = Tasks.currentTask;
      dateToMillis(Tasks.all[idx]);
      Tasks.all.$save(idx).then(
        function(snapshot) {},
        function(error) {
          console.log(`Error saving: ${error}`)
        }
      );
      // convert Date(0).toString() to 0L
      millisToDate(Tasks.currentTask);
    }

    Tasks.focus = function focus(task) {
      Timer.init();
      if (task.$id !== Tasks.currentTask.$id) {
        Tasks.editing = false;
      }
      Tasks.currentTask = task;
      // from date's milliseconds to Date object
      millisToDate(Tasks.currentTask);
    }

    Tasks.showDate = function showDate(millis) {
      if (!millis || millis === "Invalid Date") {
        return "";
      }
      return new Date(millis).toLocaleDateString();
    }

    Tasks.getBorderStyle = function getBorderStyle(task) {
      return (task.$id === Tasks.currentTask.$id) ?
          {border: '1px solid darkblue'} :
          {};
    }

    Tasks.isCurrentTask = function isCurrentTask(task) {
      return task.$id === Tasks.currentTask.$id
    }

    Tasks.isEditingThisTask = function isEditingThisTask(task) {
      return Tasks.editing && Tasks.isCurrentTask(task)
    }

    Tasks.editTask = function editTask(index) {
      Tasks.editing = true;
      Tasks.isOpen[index] = true;
    }

    Tasks.doneEditingTask = function doneEditingTask(index) {
      Tasks.currentTask.updated = new Date().getTime();
      Tasks.save(index);
      Tasks.editing = false;
    }

    Tasks.openTask = function openTask(index) {
      Tasks.isOpen[index] = !Tasks.isOpen[index];
    }

    Tasks.completeTask = function completeTask(index) {
      const dNow = new Date();
      Tasks.currentTask.completed_on = dNow;
      Tasks.currentTask.updated = dNow;
      Tasks.save(index);
    }

    return Tasks;
  }

  angular
    .module('blocTime')
    .factory('Tasks', ['$firebaseArray', 'Timer', Tasks])
})()
