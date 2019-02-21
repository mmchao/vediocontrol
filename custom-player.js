var media = document.querySelector('video');
var controls = document.querySelector('.controls');

var play = document.querySelector('.play');
var stop = document.querySelector('.stop');
var rwd = document.querySelector('.rwd');
var fwd = document.querySelector('.fwd');

var timerWrapper = document.querySelector('.timer');
var timer = document.querySelector('.timer span');
var timerBar = document.querySelector('.timer div');

media.removeAttribute('controls');
controls.style.visibility = 'visible';

play.addEventListener('click', playPauseMedia);
stop.addEventListener('click', stopMedia);
media.addEventListener('ended', stopMedia);
rwd.addEventListener('click', mediaBackward);
fwd.addEventListener('click', mediaForward);
media.addEventListener('timeupdate', setTime);

function playPauseMedia() {
  stopFwd();
  stopRwd();
  if(media.paused) {
    play.setAttribute('data-icon','u');
    media.play();
  } else {
    play.setAttribute('data-icon','P');
    media.pause();
  }
}

function stopMedia() {
  media.pause();
  media.currentTime = 0;
  stopFwd();
  stopRwd();
  play.setAttribute('data-icon','P');
}

var intervalFwd;
var intervalRwd;

function stopFwd() {
  clearInterval(intervalFwd);
  fwd.classList.remove('active');
}

function stopRwd() {
  clearInterval(intervalRwd);
  rwd.classList.remove('active');
}

function mediaBackward() {
  stopFwd();

  if(rwd.classList.contains('active')) {
    stopRwd();
    media.play();
	play.setAttribute('data-icon','u');
  } else {
    rwd.classList.add('active');
    media.pause();
	play.setAttribute('data-icon','P');
    intervalRwd = setInterval(windBackward, 200);
  }
}

function mediaForward() {
  stopRwd();

  if(fwd.classList.contains('active')) {
    stopFwd();
    media.play();
	play.setAttribute('data-icon','u');
  } else {
    fwd.classList.add('active');
    media.pause();
	play.setAttribute('data-icon','P');
    intervalFwd = setInterval(windForward, 200);
  }
}

function windBackward() {
  if(media.currentTime <= 3) {
    stopMedia();
  } else {
    media.currentTime -= 3;
  }
}

function windForward() {
  if(media.currentTime >= media.duration - 3) {
    stopMedia();
  } else {
    media.currentTime += 3;
  }
}

function setTime() {
  var minutes = Math.floor(media.currentTime / 60);
  var seconds = Math.floor(media.currentTime - minutes * 60);
  var minuteValue;
  var secondValue;

  if (minutes < 10) {
    minuteValue = '0' + minutes;
  } else {
    minuteValue = minutes;
  }

  if (seconds < 10) {
    secondValue = '0' + seconds;
  } else {
    secondValue = seconds;
  }

  var mediaTime = minuteValue + ':' + secondValue;
  timer.textContent = mediaTime;

  var barLength = timerWrapper.clientWidth * (media.currentTime/media.duration);
  timerBar.style.width = barLength + 'px';
}

var timerRect = timerBar.getBoundingClientRect();

timerWrapper.onclick = function(e) {
   var clickX = e.x - timerRect.x
   media.currentTime = media.duration * (clickX/timerWrapper.clientWidth);
   stopFwd();
   stopRwd();     
}

window.onkeydown = e => {
   if (e.key === 'ArrowLeft') {
      mediaBackward();
   } else if (e.key === 'ArrowRight') {
      mediaForward();
   }
}