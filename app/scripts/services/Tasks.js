(function() {
  function Tasks($firebaseArray, Timer) {
    const Tasks = {};
    const dZero = new Date(0);

    Tasks.ref = firebase.database().ref().child("tasks").orderByChild('desc_created');
    Tasks.all = $firebaseArray(Tasks.ref);

    Tasks.DEFAULT_TEXT = "Please Click on an Incomplete Task";

    Tasks.newTaskName = "";
    Tasks.editing = false;
    Tasks.isOpen = [];
    Tasks.filtered = {};

    Tasks.clearCurrentTask = function clearCurrentTask() {
      Tasks.currentTask = {};
      Tasks.currentTask.name = Tasks.DEFAULT_TEXT;
    }
    Tasks.clearCurrentTask();

    Tasks.startButtonDisabled = function startButtonDisabled() {
      return Tasks.currentTask.name === Tasks.DEFAULT_TEXT;
    }

    Tasks.filterByIncomplete = function filterByIncomplete() {
      const now = new Date().getTime();
      Tasks.filtered.incomplete = Tasks.all.filter(task => {
        return !task.completed_on &&
            (!task.expire_on || (task.expire_on && task.expire_on > now)) &&
            (!task.valid_on || (task.valid_on && task.valid_on <= now));
      });
      return Tasks.filtered.incomplete;
    }
    Tasks.incompleteLength = function incompleteLength() {
      return Tasks.filterByIncomplete().length;
    }

    Tasks.filterByComplete = function filterByComplete() {
      Tasks.filtered.complete = Tasks.all.filter(task => {
        return task.completed_on;
      });
      return Tasks.filtered.complete;
    }
    Tasks.completeLength = function completeLength() {
      return Tasks.filterByComplete().length;
    }

    Tasks.filterByExpired = function filterByExpired() {
      const now = new Date().getTime();
      Tasks.filtered.expired = Tasks.all.filter(task => {
        return !task.completed_on &&
            task.expire_on && task.expire_on <= now;
      });
      return Tasks.filtered.expired;
    }
    Tasks.expiredLength = function expiredLength() {
      return Tasks.filterByExpired().length;
    }

    Tasks.filterByInvalid = function filterByInvalid() {
      const now = new Date().getTime();
      Tasks.filtered.invalid = Tasks.all.filter(task => {
        return !task.completed_on && task.valid_on &&
            task.valid_on > now;
      });
      return Tasks.filtered.invalid;
    }
    Tasks.invalidLength = function invalidLength() {
      return Tasks.filterByInvalid().length;
    }

    Tasks.isExpiring = function isExpiring() {
      if (new Date(Tasks.currentTask.expire_on).getTime() <= new Date().getTime()) {
        Tasks.saveTask(Tasks.currentTask); // saves task
        Tasks.clearCurrentTask();
      }
    }

    Tasks.isInvalid = function isInvalid() {
      if (new Date(Tasks.currentTask.valid_on).getTime() > new Date().getTime()) {
        Tasks.saveTask(Tasks.currentTask); // saves task
        Tasks.clearCurrentTask();
      }
    }

    // Tasks.ref.on('value', function(snapshot) {
    // });

    Tasks.add = function add() {
      if (!Tasks.newTaskName) return;

      const tNow = Date.now();

      Tasks.all.$add({
        name: Tasks.newTaskName,
        valid_on: tNow,
        expire_on: 0,
        completed_on: 0,
        session_estimate: 0,
        session_actual: 0,
        created: tNow,
        updated: tNow,
        desc_created: 0 - tNow,
      });
      Tasks.newTaskName = "";
    }

    Tasks.endOfSession = function endOfSession() {
      if (!Tasks.isIncompleteTask(Tasks.currentTask)) {
        return;
      }
      Tasks.currentTask.session_actual += 1;
      Tasks.save(Tasks.findTask(Tasks.currentTask));
    }

    Timer.registerOnToggle(Tasks.endOfSession);

    function findIncompleteTask(lookingFor) {
      return Tasks.filtered.incomplete.findIndex(task => {
        return lookingFor.$id === task.$id;
      });
    }
    function findCompleteTask(lookingFor) {
      return Tasks.filtered.complete.findIndex(task => {
        return lookingFor.$id === task.$id;
      });
    }

    Tasks.isIncompleteTask = function isIncompleteTask(task) {
      return findIncompleteTask(task) !== -1;
    }
    Tasks.isCompleteTask = function isCompleteTask(task) {
      return findCompleteTask(task) !== -1;
    }

    Tasks.findTask = function findTask(lookingFor) {
      return Tasks.all.findIndex(task => {
        return lookingFor.$id === task.$id;
      });
    }

    function millisToDate(what) {
      Object.entries(what).forEach(entry => {
        const key = entry[0];
        const val = entry[1];
        if (key.endsWith('_on')) {
          if (val === 0) what[key] = "";
          else what[key] = new Date(val);

          if (what[key] == "Invalid Date") what[key] = "";
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

    Tasks.save = function save(task) {
      const idx = Tasks.findTask(task);
      if (idx === -1) {
        return;
      }
      Tasks.all[idx] = Tasks.currentTask;
      dateToMillis(Tasks.all[idx]);

      Tasks.all.$save(idx).then(
        function(snapshot) {
        },
        function(error) {
          console.log(`Error saving: ${error}`)
        }
      );
      // convert Date(0).toString() to 0L
      millisToDate(Tasks.currentTask);
    }

    Tasks.focus = function focus(task) {
      if (!Tasks.isIncompleteTask(task)) return;

      Timer.init();
      if (task.$id !== Tasks.currentTask.$id) {
        Tasks.closeTask(Tasks.currentTask);
        Tasks.editing = false;
      }
      Tasks.currentTask = task;
      Tasks.openTask(Tasks.currentTask);
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

    Tasks.editTask = function editTask(index, task) {
      if (!Tasks.isIncompleteTask(task)) return;

      Tasks.editing = true;
      Tasks.isOpen[index] = true;
    }

    Tasks.saveTask = function saveTask(task) {
      Tasks.currentTask.updated = new Date().getTime();
      Tasks.save(task);
      Tasks.editing = false;
    }

    Tasks.isTaskOpen = function isTaskOpen(task) {
      const idx = Tasks.findTask(task);
      if (idx !== -1) {
        return Tasks.isOpen[idx];
      }

      return false;
    }

    Tasks.toggleOpenTask = function toggleOpenTask(task) {
      const idx = Tasks.findTask(task);
      if (idx !== -1) {
        Tasks.isOpen[idx] = !Tasks.isOpen[idx];
      }
    }
    Tasks.closeTask = function closeTask(task) {
      const idx = Tasks.findTask(task);
      if (idx !== -1) {
        Tasks.isOpen[idx] = false;
      }
    }
    Tasks.openTask = function openTask(task) {
      const idx = Tasks.findTask(task);
      if (idx !== -1) {
        Tasks.isOpen[idx] = true
      }
    }

    Tasks.completeTask = function completeTask(task) {
      const now = new Date();
      Tasks.currentTask.completed_on = now;
      Tasks.currentTask.updated = now;
      if (Timer.timerOn) {
        Timer.toggleTimer();
      }
      Tasks.save(task);
      Tasks.clearCurrentTask();
    }

    Tasks.incompleteTask = function incompleteTask(task) {
      const currentHold = Tasks.currentTask;
      Tasks.currentTask = task;
      millisToDate(Tasks.currentTask);
      Tasks.currentTask.completed_on = new Date(0);
      Tasks.currentTask.updated = new Date();
      Tasks.save(task);
      Tasks.currentTask = currentHold;
    }

    return Tasks;
  }

  angular
    .module('blocTime')
    .factory('Tasks', ['$firebaseArray', 'Timer', Tasks])
})()
