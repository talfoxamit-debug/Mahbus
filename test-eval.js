function mkCtx(){const grad={addColorStop(){}};return new Proxy({},{get(t,p){if(p==='createLinearGradient'||p==='createRadialGradient')return ()=>grad;if(p==='canvas')return {width:960,height:620};return ()=>{};},set(){return true;}});}
const ap=()=>({setValueAtTime(){},exponentialRampToValueAtTime(){},value:0});
function an(){return new Proxy({},{get(t,p){if(['gain','frequency','Q','pan','threshold','ratio','knee'].includes(p))return ap();if(p==='getChannelData')return ()=>new Float32Array(64);return ()=>an();},set(){return true;}});}
function AC(){return new Proxy({},{get(t,p){if(p==='destination')return an();if(p==='currentTime')return 0;if(p==='sampleRate')return 44100;if(p==='state')return 'running';if(p==='createBuffer')return ()=>({getChannelData:()=>new Float32Array(64)});return ()=>an();},set(){return true;}});}
global.document={createElement:()=>({width:0,height:0,getContext:mkCtx}),getElementById:()=>({style:{},classList:{add(){},remove(){}},getContext:mkCtx,addEventListener(){},textContent:'',innerHTML:'',offsetHeight:10,offsetWidth:10,clientWidth:960,querySelector:()=>null}),addEventListener(){}};
global.window={matchMedia:()=>({matches:false}),addEventListener(){},visualViewport:null,AudioContext:AC,webkitAudioContext:AC,devicePixelRatio:1,innerWidth:960,innerHeight:620,getComputedStyle:()=>({paddingTop:'0',paddingBottom:'0',paddingLeft:'0',paddingRight:'0',display:'block'})};
global.getComputedStyle=global.window.getComputedStyle;global.navigator={maxTouchPoints:0};global.requestAnimationFrame=()=>{};global.performance={now:()=>Date.now()};global.structuredClone=x=>JSON.parse(JSON.stringify(x));global.localStorage={getItem:()=>null,setItem:()=>{}};
let src=require('fs').readFileSync('/home/user/Mahbus/mahbus.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
src+='\nglobal.scoreFor=scoreFor;';eval(src);
function empty(){const a=[];for(let i=0;i<=24;i++)a.push({top:null,count:0,trapped:null});return a;}
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log("FAIL:",n));};

{ const wall=empty();[4,5,6,7].forEach(i=>wall[i]={top:'B',count:2,trapped:null});
  const blots=empty();[4,5,6,7,10,11,12,13].forEach(i=>blots[i]={top:'B',count:1,trapped:null});
  ok('prime wall > spread blots', scoreFor({points:wall,off:{W:0,B:0}},'B')>scoreFor({points:blots,off:{W:0,B:0}},'B')); }
// Holding a White prisoner FAR from White's home (high i) > near White's home (low i)
{ const far=empty(); far[22]={top:'B',count:1,trapped:'W'};
  const near=empty(); near[2]={top:'B',count:1,trapped:'W'};
  ok('White prisoner far from home (i=22) > near home (i=2)',
     scoreFor({points:far,off:{W:0,B:0}},'B') > scoreFor({points:near,off:{W:0,B:0}},'B')); }
{ const home=empty();[19,20,21].forEach(i=>home[i]={top:'B',count:2,trapped:null});
  const out=empty();[10,11,12].forEach(i=>out[i]={top:'B',count:2,trapped:null});
  ok('home-board points > outside points', scoreFor({points:home,off:{W:0,B:0}},'B')>scoreFor({points:out,off:{W:0,B:0}},'B')); }
{ const off=empty(); off[24]={top:'B',count:5,trapped:null};
  ok('bearing off raises score', scoreFor({points:off,off:{W:0,B:5}},'B')>scoreFor({points:off,off:{W:0,B:0}},'B')); }
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail?1:0);
