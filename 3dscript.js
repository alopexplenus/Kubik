var map,
    canvas,
	nu, //need update
    overlay;
var pi=Math.PI;
var key=[0,0,0,0]; // left, right, up, down
var dots = [];
var deltatheta=0, deltaphi=0;
var a=80; //полстороны куба
var xCoords = [];
var yCoords = [];
var zCoords = [];
var x0=200, y0=150;
var phi=0,theta=0,phirad,thetarad;
var dotscount=0;

function makecube(){ 
	for (var i=-1; i<2; i+=2){ 
		for (var j=-1; j<2; j+=2){ 
			for (var k=-1; k<2; k+=2){ 
				if (!(i==0 && j==0 && k==0)){
				xCoords.push(i);
				yCoords.push(j);
				zCoords.push(k);
				}
			} 
		} 
	} 
} 

function drawCanvas(){
	var xCoord, zCoord, yCoord; 
	deltaphi=0.02*(key[1]-key[0]);
	deltatheta=0.02*(key[3]-key[2]);
    for (var i=0; i<xCoords.length; i++) {
		xCoord=xCoords[i];
		yCoord=yCoords[i];
		zCoord=zCoords[i];
		if (key[0] || key[1]){
			phirad = Math.sqrt(xCoord*xCoord+zCoord*zCoord);
			phi = Math.asin(xCoord/phirad);
			if (zCoord<0) phi=pi-phi;
			xCoord=phirad*Math.sin(phi+deltaphi);
			zCoord=phirad*Math.cos(phi+deltaphi);
		}
		if (key[3] || key[2]){
			thetarad = Math.sqrt(yCoord*yCoord+zCoord*zCoord);
			theta = Math.asin(yCoord/thetarad);
			if (zCoord<0) theta=pi-theta;
			yCoord=thetarad*Math.sin(theta+deltatheta);
			zCoord=thetarad*Math.cos(theta+deltatheta);
		}
		dots[i].translate(xCoord-xCoords[i],yCoord-yCoords[i]);
		dots[i].attr({opacity: zCoord/2/a+1});
		xCoords[i]=xCoord;
		yCoords[i]=yCoord;
		zCoords[i]=zCoord;
    }
}
function update(){ 
	if (nu) drawCanvas();
	nu=false;
} 

function changeKey(which, to){
	//alert (to);
    switch (which){
        case 65: case 37: nu=true; key[0]=to; break; // left
        case 87: case 38: nu=true; key[2]=to; break; // up
        case 68: case 39: nu=true; key[1]=to; break; // right
        case 83: case 40: nu=true; key[3]=to; break;// down
    }
}
document.onkeydown=function(e){changeKey((e||window.event).keyCode, 1);};
document.onkeyup=function(e){changeKey((e||window.event).keyCode, 0);};

window.onload=function(){
//	alert("test");
	makecube();
    canvas=Raphael(document.getElementById("canvas"),400,300);
    canvas.rect(0, 150, 400, 150).attr({stroke: "none", fill: "none"});
	for (var i=0; i<xCoords.length; i++){ 
		xCoords[i]*=a;
		yCoords[i]*=a;
		zCoords[i]*=a;
		dots[i]=canvas.circle(xCoords[i]+x0,yCoords[i]+y0,10);
		 dots[i].show().attr({fill:"#f00"});
	}
	drawCanvas();
    setInterval(update, 35);//цикл ожидания нажатия клавиш и обновления картинки
};
