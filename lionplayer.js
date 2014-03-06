function LionPlayer(domelement) {
	var LionPlayer = this;
	
	this.domelement = domelement;
	this.domelement.setAttribute("status", "stop");
	
	if(this.htmlPlayer = domelement.getElementsByTagName("video")[0]){
		this.type="video";
	} else if(this.htmlPlayer = domelement.getElementsByTagName("audio")[0]){
		this.type="audio";
	} else {
		this.htmlPlayer = null;
		this.type = "undefine";
	}

	this.isFullscreen = false;
	this.playOnClick = true;
	this.domelement.style.position="relative";
	this.htmlPlayer.style.position="absolute";
	this.htmlPlayer.style.top="0";
	this.htmlPlayer.style.left="0";
	this.htmlPlayer.style.width="100%";
	this.htmlPlayer.style.height="100%";
	this.htmlPlayer.style.margin="0";
	this.htmlPlayer.style.padding="0";
//	this.htmlPlayer.controls = false;
	this.domWidth = this.htmlPlayer.offsetWidth;
	this.domHeight = this.htmlPlayer.offsetHeight;
	var size = parseInt(this.domHeight<this.domWidth ? this.domHeight*.085:this.domWidth*.085);

	var agent = navigator.userAgent.toLowerCase();
	var mobile = agent.indexOf('iphone')!=-1 ? 1:(
		agent.indexOf('ipad')!=-1 ? 1:(
			agent.indexOf('ipod')!=-1 ? 1:(
				agent.indexOf('mobile')!=-1 ? 1:0
			)
		)
	);
	
	if(this.htmlPlayer.hasAttribute("poster") && this.htmlPlayer.getAttribute("poster")!=""){
		this.poster = poster(this.htmlPlayer.getAttribute("poster"));
		this.domelement.appendChild(this.poster);
	}
	this.playBtn = playBtn(size);
	var playCenter = playBtnCenter();
	playCenter.appendChild(this.playBtn);
	this.domelement.appendChild(playCenter);
	
	this.videoOverlay = videoOverlay();
	this.domelement.appendChild(this.videoOverlay);
	this.controls = controls();
	this.timeBar = timeBar();
	this.controls.appendChild(this.timeBar);
	this.progressBar = progressBar();
	this.timeBar.appendChild(this.progressBar);
	this.durationLabel = durationLabel();
	this.controls.appendChild(this.durationLabel);
	this.progressLabel = progressLabel();
	this.controls.appendChild(this.progressLabel);
	this.fullscreenBtn = fullscreenBtn();
	this.controls.appendChild(this.fullscreenBtn);
	
	if(this.htmlPlayer.hasAttribute("controls") && this.htmlPlayer.getAttribute("controls")!="false"){
		this.domelement.appendChild(this.controls);
	}
	
	var stopPropagation = function(e){
		e.preventDefault();
		e.stopPropagation();
	};
	
	this.timeBar.addEventListener("click", stopPropagation, false);
	this.timeBar.addEventListener("dblclick", stopPropagation, false);
	this.progressLabel.addEventListener("click", stopPropagation, false);
	this.progressLabel.addEventListener("dblclick", stopPropagation, false);
	this.durationLabel.addEventListener("click", stopPropagation, false);
	this.durationLabel.addEventListener("dblclick", stopPropagation, false);
	this.fullscreenBtn.addEventListener("click", stopPropagation, false);
	this.fullscreenBtn.addEventListener("dblclick", stopPropagation, false);
	
	this.fullscreenBtn.addEventListener("click", function(e){
		LionPlayer.fullscreen();
	}, false);
	
	this.timeBar.addEventListener("click", function(e){
		var rect = this.getBoundingClientRect();
		LionPlayer.htmlPlayer.currentTime = LionPlayer.htmlPlayer.duration*(e.clientX-rect.left)/(rect.right-rect.left);
		
		if(LionPlayer.isPause()){
			LionPlayer.pause();
		}
	}, false);
	
	this.videoOverlay.addEventListener("click", function(e){
		e.preventDefault(); e.stopPropagation();
		if(LionPlayer.playOnClick){
			if(LionPlayer.isPause()){
				LionPlayer.play();	
			} else {
				LionPlayer.pause();
				if(mobile){
					LionPlayer.showControls();
				}
			}	
		}
	}, false);
	domelement.addEventListener("dblclick", function(e){
		e.preventDefault(); e.stopPropagation(); 
	}, false);
	
	// If mobile then always hide the progress bar and labels
	if(mobile){
		LionPlayer.hideControls();
	} else {
		domelement.addEventListener("mouseover", function(){
			LionPlayer.showControls();
		}, false);
		domelement.addEventListener("mouseout", function(){
			LionPlayer.hideControls();
		}, false);
	}
	this.htmlPlayer.addEventListener("play",function(){
		
	});
	this.htmlPlayer.addEventListener("ended", function(){
		LionPlayer.stop();
	});
	this.htmlPlayer.addEventListener("durationchange", function(){
		var seg = parseInt(LionPlayer.htmlPlayer.duration);
		var min = parseInt(seg/60);
		var hrs = parseInt(min/60);

		LionPlayer.durationLabel.innerHTML = hrs > 0 ? hrs+":"+min+":"+seg : (min<10 ? "0"+min:min)+":"+(seg<10 ? "0"+seg:seg);
	});
	
	this.htmlPlayer.addEventListener("timeupdate", function(){
		var seg = parseInt(LionPlayer.htmlPlayer.currentTime);
		var min = parseInt(seg/60);
		var hrs = parseInt(min/60);
		
		LionPlayer.progressLabel.innerHTML = hrs > 0 ? hrs+":"+min+":"+seg : (min<10 ? "0"+min:min)+":"+(seg<10 ? "0"+seg:seg);
		LionPlayer.progressBar.style.width = (LionPlayer.htmlPlayer.currentTime/LionPlayer.htmlPlayer.duration *100)+"%";
	});
	document.addEventListener("contextmenu", stopPropagation, false);
	
	document.addEventListener("fullscreenchange", function () {
	    LionPlayer.exitFullscreen()
	}, false);
		document.addEventListener("mozfullscreenchange", function () {
	    LionPlayer.exitFullscreen()
	}, false);
		document.addEventListener("webkitfullscreenchange", function () {
	    LionPlayer.exitFullscreen()
	}, false);
		document.addEventListener("msfullscreenchange", function () {
	    LionPlayer.exitFullscreen()
	}, false);

	// Remove the HTML5 controls
	this.htmlPlayer.removeAttribute("controls");
	// Remove the HTML5 poster
	this.htmlPlayer.removeAttribute("poster");
	
	console.log("new: "+this.type);
	
	return this;
}

