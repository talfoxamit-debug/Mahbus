// Load the real game script with a canvas/audio mock, then unit-test decideInput.
function mkCtx(){ const grad={addColorStop(){}}; return new Proxy({},{get(t,p){
  if(p==='createLinearGradient'||p==='createRadialGradient')return ()=>grad;
  if(p==='canvas')return {width:960,height:620}; return ()=>{}; },set(){return true;}}); }
const ap=()=>({setValueAtTime(){},exponentialRampToValueAtTime(){},value:0});
function an(){return new Proxy({},{get(t,p){
  if(['gain','frequency','Q','pan','threshold','ratio','knee'].includes(p))return ap();
  if(p==='getChannelData')return ()=>new Float32Array(64); return ()=>an(); },set(){return true;}});}
function AC(){return new Proxy({},{get(t,p){
  if(p==='destination')return an(); if(p==='currentTime')return 0; if(p==='sampleRate')return 44100;
  if(p==='state')return 'running'; if(p==='createBuffer')return ()=>({getChannelData:()=>new Float32Array(64)});
  return ()=>an(); },set(){return true;}});}
global.document={createElement:()=>({width:0,height:0,getContext:mkCtx}),
  getElementById:()=>({style:{},classList:{add(){},remove(){}},getContext:mkCtx,addEventListener(){},textContent:'',offsetHeight:10,offsetWidth:10,clientWidth:960,querySelector:()=>null}),
  addEventListener(){}};
global.window={matchMedia:()=>({matches:false}),addEventListener(){},visualViewport:null,AudioContext:AC,webkitAudioContext:AC,devicePixelRatio:1,innerWidth:960,innerHeight:620,getComputedStyle:()=>({paddingTop:'0',paddingBottom:'0',paddingLeft:'0',paddingRight:'0',display:'block'})};
global.getComputedStyle=global.window.getComputedStyle;
global.navigator={maxTouchPoints:0}; global.requestAnimationFrame=()=>{}; global.performance={now:()=>0};
global.structuredClone=x=>JSON.parse(JSON.stringify(x));

let src=require('fs').readFileSync('/home/user/Mahbus/mahbus.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
// expose the functions we need onto global
src += '\nglobal.decideInput=decideInput; global.pieceMovePreviews=pieceMovePreviews; global.STATE=STATE; global.newBoardX=newBoard;';
eval(src);

function emptyBoard(){const a=[];for(let i=0;i<=24;i++)a.push({top:null,count:0,trapped:null});return a;}
let pass=0,fail=0;
function ok(n,c){ if(c)pass++; else {fail++; console.log('FAIL:',n);} }
const loc = p => ({point:p, tray:false});
const TRAY = {point:-1, tray:true};

// White moves high->low. Dice [6].
function setup(){
  const st={points:emptyBoard(),off:{W:0,B:0},current:'W',
    dicePool:[{v:6,used:false}],phase:'move'};
  st.points[7]={top:'W',count:1,trapped:null};   // a lone White checker
  st.points[1]={top:'W',count:3,trapped:null};   // a White stack (7-6=1 -> legal dest)
  st.points[20]={top:'W',count:1,trapped:null};  // another lone White elsewhere (20-6=14 empty)
  return st;
}

// THE reported case: piece on 7 selected, tap point 1 (own stack, also legal dest 7->1) => MOVE
{ const st=setup();
  const d=decideInput(st, 7, loc(7), loc(1), false);
  ok('selected 7, tap own stack at legal dest 1 => move', d.action==='move' && d.from===7);
}
// tap the selected piece itself => deselect
{ const st=setup();
  const d=decideInput(st, 7, loc(7), loc(7), false);
  ok('tap selected piece => deselect', d.action==='deselect');
}
// nothing selected, tap a movable piece => select
{ const st=setup();
  const d=decideInput(st, null, loc(7), loc(7), false);
  ok('tap movable piece (none selected) => select', d.action==='select' && d.point===7);
}
// selected 7, tap a DIFFERENT own piece that is NOT a legal destination (20) => reselect 20
{ const st=setup();
  const d=decideInput(st, 7, loc(20), loc(20), false);
  ok('tap other own piece, not a dest => select it', d.action==='select' && d.point===20);
}
// selected 20, tap empty legal destination 14 => move
{ const st=setup();
  const d=decideInput(st, 20, loc(14), loc(14), false);
  ok('selected 20, tap empty legal dest 14 => move', d.action==='move' && d.from===20);
}
// drag from movable 7 onto own stack 1 (legal dest) => move
{ const st=setup();
  const d=decideInput(st, null, loc(7), loc(1), true);
  ok('drag 7 -> own stack 1 (legal) => move', d.action==='move' && d.from===7);
}
// tap empty non-destination with nothing selected => deselect/none
{ const st=setup();
  const d=decideInput(st, null, loc(13), loc(13), false);
  ok('tap empty point, none selected => deselect', d.action==='deselect');
}
// selected 7, tap empty NON-destination point (13) that is not reachable => stays? rule: deselect
{ const st=setup();
  const d=decideInput(st, 7, loc(13), loc(13), false);
  ok('selected 7, tap empty non-dest => deselect', d.action==='deselect');
}
// bear-off: all White home, selected 6, tap tray => move off
{ const st={points:emptyBoard(),off:{W:0,B:0},current:'W',dicePool:[{v:6,used:false}],phase:'move'};
  st.points[6]={top:'W',count:2,trapped:null};
  const d=decideInput(st, 6, loc(6), TRAY, false);
  ok('selected 6 all home, tap tray => move off', d.action==='move' && d.from===6);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail?1:0);
