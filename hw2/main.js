/**
**	Author:Pengyu Li
*/

var imgList=[null,null];
function changingImg(id){
	if(imgList[id]==null){
		var imgs = document.getElementsByTagName("img");
		var imgGa = ["1.jpg",
					  "2.jpg",
					  "3.jpg"];
		var idx = 0;
		imgList[id] = setInterval(function(){
			imgs[id].src = imgGa[idx++ % imgGa.length]; 
		},1000*Math.floor((Math.random() * 5) + 1));
	}
}
function pausingImg(idx){
	clearInterval(imgList[idx]);
	imgList[idx] = null;
}
window.onload=function(){
	
	for(var i = 0; i < 2; i++){
		changingImg(i);
	}
}



