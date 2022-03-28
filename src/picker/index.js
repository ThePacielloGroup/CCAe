const r=()=>{throw new Error(`[electron-color-picker] unsupported ${process.platform}-${process.arch}`)}
const e=(()=>{try{const{runColorPicker:r}=require(`./${process.platform}`)
return r}catch(r){}return r})()
const o=/#[A-F0-9]{6}/
let t=!1
exports.getColorFromPickerAddOn=async()=>{if(t)throw new Error("color picker already running!")
t=!0
const{possibleColorString:r}=await e()
t=!1
const[s]=o.exec(r.toUpperCase())||[""]
return s}
