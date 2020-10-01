const videoContainer = document.querySelector('.video-container');
const video = document.querySelector('.video-container video');

const controlsContainer = document.querySelector('.video-container .controls-container');

const playPauseButton = document.querySelector('.video-container .controls button.play-pause');
const rewindButton = document.querySelector('.video-container .controls button.rewind');
const fastForwardButton = document.querySelector('.video-container .controls button.fast-forward');
const volumeButton = document.querySelector('.video-container .controls button.volume');
const fullScreenButton = document.querySelector('.video-container .controls button.full-screen');
const playButton = playPauseButton.querySelector('.playing');
const pauseButton = playPauseButton.querySelector('.paused');
const fullVolumeButton = volumeButton.querySelector('.full-volume');
const mutedButton = volumeButton.querySelector('.muted');
const maximizeButton = fullScreenButton.querySelector('.maximize');
const minimizeButton = fullScreenButton.querySelector('.minimize');

const inputFile = document.querySelector('.video-container .controls .episodes .episodes-button');
const title = document.querySelector('.video-container .controls .title .series')
const progressBar = document.querySelector('.video-container .progress-controls .progress-bar');
const watchedBar = document.querySelector('.video-container .progress-controls .progress-bar .watched-bar');
const timeLeft = document.querySelector('.video-container .progress-controls .time-remaining');

let controlsTimeout;
controlsContainer.style.opacity = '0';
watchedBar.style.width = '0px';
pauseButton.style.display = 'none';
minimizeButton.style.display = 'none';

function calculateTime() {
  watchedBar.style.width = ((video.currentTime / video.duration) * 100) + '%';
  
  const totalSecondsRemaining = video.duration - video.currentTime;

  const time = new Date(null);
  time.setSeconds(totalSecondsRemaining);
  let hours = null;

  if(totalSecondsRemaining >= 3600) {
    hours = (time.getHours().toString()).padStart('2', '0');
  }

  let minutes = (time.getMinutes().toString()).padStart('2', '0');
  let seconds = (time.getSeconds().toString()).padStart('2', '0');

  timeLeft.textContent = `${hours ? hours : ''}${minutes}:${seconds}`;
}

video.oncanplay = () => {
  calculateTime();
}

inputFile.addEventListener('input', (e) => {
  video.src = inputFile.files[0].path + '#t=0.5';
  title.textContent = inputFile.files[0].name;
})

const displayControls = () => {
  controlsContainer.style.opacity = '1';
  document.body.style.cursor = 'initial';
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
  }
  controlsTimeout = setTimeout(() => {
    controlsContainer.style.opacity = '0';
    document.body.style.cursor = 'none';
  }, 5000);
};

const playPause = () => {
  if (video.paused) {
    video.play();
    playButton.style.display = 'none';
    pauseButton.style.display = '';
  } else {
    video.pause();
    playButton.style.display = '';
    pauseButton.style.display = 'none';
  }
};

const toggleMute = () => {
  video.muted = !video.muted;
  if (video.muted) {
    fullVolumeButton.style.display = 'none';
    mutedButton.style.display = '';
  } else {
    fullVolumeButton.style.display = '';
    mutedButton.style.display = 'none';
  }
};

const toggleFullScreen = () => {
  if (!document.fullscreenElement) {
    videoContainer.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
};

document.addEventListener('fullscreenchange', () => {
  if (!document.fullscreenElement) {
    maximizeButton.style.display = '';
    minimizeButton.style.display = 'none';
  } else {
    maximizeButton.style.display = 'none';
    minimizeButton.style.display = '';
  }
});

document.addEventListener('keyup', (event) => {
  if (event.code === 'Space') {
    playPause(); 
  }

  if (event.code === 'KeyM') {
    toggleMute();
  }

  if (event.code === 'KeyF') {
    toggleFullScreen();
  }

  if(event.code === 'ArrowRight') {
    video.currentTime += 10;
  }

  if(event.code === 'ArrowLeft') {
    video.currentTime -= 10;
  }

  displayControls();
});

document.addEventListener('mousemove', () => {
  displayControls();
});

document.addEventListener('mousedown', (event) => {
  
  if(event.detail == 2) {
    toggleFullScreen();
  }
  else if(event.detail == 1) {
    if(event.path[0].localName == 'video' || event.path[0].className == 'controls-container') {
      playPause();
    }
  }
})

video.addEventListener('timeupdate', () => {
  calculateTime();
});

progressBar.addEventListener('click', (event) => {
  const pos = (event.pageX  - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
  video.currentTime = pos * video.duration;
});

playPauseButton.addEventListener('click', playPause);

rewindButton.addEventListener('click', () => {
  video.currentTime -= 10;
});

fastForwardButton.addEventListener('click', () => {
  video.currentTime += 10;
});

volumeButton.addEventListener('click', toggleMute);

fullScreenButton.addEventListener('click', toggleFullScreen);

document.addEventListener('drop', (event) => {
  event.preventDefault();
  event.stopPropagation()

  if(event.dataTransfer.files.length == 1) {
    video.src = event.dataTransfer.files[0].path + '#t=0.5';
    video.play();
  }
})

document.addEventListener('dragover', (e) => { 
  e.preventDefault(); 
  e.stopPropagation(); 
}); 

document.addEventListener('dragenter', (event) => { 
  console.log('File is in the Drop Space'); 
}); 

document.addEventListener('dragleave', (event) => { 
  console.log('File has left the Drop Space'); 
});

ipc.on('open-file', function(filepath) {
  alert(filepath);
});