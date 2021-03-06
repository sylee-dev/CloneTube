const videoContainer = document.getElementById("jsVideoPlayer");
const videoPlayer = document.querySelector("#jsVideoPlayer video");
const playBtn = document.getElementById("jsPlayButton");
const jsVolumeBtn = document.getElementById("jsVolumeBtn");
const fullScreenBtn = document.getElementById("jsFullScreen");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const volumeRange = document.getElementById("jsVolume");
const jsRunningTime = document.getElementById("jsRunningTime");

const registerView = () => {
  const getId = window.location.href.split("/videos/")[1];
  fetch(`/api/${getId}/view`, { method: "POST" });
};

const formatDate = (seconds) => {
  const secondsNumber = parseInt(seconds, 10);
  let hours = Math.floor(secondsNumber / 3600);
  let minutes = Math.floor((secondsNumber - hours * 3600) / 60);
  let totalSeconds = secondsNumber - hours * 3600 - minutes * 60;

  if (hours < 10) {
    hours = `0${hours}`;
  }
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  if (totalSeconds < 10) {
    totalSeconds = `0${totalSeconds}`;
  }
  return `${hours}:${minutes}:${totalSeconds}`;
};

function zeroHoursDelete(inputTime) {
  const splitTime = inputTime.split(":");
  let hours = splitTime[0];
  if (hours === "00" || hours === "0") {
    hours = "";
  } else {
    hours = `${hours}:`;
  }
  return `${hours}${splitTime[1]}:${splitTime[2]}`;
}

function setVolumeIcon(value) {
  console.log(value);
  if (value >= 0.6) {
    return '<i class="fas fa-volume-up"></i>';
  } else if (value > 0.3) {
    return '<i class="fas fa-volume-down"></i>';
  } else if (value <= 0) {
    return '<i class="fas fa-volume-mute"></i>';
  } else {
    return '<i class="fas fa-volume-off"></i>';
  }
}

function handlePlayClick() {
  if (videoPlayer.paused) {
    videoPlayer.play();
    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
  } else {
    videoPlayer.pause();
    playBtn.innerHTML = '<i class="fas fa-play"></i>';
  }
}

function handleVolumeClick() {
  if (videoPlayer.muted) {
    videoPlayer.muted = false;
    jsVolumeBtn.innerHTML = setVolumeIcon(videoPlayer.volume);
    volumeRange.value = videoPlayer.volume;
  } else {
    videoPlayer.muted = true;
    jsVolumeBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
    volumeRange.value = 0;
  }
}

function goFullScreen() {
  if (videoContainer.requestFullscreen) {
    videoContainer.requestFullscreen();
  } else if (videoContainer.mozRequestFullscreen) {
    videoContainer.mozRequestFullscreen();
  } else if (videoContainer.webkitRequestFullscreen) {
    videoContainer.webkitRequestFullscreen();
  } else if (videoContainer.msRequestFullscreen) {
    videoContainer.msRequestFullscreen();
  }

  fullScreenBtn.innerHTML = '<i class="fas fa-compress"></i>';
  fullScreenBtn.removeEventListener("click", goFullScreen);
  // eslint-disable-next-line no-use-before-define
  fullScreenBtn.addEventListener("click", exitFullScreen);
}

function exitFullScreen() {
  if (document.ExitFullscreen) {
    videoContainer.ExitFullscreen();
  } else if (document.mozExitFullscreen) {
    document.mozExitFullscreen();
  } else if (document.webkitExitFullscreen) {
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    document.msExitFullscreen();
  }

  fullScreenBtn.innerHTML = '<i class="fas fa-expand"></i>';
  fullScreenBtn.removeEventListener("click", exitFullScreen);
  fullScreenBtn.addEventListener("click", goFullScreen);
}

const setTotalRunningTime = () => {
  jsRunningTime.max = Math.floor(videoPlayer.duration);
  setInterval(() => {
    jsRunningTime.value = Math.floor(videoPlayer.currentTime);
  }, 1000);
};

function getCurrentTime() {
  currentTime.innerHTML = zeroHoursDelete(
    formatDate(Math.floor(videoPlayer.currentTime))
  );
}

function setTotalTime() {
  totalTime.innerHTML = zeroHoursDelete(formatDate(videoPlayer.duration));
  setTotalRunningTime();
  getCurrentTime();
  setInterval(getCurrentTime, 1000);
}

function handleEnded() {
  registerView();
  videoPlayer.currentTime = 0;
  playBtn.innerHTML = '<i class="fas fa-play"></i>';
}

function handleDrag(event) {
  const {
    target: { value },
  } = event;
  videoPlayer.volume = value;
  jsVolumeBtn.innerHTML = setVolumeIcon(value);
}

const handleChangeTime = () => {
  videoPlayer.currentTime = jsRunningTime.value;
};

function init() {
  videoPlayer.volume = 0.5;
  jsVolumeBtn.innerHTML = setVolumeIcon(videoPlayer.volume);
  playBtn.addEventListener("click", handlePlayClick);
  jsVolumeBtn.addEventListener("click", handleVolumeClick);
  fullScreenBtn.addEventListener("click", goFullScreen);
  videoPlayer.addEventListener("loadedmetadata", setTotalTime);
  videoPlayer.addEventListener("play", setTotalTime);
  videoPlayer.addEventListener("ended", handleEnded);
  videoPlayer.addEventListener("click", handlePlayClick);
  volumeRange.addEventListener("input", handleDrag);
  jsRunningTime.addEventListener("input", handleChangeTime);

  if (videoPlayer.readyState >= 2) {
    setTotalTime();
  }
}

if (videoContainer) {
  init();
}
