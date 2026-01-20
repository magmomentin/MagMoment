export class GLRenderer{
 constructor(c,v){this.g=c.getContext("webgl"); this.v=v; this.i();}
 i(){const g=this.g;
 const vs='attribute vec2 a;varying vec2 v;void main(){gl_Position=vec4(a,0,1);v=(a+1.)/2.;}';
 const fs='precision mediump float;varying vec2 v;uniform sampler2D t;void main(){gl_FragColor=texture2D(t,v);}';
 const c=(t,s)=>{const sh=g.createShader(t);g.shaderSource(sh,s);g.compileShader(sh);return sh};
 const p=g.createProgram(); g.attachShader(p,c(g.VERTEX_SHADER,vs));
 g.attachShader(p,c(g.FRAGMENT_SHADER,fs)); g.linkProgram(p); g.useProgram(p);
 this.p=p; this.b=g.createBuffer(); this.t=g.createTexture();
 g.bindTexture(g.TEXTURE_2D,this.t); g.texParameteri(g.TEXTURE_2D,g.TEXTURE_MIN_FILTER,g.LINEAR);}
 draw(c){const g=this.g; const f=([x,y])=>[(x/g.canvas.width)*2-1,1-(y/g.canvas.height)*2];
 const p=c.flatMap(f); g.bindBuffer(g.ARRAY_BUFFER,this.b);
 g.bufferData(g.ARRAY_BUFFER,new Float32Array(p),g.STATIC_DRAW);
 const l=g.getAttribLocation(this.p,"a"); g.enableVertexAttribArray(l);
 g.vertexAttribPointer(l,2,g.FLOAT,false,0,0);
 g.bindTexture(g.TEXTURE_2D,this.t);
 g.texImage2D(g.TEXTURE_2D,0,g.RGBA,g.RGBA,g.UNSIGNED_BYTE,this.v);
 g.drawArrays(g.TRIANGLE_STRIP,0,4);}
}