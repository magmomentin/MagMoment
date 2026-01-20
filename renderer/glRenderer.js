export class GLRenderer {
  constructor(canvas, video) {
    this.gl = canvas.getContext("webgl");
    if (!this.gl) throw new Error("WebGL not supported");
    this.video = video;
    this.init();
  }

  init() {
    const gl = this.gl;

    const vs = `attribute vec2 a; varying vec2 v;
      void main(){ gl_Position=vec4(a,0.,1.); v=(a+1.)*0.5; }`;

    const fs = `precision mediump float; varying vec2 v;
      uniform sampler2D t;
      void main(){ gl_FragColor=texture2D(t,v); }`;

    const c = (t,s) => {
      const sh = gl.createShader(t);
      gl.shaderSource(sh,s);
      gl.compileShader(sh);
      return sh;
    };

    const p = gl.createProgram();
    gl.attachShader(p, c(gl.VERTEX_SHADER, vs));
    gl.attachShader(p, c(gl.FRAGMENT_SHADER, fs));
    gl.linkProgram(p);
    gl.useProgram(p);

    this.p = p;
    this.b = gl.createBuffer();
    this.t = gl.createTexture();

    gl.bindTexture(gl.TEXTURE_2D, this.t);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  }

  draw(cs) {
    if (this.video.readyState < 2) return;

    const gl = this.gl;
    gl.viewport(0,0,gl.canvas.width,gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const f = ([x,y]) => [
      (x/gl.canvas.width)*2 - 1,
      1 - (y/gl.canvas.height)*2
    ];

    const pts = cs.flatMap(f);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pts), gl.DYNAMIC_DRAW);

    const loc = gl.getAttribLocation(this.p,"a");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);

    gl.bindTexture(gl.TEXTURE_2D,this.t);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL,true);
    gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,gl.RGBA,gl.UNSIGNED_BYTE,this.video);

    gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
  }

  clear() {
    const gl = this.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);
  }
}
