// 只修改必要的部分，保持其他代码不变
const track = document.getElementById("track");
const thumbnail = document.getElementById("thumbnail");
const background = document.getElementById("background");
const trackArtist = document.getElementById("track-artist");
const trackTitle = document.getElementById("track-title");
const currentTime = document.getElementById("currentTime");
const durationTime = document.getElementById("durationTime");
const vampireBtn = document.querySelector('.vampire-btn');
const videoBackground = document.getElementById('video-background');
const progressBar = document.querySelector('#progress');
const progressDot = document.querySelector('#progress-dot');
const progressPath = document.querySelector('.progress-path');

let trackIndex = 0;
let playing = true;
let isDragging = false;

// 音乐列表数据
const tracks = ["2024.mp3", "righteous.mp3", "nonstop.mp3", "SOUTH OF FRANCE .mp3"];
const thumbnails = ["2.png", "juicewrld.png", "drake.png", "france.png"];
const trackArtists = ["playboi carti", "juice wrld", "drake", "future"];
const trackTitles = ["2024", "righteous", "nonstop", "SOUTH OF FRANCE"];

// 时间格式化函数
function formatTime(sec) {
    if (isNaN(sec)) return "0:00";
    let minutes = Math.floor(sec / 60);
    let seconds = Math.floor(sec - minutes * 60);
    if (seconds < 10) {
        seconds = `0${seconds}`;
    }
    return `${minutes}:${seconds}`;
}

// 修改后的进度条更新函数
function updateProgress() {
    if (!isDragging) {
        const progressPath = document.querySelector('.progress-path');
        const length = progressPath.getTotalLength();
        
        // 设置总长度
        progressPath.style.strokeDasharray = `${length} ${length}`;
        
        // 计算进度
        const progress = (track.currentTime / track.duration) || 0;
        const dashOffset = length - (progress * length);
        progressPath.style.strokeDashoffset = dashOffset;

        // 更新跟踪点位置 - 现在始终显示
        progressDot.style.display = 'block';
        const pointOnPath = progressPath.getPointAtLength(progress * length);
        progressDot.setAttribute('cx', pointOnPath.x);
        progressDot.setAttribute('cy', pointOnPath.y);
    }
    
    // 更新时间显示
    currentTime.textContent = formatTime(track.currentTime);
    durationTime.textContent = formatTime(track.duration);
    
    requestAnimationFrame(updateProgress);
}

// 进度条交互处理函数
function handleProgressInteraction(e) {
    const rect = progressBar.getBoundingClientRect();
    
    // 计算百分比并限制在 0-1 之间
    const clickX = Math.max(rect.left, Math.min(e.clientX, rect.right));
    const percentage = Math.max(0, Math.min(1, (clickX - rect.left) / rect.width));
    
    // 获取实际路径上的点
    const pathLength = progressPath.getTotalLength();
    const pointOnPath = progressPath.getPointAtLength(percentage * pathLength);
    
    // 直接使用路径上的点坐标
    progressDot.setAttribute('cx', pointOnPath.x);
    progressDot.setAttribute('cy', pointOnPath.y);
    
    // 更新进度条
    progressPath.style.strokeDashoffset = pathLength - (percentage * pathLength);
    
    // 更新音频时间
    if (!isNaN(track.duration)) {
        track.currentTime = percentage * track.duration;
    }
}

// 触摸事件处理函数
function handleProgressTouch(e) {
    const rect = progressBar.getBoundingClientRect();
    const touch = e.touches[0] || e.changedTouches[0];
    
    // 计算百分比并限制在 0-1 之间
    const touchX = Math.max(rect.left, Math.min(touch.clientX, rect.right));
    const percentage = Math.max(0, Math.min(1, (touchX - rect.left) / rect.width));
    
    // 获取实际路径上的点
    const pathLength = progressPath.getTotalLength();
    const pointOnPath = progressPath.getPointAtLength(percentage * pathLength);
    
    // 更新跟踪点位置
    progressDot.setAttribute('cx', pointOnPath.x);
    progressDot.setAttribute('cy', pointOnPath.y);
    
    // 更新进度条
    progressPath.style.strokeDashoffset = pathLength - (percentage * pathLength);
    
    // 更新音频时间
    if (!isNaN(track.duration)) {
        track.currentTime = percentage * track.duration;
    }
}

// 保持其他函数不变
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
    
    if (trackIndex === 0 && !track.currentTime) {
        vampireBtn.classList.remove('playing');
        thumbnail.style.transform = "scale(1)";
    } else {
        track.play().catch(e => console.log('Audio play error:', e));
        vampireBtn.classList.add('playing');
        thumbnail.style.transform = "scale(1.25)";
    }
}

function pausePlay() {
    if (playing) {
        vampireBtn.classList.add('playing');
        thumbnail.style.transform = "scale(1.25)";
        track.play().catch(error => {
            console.log("Audio play error:", error);
        });
        playing = false;
    } else {
        vampireBtn.classList.remove('playing');
        thumbnail.style.transform = "scale(1)";
        track.pause();
        playing = true;
    }
}

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
    // 初始化音乐播放器
    updateTrack();
    
    // 添加触摸事件支持
    progressBar.addEventListener('touchstart', (e) => {
        e.preventDefault();
        isDragging = true;
        progressBar.classList.add('dragging');
        progressDot.classList.add('active');
        handleProgressTouch(e);
    });
    
    progressBar.addEventListener('touchmove', (e) => {
        e.preventDefault();
        if (isDragging) {
            handleProgressTouch(e);
        }
    });
    
    progressBar.addEventListener('touchend', () => {
        isDragging = false;
        progressBar.classList.remove('dragging');
        progressDot.classList.remove('active');
    });
    
    // 鼠标事件
    progressBar.addEventListener('click', (e) => {
        if (!isDragging) {
            handleProgressInteraction(e);
        }
    });
    
    progressBar.addEventListener('mousedown', (e) => {
        isDragging = true;
        progressBar.classList.add('dragging');
        progressDot.classList.add('active');
        handleProgressInteraction(e);
    });
    
    document.addEventListener('mousemove', (e) => {
        if (isDragging) {
            handleProgressInteraction(e);
        }
    });
    
    document.addEventListener('mouseup', () => {
        if (isDragging) {
            isDragging = false;
            progressBar.classList.remove('dragging');
            progressDot.classList.remove('active');
        }
    });
    
    // 播放控制
    vampireBtn.addEventListener('click', pausePlay);
    document.getElementById('next-track').addEventListener('click', nextTrack);
    document.getElementById('prev-track').addEventListener('click', prevTrack);
    track.addEventListener('ended', nextTrack);
    
    // 启动进度更新
    requestAnimationFrame(updateProgress);
    
    // 错误处理
    track.addEventListener('error', (e) => {
        console.log("Audio error:", e);
    });
    
    videoBackground.addEventListener('error', (e) => {
        console.log("Video error:", e);
    });
});