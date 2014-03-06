#LionPlayer

Description
-----------

HTML5 Videoplayer easy to manipulate and mobile compatible.

The javascript is simple but strong, allows you to add an object the way you'll do it in HTML5 with controls, poster and sources elements for video, LionPlayer will arrange the events for rapid reproduction and functions like:

* play - will star playing
* pause - will pause
* stop - will pause and retorn to begin
* playpause - will play if paused, or pause if playing
* fullscreen - when fired with user interaction goes fullscreen on webkit, moz, opera and ms.

The LionPlayer object is compatible with mootools or jquery and pretty much every web browser. In adition with the functions you cand easily add events with *LionPlayer.addEventListener('event')* or *LionPlayer.addevent('event)* like in mootools.


Aplication
----------

Import the lionplayer.js
Import the lionplayer.css
Initialize you object sending the DOMElement with the "lionplayer" class.

###Demo:
	<div class="lionplayer">
		<video controls="true" poster="cover.png">
			<source type="video/mp4" src="video.mp4" />
		</video>
	</div>
	<script>
		var element = domelement.getElementsByClassName("lionplayer")[0];
		var lionplayer = new LionPlayer(element);
	
		lionplayer.addEvent('play');
		lionplayer.play();
	</script>
That will get you running. The minimalist style of the player make easy to adapt to you personal design, just make you own .css and add what ever you want under the class .lionplayer for any object in it, including the states *(showing or hidden)*.
<pre><code>
.lionplayer .*element* .*state*{
}
</code></pre>
Example:
<pre><code>
.lionplayer[status="stop"] .poster{
	background-size:cover;
	/*Set the Aspect of the poster to fill*/
}
.lionplayer[status="paused"]{
}
.lionplayer[status="stop"]{
}
.lionplayer video{
	object-fit:contain;
	/*Add space for video aspetc to fit*/
}
.lionplayer .playBtn{
        display: block;
}
.lionplayer .playBtn .hidden{
	display:block;
	/*So is always visible*/
}
.lionplayer .videoOverlay{
        opacity:1;
        background:#fff;
        /*Hide the video on the back*/
}
.lionplayer .controls{
	top:0;
	/*For the controls on top of video*/
}
.lionplayer .durationLabel{
	color:red;
	/*Set the label for video duration red*/
}
</code></pre>
