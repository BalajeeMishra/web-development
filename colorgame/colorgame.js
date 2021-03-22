var numsqure=6
var colors=generaterandomcolors(numsqure);
var squres=document.querySelectorAll(".square");
var pickedcolor=pickcolor();
var colordisplay=document.getElementById("colordisplay");
var messagedisplay=document.querySelector("#message");
var h1=document.querySelector("h1");
var resetbutton=document.querySelector("#reset");
var easybtn=document.querySelector("#easybtn");
var hardbtn=document.querySelector("#hardbtn");
easybtn.addEventListener("click",function(){
	/*hardbtn.classlist.remove("selected");
	easybtn.classlist.add("selected");*/
	numsqure=3;
	colors=generaterandomcolors(numsqure);
	pickedcolor=pickcolor();
	colordisplay.textContent=pickedcolor;
	for(var i=0;i<squres.length;i++){
		if(colors[i]){
			squres[i].style.background=colors[i];
		}
		else{
			squres[i].style.display="none";
		}
	}
});

hardbtn.addEventListener("click",function(){
	/*hardbtn.classlist.add("selected");
	easybtn.classlist.remove("selected");*/
	numsqure=6;
	colors=generaterandomcolors(numsqure);
	pickedcolor=pickcolor();
	colordisplay.textContent=pickedcolor;
	colordisplay.textContent="pickedcolor";
	for(var i=0;i<squres.length;i++){
			squres[i].style.background=colors[i];
			squres[i].style.display="block";
	}

});
resetbutton.addEventListener("click",function(){
	colors=generaterandomcolors(numsqure);
	 pickedcolor=pickcolor();
	 this.textContent="New Colors"
	colordisplay.textContent=pickedcolor;
	for(var i=0;i<squres.length;i++){
		squres[i].style.background=colors[i];

	}
	messagedisplay.textContent="";
	h1.style.background="steelblue";
});
colordisplay.textContent=pickedcolor;
for(var i=0;i<squres.length;i++)
	{
		squres[i].style.background=colors[i];
		squres[i].addEventListener("click",function(){
		var clickedcolor=this.style.background;
		if(clickedcolor === pickedcolor)
			{
				messagedisplay.textContent="correct";
				changecolor(clickedcolor);
			    h1.style.background=clickedcolor;
			    resetbutton.textContent="play again?"
			}
			else{
				this.style.background="#232323";
				messagedisplay.textContent="try again";
			}
		});
	}
	function changecolor(color){
		for(var i=0;i<colors.length;i++){
			squres[i].style.background=color;

		}

	}
	function pickcolor(){
		var random=Math.floor(Math.random()*colors.length);
		return colors[random];
	}
	function generaterandomcolors(num){
		var arr=[];
		for(var i=0;i<num;i++)
		{
         arr.push(randomcolor())
		}
		return arr;
	}
	function randomcolor(){
		var r=Math.floor(Math.random()*256);
		var g=Math.floor(Math.random()*256);
		var b=Math.floor(Math.random()*256);
		return "rgb(" + r + ", " + g + ", " + b +")";
	}


