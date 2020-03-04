var e=require("fs")
var r=require("url")
var t=require("path")
var n=require("child_process")
var i=require("util")
var a=require("electron")
var o=require("./linux-scrot")
const s=(0,i.promisify)(n.exec)
const c=async()=>{const r=(0,t.join)(a.app.getPath("temp"),"temp-screenshot.png")
await(async e=>{try{return await s(`gnome-screenshot --file ${e}`,{shell:!0})}catch(e){}try{return await s(`import -window root ${e}`,{shell:!0})}catch(e){}await(0,o.runLinuxSCROT)(e)})(r)
const n=await((r,t="image/png")=>((e,r)=>`data:${r};base64,${e.toString("base64")}`)((0,e.readFileSync)(r),t))(r);(0,e.unlinkSync)(r)
return n}
const l=async({imageDataUrl:e})=>{const{width:n,height:i}=a.screen.getPrimaryDisplay().bounds
if(!n||!i)throw new Error(`[pickColorWithBrowserWindow] invalid display bounds: ${JSON.stringify({width:n,height:i})}`)
const o=new a.BrowserWindow({width:n,height:i,frame:!1,resizable:!1,scrollable:!1,fullscreen:!0,alwaysOnTop:!0,enableLargerThanScreen:!0,titleBarStyle:"hidden"})
o.webContents.loadURL(((...e)=>(0,r.format)({pathname:(0,t.join)(...e),protocol:"file",slashes:!0}))(__dirname,"pick-color.html"))
const s=await new Promise(r=>{o.on("closed",()=>{r("")})
o.webContents.on("before-input-event",(e,t)=>{if("Escape"===t.key){e.preventDefault()
r("")}})
o.webContents.executeJavaScript(`window.PICK_COLOR({ IMAGE_DATA_URL: ${JSON.stringify(e)}, ZOOM: 10, GRID_COUNT: 17 })`).then(r)})
o.close()
return s}
exports.runColorPicker=async()=>{const e=await c()
return{possibleColorString:await l({imageDataUrl:e})}}