/*
	* 
	*	Implemented Methods for user access
	*
*/
LionPlayer.prototype.play = function() {
	this.hidePlayBtn();
    this.htmlPlayer.play();
    this.domelement.setAttribute("status", "playing");
};
LionPlayer.prototype.pause = function() {
	this.showPlayBtn();
    this.htmlPlayer.pause();
    this.domelement.setAttribute("status", "paused");
};
LionPlayer.prototype.playPause = function() {
	if(this.isPause()){
		this.hidePlayBtn();
		this.htmlPlayer.play();
	} else {
		this.showPlayBtn();
		this.htmlPlayer.pause();
	}
};
LionPlayer.prototype.stop = function() {
	this.htmlPlayer.currentTime = 0;
    this.htmlPlayer.pause();
    this.domelement.setAttribute("status", "stop");
};
LionPlayer.prototype.isPause = function() {
    return this.htmlPlayer.paused;
};
LionPlayer.prototype.hidePlayBtn = function() {
    this.playBtn.className = this.playBtn.className.replace('showing','hidden');    
};
LionPlayer.prototype.showPlayBtn = function() {
    this.playBtn.className = this.playBtn.className.replace('hidden','showing');
};
LionPlayer.prototype.hideTimeBar = function() {
    this.timeBar.className = this.timeBar.className.replace('showing','hidden');    
};
LionPlayer.prototype.showTimeBar = function() {
    this.timeBar.className = this.timeBar.className.replace('hidden','showing');
};
LionPlayer.prototype.hideDuration = function() {
    this.durationLabel.className = this.durationLabel.className.replace('showing','hidden');
};
LionPlayer.prototype.showDuration = function() {
    this.durationLabel.className = this.durationLabel.className.replace('hidden','showing');    
};
LionPlayer.prototype.hideProgress = function() {
    this.progressLabel.className = this.progressLabel.className.replace('showing','hidden');    
};
LionPlayer.prototype.showProgress = function() {
    this.progressLabel.className = this.progressLabel.className.replace('hidden','showing');    
};
LionPlayer.prototype.hideFullscreen = function() {
    this.fullscreenBtn.className = this.fullscreenBtn.className.replace('showing','hidden');
};
LionPlayer.prototype.showFullscreen = function() {
    this.fullscreenBtn.className = this.fullscreenBtn.className.replace('hidden','showing');
};
LionPlayer.prototype.hideControls = function() {
	this.hideTimeBar();
	this.hideDuration();
	this.hideProgress();
	this.hideFullscreen();
} 
LionPlayer.prototype.showControls = function() {
	this.showTimeBar();
	this.showDuration();
	this.showProgress();
	this.showFullscreen();
} 
LionPlayer.prototype.exitFullscreen = function() {
	if(!(document.fullscreen || document.webkitIsFullScreen || document.mozFullScreen || document.msFullscreen)){
		this.domelement.style.width=this.domWidth+"px";
        this.domelement.style.height=this.domHeight+"px";
	}	
};
LionPlayer.prototype.fullscreen = function() {
	this.isFullscreen = !this.isFullscreen;
	
	if(this.isFullscreen){
		fs = this.domelement.requestFullscreen ||
			 this.domelement.mozRequestFullScreen ||
			 this.domelement.webkitRequestFullScreen ||
			 this.domelement.msRequestFullScreen
        ;
        if(fs) {
            fs.call(this.domelement);
            this.domelement.style.width="100%";
            this.domelement.style.height="100%";
        }
    } else {
    	fs = document.exitFullscreen ||
			 document.mozCancelFullScreen ||
			 document.webkitCancelFullScreen ||
			 document.msCancelFullScreen
        ;
        if(fs) {
            fs.call(document);
            this.domelement.style.width=this.domWidth+"px";
            this.domelement.style.height=this.domHeight+"px";
        }
    }
};
LionPlayer.prototype.addEvent = function(event,_function) {
	this.htmlPlayer.addEventListener(event,_function,false);
};
LionPlayer.prototype.addEventListener = function(event,_function) {
	this.htmlPlayer.addEventListener(event,_function,false);
};
LionPlayer.prototype.addEvents = function(dict) {
	for(var key in dict){
		this.htmlPlayer.addEventListener(key,dict[key],false);	
	}
};
LionPlayer.prototype.readyState = function() {
    return this.htmlPlayer.readyState;
};
LionPlayer.prototype.getType = function() {
    return this.type;
};

