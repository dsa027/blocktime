---
title: Bloctime
summary: A Web-based, SPA time managment system (Pomodoro) written in Angular
tech: Angular, Firebase, Node.js, JavaScript, HTML/CSS, Heroku, GitHub
---
[1]: https://bloctime-angular-dsa027.herokuapp.com/
[Heroku][1]

# Summary

  A time managment system (Pomodoro) written in Angular

# Explanation

  This application is shown on a single page. On the left, narrow side is where tasks are created, updated and displayed. On the right, wide side, is the session and break area for the selected task.

  The task area has an input box where you can add a new task. A new task is created into the incomplete category. There are several categories that the tasks may be in after they're created.
      - Incomplete: these are tasks that need to be worked on. Click on a task name to select it, which will then allow you to use the break and session timer.
      - Complete: These tasks have been marked complete.
      - Expired: These tasks have expired whether finished or not.
      - Not Yet Valid: These tasks are not yet able to be accessed  because they're not yet valid. Once they're valid, they'll automatically be placed into the Incomplete category unless they're expired.

  Each task, may be opened up by either clicking on the task or, in the Incomplete category, by clicking on the task's arrow. Once opened, you can see the Expire:, Valid:, and Estimated Sessions: fields.

  In the Incomplete category, you'll also see a Task Complete button that will close the task and put it into the Complete category. Next to the task's title is an edit icon, click it to edit the fields, including the task's title. Click the Done Editing button to complete editing.

  Tasks in the Complete category may be moved back to the Incomplete category by clicking the Mark Incomplete button.

  Expired and Not Yet Valid tasks cannot be changed.

  In the right side of the window is the Break and Session timer. You may choose an analog or digital clock. The way the Pomodoro works:
    - Choose a task
    - Click on Start under the clock. This will start a session, which lasts 25 minutes. You may interrupt the timer by clicking on the Interrupt Session button (interruptions are kept track of), or by letting the clock run down.
    - Once the session is done, you may start your break by again clicking Start. There's a 5-minute break after every session and every 4th break is 30 minutes.

  The application is generally broken down by
  - Home: a container for Time and Tasks
  - Time: the break and session timer
  + Tasks: the tasks that are broken down into breaks and sessions

# Problem

  This was a seemingly-simple yet nicely complex application. The interplay between a task and the timer added complexity. And the ability to have either a digital or analog clock was made into a directive.

# Solution
  This project shows the practical application of several technologies:
  - Angular
    - The entire application is written for Angular. Controllers, Services, and Directives are used.
  - Firebase
  - Node.js
  - JavaScript
  - HTML/CSS
  - Heroku
  - GitHub

# Results

  Bloctime should have authentication so that it can be used by multiple users.

# Conclusion
  ToDos
  - Authentication
