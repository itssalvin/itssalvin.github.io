// 变量声明
const track = document.getElementById("track");
const thumbnail = document.getElementById("thumbnail");
const background = document.getElementById("background");
const trackArtist = document.getElementById("track-artist");
const trackTitle = document.getElementById("track-title");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const vampireBtn = document.querySelector('.vampire-btn');
const videoBackground = document.getElementById('video-background');

let trackIndex = 0;
let playing =true;


// 音乐列表数据
const tracks = ["2024.mp3", "righteous.mp3", "nonstop.mp3", "SOUTH OF FRANCE .mp3"];
const thumbnails = ["1.png", "juicewrld.png", "drake.png", "france.png"];
const trackArtists = ["playboi carti", "juice wrld", "drake", "future"];
const trackTitles = ["2024", "righteous", "nonstop", "SOUTH OF FRANCE"];

// 新增：进度条更新函数
function updateProgress() {
    const progressPath = document.querySelector('.progress-path');
    const length = progressPath.getTotalLength();
    progressPath.style.strokeDasharray = length;
    
    // 计算进度
    const progress = (track.currentTime / track.duration) || 0;
    const offset = length - (progress * length);
    progressPath.style.strokeDashoffset = offset;

    // 更新时间显示
    currentTime.textContent = formatTime(track.currentTime);
    durationTime.textContent = formatTime(track.duration);

    // 继续更新
    requestAnimationFrame(updateProgress);
}

// 新增：进度条点击处理函数
function handleProgressClick(e) {
    const progressBar = document.querySelector('#progress');
    const rect = progressBar.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const percentage = x / width;
    
    track.currentTime = percentage * track.duration;
}

// 新增：时间格式化函数
function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec - minutes * 60);
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

// 更新曲目信息
function updateTrack() {
  track.src = tracks[trackIndex];
  thumbnail.src = thumbnails[trackIndex];
  
  if (trackTitles[trackIndex] === "SOUTH OF FRANCE") {
      background.style.display = 'none';
      videoBackground.style.display = 'block';
      videoBackground.play().catch(e => console.log('Video play error:', e));
  } else {
      background.style.display = 'block';
      videoBackground.style.display = 'none';
      videoBackground.pause();
      background.src = thumbnails[trackIndex];
  }
  
  trackArtist.textContent = trackArtists[trackIndex];
  trackTitle.textContent = trackTitles[trackIndex];
  
  // 仅在第一次初始化时设置灰色状态，切换歌曲时保持当前播放状态
  if (trackIndex === 0 && !track.currentTime) {
      vampireBtn.classList.remove('playing');
      thumbnail.style.transform = "scale(1)";
  } else {
      // 如果是切换歌曲，立即开始播放
      track.play();
      vampireBtn.classList.add('playing');
      thumbnail.style.transform = "scale(1.25)";
  }
}

// 播放控制
function pausePlay() {
  if (playing) {
      vampireBtn.classList.add('playing');
      thumbnail.style.transform = "scale(1.25)";
      const playPromise = track.play();
      if (playPromise !== undefined) {
          playPromise.catch(error => {
              console.log("Audio play failed:", error);
          });
      }
      playing = false;
  } else {
      vampireBtn.classList.remove('playing');
      thumbnail.style.transform = "scale(1)";
      track.pause();
      playing = true;
  }
}
// 切换曲目
function nextTrack() {
    trackIndex = (trackIndex + 1) % tracks.length;
    updateTrack();
}

function prevTrack() {
    trackIndex = (trackIndex - 1 + tracks.length) % tracks.length;
    updateTrack();
}

// 初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始加载第一首歌
    updateTrack();
    
    // 进度条点击
    const progressBar = document.querySelector('#progress');
    progressBar.addEventListener('click', handleProgressClick);
    
    // 播放控制
    vampireBtn.addEventListener('click', pausePlay);
    
    // 切换曲目按钮
    document.getElementById('next-track').addEventListener('click', nextTrack);
    document.getElementById('prev-track').addEventListener('click', prevTrack);
    
    // 自动下一曲
    track.addEventListener('ended', nextTrack);
    
    // 启动进度更新
    requestAnimationFrame(updateProgress);
    
    // 音频加载错误处理
    track.addEventListener('error', (e) => {
        console.log("Audio error:", e);
    });
    
    // 视频加载错误处理
    videoBackground.addEventListener('error', (e) => {
        console.log("Video error:", e);
    });
  function handleProgressInteraction(e) {
    // 获取SVG元素
    const progressBar = document.querySelector('#progress');
    // 获取SVG的实际显示尺寸和位置
    const rect = progressBar.getBoundingClientRect();
    
    // 计算点击位置相对于SVG的准确百分比
    // 确保e.clientX在rect.left和rect.right之间
    const clickX = Math.max(rect.left, Math.min(e.clientX, rect.right));
    const percentage = (clickX - rect.left) / rect.width;

    // 更新进度条显示
    const progressPath = document.querySelector('.progress-path');
    const length = progressPath.getTotalLength();
    const offset = length - (percentage * length);
    progressPath.style.strokeDashoffset = offset;
    
    // 更新音频时间
    if (!isNaN(track.duration)) {
        track.currentTime = percentage * track.duration;
    }
}

// 在初始化时添加事件监听
document.addEventListener('DOMContentLoaded', () => {
    const progressBar = document.querySelector('#progress');
    
    // 移除旧的点击处理程序，添加新的
    progressBar.addEventListener('click', handleProgressInteraction);
    progressBar.addEventListener('mousedown', (e) => {
        handleProgressInteraction(e);
        isDragging = true;
    });

    // 拖动处理
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            handleProgressInteraction(e);
        }
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
    });
});
});