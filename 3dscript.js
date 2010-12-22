var canvas, nu; //need update
	//overlay;
var pi=Math.PI;
var dotrad = 5;
var key=[0,0,0,0]; // left, right, up, down
var dots = [];
var deltatheta=0, deltaphi=0;
var a=80; //полстороны куба
var xCoords = [];
var yCoords = [];
var zCoords = [];
var orderCoords = [];
var bottom1;
var bottom2;
var bottom4;
var bottom3;
var top1;
var top2;
var top4;
var top3;
var cubeside = []; 
var x0=150, y0=150;
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

function drawCanvas(){ // Вот самая главная, тут всё рисуется
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
		dots[i].attr({opacity: zCoord/2/a+1, fill: "#f00"});
		xCoords[i]=xCoord;
		yCoords[i]=yCoord;
		zCoords[i]=zCoord;
		orderCoords[i]=zCoords[i];
    }
	orderCoords.sort(function(a,b){return (b-a)});
	var top4Coords = orderCoords[1]+orderCoords[2]-orderCoords[0];
	var bottom4Coords = orderCoords[7]+orderCoords[6]-orderCoords[8];
	//alert(orderCoords);
	for(cs=0;cs<8;cs++){ 
		switch (zCoords[cs]){ 
			case orderCoords[0]: top1=cs;
			break;
			case orderCoords[1]: top2=cs;
			break;
			case orderCoords[2]: top3=cs;
			break;
			case orderCoords[7]: bottom1=cs;
			break;
			case orderCoords[6]: bottom2=cs;
			break;
			case orderCoords[5]: bottom3=cs;
			break;
			case top4Coords: top4=cs;
			break;
			case bottom4Coords: bottom4=cs;
			break;
		} 
	} 
	dots[top1].attr({fill: "#fff"});


	var squarey = [ yCoords[top1]+y0,yCoords[top2]+y0,yCoords[top2]+yCoords[top3]-yCoords[top1]+y0,yCoords[top3]+y0];
	var squarex = [ xCoords[top1]+x0,xCoords[top2]+x0,xCoords[top2]+xCoords[top3]-xCoords[top1]+x0,xCoords[top3]+x0];
	drawPolygon(1,squarex,squarey,"#699");
squarey = [yCoords[top1]+y0,yCoords[top2]+y0,yCoords[bottom3]+y0,yCoords[bottom2]+yCoords[bottom3]-yCoords[bottom1]+y0];
squarex = [xCoords[top1]+x0,xCoords[top2]+x0,xCoords[bottom3]+x0,xCoords[bottom2]+xCoords[bottom3]-xCoords[bottom1]+x0];
	drawPolygon(2,squarex,squarey,"#366");
squarey = [yCoords[top1]+y0,yCoords[top3]+y0,yCoords[bottom2]+y0,yCoords[bottom2]+yCoords[bottom3]-yCoords[bottom1]+y0];
squarex = [xCoords[top1]+x0,xCoords[top3]+x0,xCoords[bottom2]+x0,xCoords[bottom2]+xCoords[bottom3]-xCoords[bottom1]+x0];
	drawPolygon(3,squarex,squarey,"#255");
}
function drawPolygon(index,sqx,sqy,color){ 
	var mypat = "M "+sqx[0]+" "+sqy[0];
	var numbers = [0,1,2,3];
	for (var c=1;c<4;c++) mypat+="  L "+sqx[numbers[c]]+" "+sqy[numbers[c]];
	mypat+=" z";
	if (!cubeside[index]) cubeside[index] = canvas.path().attr({stroke: "none", fill: "#000"});
	cubeside[index].show().attr({ path: mypat, fill: color });
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
    canvas=Raphael(document.getElementById("canvas"),600,300);
    canvas.rect(0, 150, 400, 150).attr({stroke: "none", fill: "none"});
	for (var i=0; i<xCoords.length; i++){ 
		xCoords[i]*=a;
		yCoords[i]*=a;
		zCoords[i]*=a;
		dots[i]=canvas.circle(xCoords[i]+x0,yCoords[i]+y0,dotrad);
		 dots[i].show().attr({fill:"#f00"});
	}
	x0+=300;
	drawCanvas();
    setInterval(update, 100);//цикл ожидания нажатия клавиш и обновления картинки
};
