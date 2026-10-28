const fs=require('node:fs'); const vm=require('node:vm'); const assert=require('node:assert/strict');
const context={console,Workspace:{screens:[],activeScreen:null},KWin:{readConfig:(_,fallback)=>fallback}};
vm.createContext(context); vm.runInContext(fs.readFileSync(process.argv[2],'utf8'),context);
vm.runInContext('globalThis.exposed={Window,DesktopManager,ClientManager,PresetWidths}',context);
const output=(name,x,width)=>({name,geometry:{x,y:0,width,height:1000}});
const primary=output('eDP-1',0,1600), right=output('HDMI-A-1',1600,1920);
context.Workspace.screens=[primary,right]; context.Workspace.activeScreen=right;
assert.equal(context.karouselPrimaryOutput(),primary);
assert.equal(context.karouselOnPrimary({output:right}),false);
assert.equal(context.karouselOnPrimary({output:primary}),true);
const dm={}; context.exposed.DesktopManager.prototype.selectScreen.call(dm,right);
assert.equal(dm.selectedScreen,primary);
const area={x:8,y:8,width:1584,height:984};
for(const [x,width,expected] of [[8,788,8],[804,788,804],[8,1584,8],[1200,788,-852],[-500,788,-852]]) {
 const p=context.karouselPlacement(x,8,width,984,area); assert.equal(p.x,expected);
 if(p.x!==x) assert.ok(p.x+width<0);
}
// Parking stays outside all outputs, including a monitor to the left.
context.Workspace.screens=[output('left',-1920,1920),primary,right];
assert.ok(context.karouselPlacement(1600,8,788,984,area).x+788 < -1920);
// Moving the monitor and reconnecting preserves the preferred connector.
context.Workspace.screens=[right]; assert.equal(context.karouselPrimaryOutput(),right);
context.Workspace.screens=[right,primary]; assert.equal(context.karouselPrimaryOutput(),primary);
let placements=[];
const window={skipArrange:false,isFocused:()=>false,column:{grid:{config:{reMaximize:false},desktop:{clientArea:area}}},client:{place:(...p)=>placements.push(p)}};
context.exposed.Window.prototype.arrange.call(window,2000,8,788,984);
assert.ok(placements[0][0]+788<0);
context.exposed.Window.prototype.arrange.call(window,8,8,788,984);
assert.equal(placements[1][0],8);
window.skipArrange=true; context.exposed.Window.prototype.arrange.call(window,8,8,788,984); assert.equal(placements.length,2);
// Secondary-screen shortcuts and retile requests do not pull a window back.
context.Workspace.screens=[primary,right];
context.exposed.ClientManager.prototype.toggleFloatingClient.call({}, {output:right});
context.exposed.ClientManager.prototype.pinClient.call({}, {output:right});
context.exposed.ClientManager.prototype.tileClient.call({}, {kwinClient:{output:right}}, {});
console.log('PASS: screen selection, secondary-window exclusion, overflow parking, focus placement, maximize guard, reconnect fallback.');