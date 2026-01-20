export class PoseEstimator{
constructor(){this.last=null;this.s=0.85;}
smoothBox(b){
if(!this.last){this.last=b;return b;}
const l=(a,c)=>a*this.s+c*(1-this.s);
const o={
x:l(this.last.x,b.x),
y:l(this.last.y,b.y),
width:l(this.last.width,b.width),
height:l(this.last.height,b.height)
};
this.last=o;return o;
}
}
