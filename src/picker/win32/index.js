var e=require("path")
var r=require("child_process")
exports.runColorPicker=()=>new Promise((o,i)=>(0,r.execFile)((0,e.join)(__dirname,"ColorPicker32.exe"),(e,r,s)=>{if(e)return i(e)
o({possibleColorString:r})}))
