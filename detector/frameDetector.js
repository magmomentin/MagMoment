import{FRAMES}from"../data/frames.js";

export class FrameDetector{
constructor(id){
this.frame=FRAMES.find(f=>f.id===id);
this.canvas=document.createElement("canvas");
this.ctx=this.canvas.getContext("2d",{willReadFrequently:true});
this.hits=0;
}
detect(video){
const vw=video.videoWidth,vh=video.videoHeight;
if(!vw||!vh)return null;

this.canvas.width=160;
this.canvas.height=120;
this.ctx.drawImage(video,0,0,160,120);

const d=this.ctx.getImageData(0,0,160,120).data;
let e=0;
for(let i=4;i<d.length-4;i+=4)
e+=Math.abs(d[i]-d[i+4]);

if (e < 150000) { this.hits = 0; return null; }
this.hits++;
if(this.hits<4)return null;

const h=vh*0.6,w=h*this.frame.aspect;
return{x:(vw-w)/2,y:(vh-h)/2,width:w,height:h};
}
}
