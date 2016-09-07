//Author: Pengyu Li
window.onload = function(){
	var btn = document.getElementById("btn");
	var playground = document.getElementById('playground');
	var width = playground.offsetWidth;
	var height = playground.offsetHeight;

	var rect = playground.getBoundingClientRect();
	var btn_rect = btn.getBoundingClientRect();

	function getRandomInt(min, max) {
	  min = Math.ceil(min);
	  max = Math.floor(max);
	  return Math.floor(Math.random() * (max - min)) + min;
	}
	var escape = function(e){
		e = e || window.event;
		var top = getRandomInt(0,rect.height-btn_rect.height);
		btn.style.top = top+"px";
		btn.style.left = getRandomInt(0,rect.width-btn_rect.width)+"px";
	}
	var reset = function(e){
			e = e || window.event;
			location.search = "";
	}
	updateText = function(b){
		b.value = "Play Again!";
	}
	var keyup = function(e){
		if(e.keyCode == 16){
			btn.addEventListener("mouseover",escape);
		}
	};
	var cong = function(e){
			e = e || window.event;
			playground.innerHTML = playground.innerHTML+"<div class=\"cong\"><p>Conguratuations!</p><p>You Won!</p></div>";
			var btn = document.getElementById("btn");
			updateText(btn);
			btn.innerHTML = "Play Again";
			var newBtn = btn.cloneNode(true);
			btn.parentNode.replaceChild(newBtn, btn);			//alert(btn.value);
			newBtn.addEventListener("click",reset,false);
			return
	}

	

	btn.addEventListener("click",cong,true);
	
	btn.addEventListener("mouseover",escape,false);

	

	document.addEventListener("keydown",function(e){
		if(e.keyCode == 16){
			btn.removeEventListener("mouseover",escape);
		}

	},false);

	document.addEventListener("keyup",keyup,false);
}