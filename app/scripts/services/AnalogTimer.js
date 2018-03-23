(function() {
  function AnalogTimer() {
    const AnalogTimer = {};

    var canvas, ctx, radius, getMinutes, getSeconds

    // revised from https://codepen.io/gabrielbran/pen/PwvEbx
    // Analog Clock in HTML5

    AnalogTimer.init = function(minutes, seconds) {
      getMinutes = minutes;
      getSeconds = seconds;
      const canvas = document.getElementById("canvas");
      if (!canvas) {
        return false;
      }
      ctx = canvas.getContext("2d");
      radius = canvas.height / 2;
      ctx.translate(radius,radius);
      radius = radius * 0.90;

      return true;
    }

    AnalogTimer.drawClock = function() {
      AnalogTimer.drawFace(ctx, radius);
      AnalogTimer.drawNumbers(ctx, radius);
      AnalogTimer.drawTime(ctx, radius);
    }

    AnalogTimer.drawFace = function(ctx, radius){
      var grad;

      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2*Math.PI);
      ctx.fillStyle = 'darkblue';//"#bad455";
      ctx.fill();


      grad = ctx.createRadialGradient(0, 0, radius*0.8, 0, 0, radius*1.35);
      grad.addColorStop(0, '#000');
      grad.addColorStop(0.5, '#FFF');
      grad.addColorStop(1, '#FFF');
      ctx.strokeStyle = grad;
      ctx.lineWidth = radius*0.2;
      ctx.stroke();

      ctx.beginPath();
      // ctx.arc(0, 0, radius*0.05, 0, 2*Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
    }

    AnalogTimer.drawNumbers = function(ctx, radius) {
      var ang;
      var num;
      ctx.font = radius*0.15 + "px arial";
      ctx.textBaseline="middle";
      ctx.textAlign="center";
      for(num= 1; num < 13; num++){
        ang = num * Math.PI / 6;
        ctx.rotate(ang);
        ctx.translate(0, -radius*0.80);
        ctx.rotate(-ang);
        ctx.fillText((num===12?0:num*5).toString(), 0, 0);
        ctx.rotate(ang);
        ctx.translate(0, radius*0.80);
        ctx.rotate(-ang);
      }
    }

    AnalogTimer.drawTime = function(ctx, radius) {
      // var now = new Date();
      // var hour = now.getHours();
      var minute = getMinutes();//now.getMinutes();
      var second = getSeconds();//now.getSeconds();
      //hour
      // hour=hour%12;
      // hour=(hour*Math.PI/6)+(minute*Math.PI/(6*60))+(second*Math.PI/(360*60));
      // drawHand(ctx, hour, radius*0.4, radius*0.07);
      //minute
      minute=(minute*Math.PI/30)+(second*Math.PI/(30*60));
      AnalogTimer.drawHand(ctx, minute, radius*0.6, radius*0.07);
      // second
      second=(second*Math.PI/30);
      AnalogTimer.drawHand(ctx, second, radius*0.75, radius*0.02);
    }

    AnalogTimer.drawHand = function(ctx, pos, length, width) {
        ctx.strokeStyle = 'lightgray';
        ctx.beginPath();
        ctx.lineWidth = width;
        ctx.lineCap = "round";
        ctx.moveTo(0,0);
        ctx.rotate(pos);
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.rotate(-pos);
    }

    return AnalogTimer;
  }

  angular
    .module('blocTime')
    .factory('AnalogTimer', [AnalogTimer])
})()
