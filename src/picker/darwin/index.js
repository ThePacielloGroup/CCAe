var e=require("path")
var r=require("child_process")
exports.runColorPicker=()=>new Promise((o,i)=>(0,r.execFile)((0,e.join)(__dirname,"ColorPicker.app"),(e,r,t)=>{if(e)return i(e)
o({possibleColorString:r})}))
