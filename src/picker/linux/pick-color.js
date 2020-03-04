let t
let e
const n=()=>e=e||(()=>t=t||document.createElement("canvas"))().getContext("2d")
const o="little"===(()=>{try{const t=new ArrayBuffer(2)
const e=new Uint8Array(t)
const n=new Uint16Array(t)
e[0]=161
e[1]=178
if(45729===n[0])return"little"
if(41394===n[0])return"big"}catch(t){console.error("[getEndianness]",t)}return"unknown"})()?(t,e,n,o)=>(t<<0)+(e<<8)+(n<<16)+(o<<24):(t,e,n,o)=>(t<<24)+(e<<16)+(n<<8)+(o<<0)
const r=t=>t.length>1?t:`0${t}`
const c=(t,e,n)=>{const o=t-.5*n
const r=t+.5*n
const c=e-.5*n
const s=e+.5*n
return(t,e)=>t===o&&e>=c&&e<=s||t===r&&e>=c&&e<=s||e===c&&t>=o&&t<=r||e===s&&t>=o&&t<=r}
const s=o(0,0,0,0)
const a=o(244,244,244,150)
const i=o(32,32,32,255)
const d=o(255,255,255,255)
const l=({canvas:t,ZOOM:e,GRID_COUNT:o})=>c=>{const s=t.getBoundingClientRect()
const a=(c.clientX-s.left)/s.width*t.width,i=(c.clientY-s.top)/s.height*t.height
const d=Math.round(a-o/2)
const l=Math.round(i-o/2)
const g=t.getContext("2d").getImageData(d,l,o,o)
return{colorHex:((t,e,n)=>{const o=4*(e+n*t.width)
const c=t.data
const s=c[o].toString(16)
const a=c[o+1].toString(16)
const i=c[o+2].toString(16)
return`#${r(s)}${r(a)}${r(i)}`.toUpperCase()})(g,o>>1,o>>1),scaledImageData:((t,e,o=e)=>{const r=t
const c=r.width
const s=new Uint32Array(r.data.buffer)
const a=n().getImageData(0,0,c*e,r.height*o)
const i=a.width
const d=new Uint32Array(a.data.buffer)
const l=i*a.height
for(let t=0;t<l;t++){const n=t%i
const r=Math.floor(t/i)
const a=Math.floor(n/e)+Math.floor(r/o)*c
d[t]=s[a]}return a})(g,e,e)}}
const g=({sourceCanvas:t,pickerCanvasContext:e,pickerDiv:n,colorPre:o,ZOOM:r,GRID_COUNT:g})=>new Promise(u=>{const h=(({ZOOM:t,GRID_COUNT:e})=>{const n=e*t
const o=c(n>>1,n>>1,t)
const r=c(n>>1,n>>1,t+2)
const l=document.createElement("canvas")
l.width=l.height=n
const g=l.getContext("2d").getImageData(0,0,n,n)
const u=new Uint32Array(g.data.buffer)
for(let e=0,c=n*n;e<c;e++){const c=e%n
const l=Math.floor(e/n)
u[e]=c%t==0||l%t==0?a:s
o(c,l)&&(u[e]=i)
r(c,l)&&(u[e]=d)}l.getContext("2d").putImageData(g,0,0)
return l})({ZOOM:r,GRID_COUNT:g})
const m=l({canvas:t,ZOOM:r,GRID_COUNT:g})
let w=null
const O=t=>{w||window.requestAnimationFrame(()=>{(t=>{const{colorHex:r,scaledImageData:c}=m(t)
e.putImageData(c,0,0)
e.drawImage(h,0,0)
const s=n.getBoundingClientRect()
n.style.visibility="visible"
n.style.transform=`translate3d(${Math.round(t.clientX-s.width/2)}px, ${Math.round(t.clientY-s.height/2)}px, 0)`
o.innerHTML=r
C=r})(w)
w=null})
w=t}
let C
t.addEventListener("mousemove",O)
t.addEventListener("click",()=>{t.removeEventListener("mousemove",O)
u(C)})
document.addEventListener("keypress",t=>{"Escape"===t.code&&u("")})})
window.PICK_COLOR=async({IMAGE_DATA_URL:t,ZOOM:e=10,GRID_COUNT:n=17})=>{if(!Number.isInteger(e))throw new Error(`[LOAD_SCREENSHOT] invalid integer ZOOM: ${e}`)
if(!Number.isInteger(n)||n%2!=1)throw new Error(`[LOAD_SCREENSHOT] invalid odd integer GRID_COUNT: ${n}`)
const o=document.getElementById("canvas-source")
const r=await(({imageDataUrl:t})=>new Promise((e,n)=>{const o=document.createElement("img")
o.onerror=n
o.onload=()=>e(o)
o.src=t}))({imageDataUrl:t})
o.width=r.width
o.height=r.height
o.getContext("2d").drawImage(r,0,0)
const c=document.getElementById("div-picker")
const s=document.getElementById("pre-color")
const a=document.getElementById("canvas-picker")
const i=a.getContext("2d")
a.width=a.height=e*n
const d=await g({sourceCanvas:o,pickerCanvasContext:i,pickerDiv:c,colorPre:s,ZOOM:e,GRID_COUNT:n})
return d}