/*
	* 
	*	Buttons and Labels for the Video Player
	*
*/
var videoOverlay = function(){
	var overlay = document.createElement("div");
	overlay.setAttribute('class', "videoOverlay showing");
	return overlay;
}
var controls = function(){
	var div = document.createElement("div");
	div.setAttribute('class', "controls");
	return div;
}
var poster = function(src){
	var p = document.createElement("div");
	p.setAttribute('class', "poster");
	p.setAttribute('src', src);
	
	p.setAttribute('style', "background-image: url("+src+");");
	
	return p;
}
var playBtnCenter = function(){
	var dot = document.createElement("div");
	dot.setAttribute('class', "playBtnCenter");
	return dot;
}
var playBtn = function(size){
	var btn = document.createElement("div");
	btn.setAttribute('style', "top:-"+size+"px;left:-"+size/2+"px;border-top-width: "+size+"px;border-bottom-width: "+size+"px; border-left-width: "+size*1.5+"px;");
	btn.setAttribute('class', "playBtn showing");
	return btn;
}
var timeBar = function(){
	var bar = document.createElement("div");
	bar.setAttribute('class', "timeBar hidden");
	return bar;
}
var progressBar = function(){
	var bar = document.createElement("div");
	bar.setAttribute('class', "progressBar");
	return bar;
}
var progressLabel = function(){
	var progress = document.createElement("span");
	progress.setAttribute('class', "progressLabel hidden");
	progress.innerHTML = "00:00";
	return progress;
}
var durationLabel = function(){
	var duration = document.createElement("span");
	duration.setAttribute('class', "durationLabel hidden");
	duration.innerHTML = "00:00";
	return duration;
}
var fullscreenBtn = function(){
	var btn = document.createElement("div");
	btn.setAttribute('class', "fullscreenBtn hidden");
	return btn;
}