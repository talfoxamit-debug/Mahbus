function mkCtx(){const grad={addColorStop(){}};return new Proxy({},{get(t,p){if(p==='createLinearGradient'||p==='createRadialGradient')return ()=>grad;if(p==='canvas')return {width:960,height:620};return ()=>{};},set(){return true;}});}
const ap=()=>({setValueAtTime(){},exponentialRampToValueAtTime(){},value:0});
function an(){return new Proxy({},{get(t,p){if(['gain','frequency','Q','pan','threshold','ratio','knee'].includes(p))return ap();if(p==='getChannelData')return ()=>new Float32Array(64);return ()=>an();},set(){return true;}});}
function AC(){return new Proxy({},{get(t,p){if(p==='destination')return an();if(p==='currentTime')return 0;if(p==='sampleRate')return 44100;if(p==='state')return 'running';if(p==='createBuffer')return ()=>({getChannelData:()=>new Float32Array(64)});return ()=>an();},set(){return true;}});}
global.document={createElement:()=>({width:0,height:0,getContext:mkCtx}),getElementById:()=>({style:{},classList:{add(){},remove(){}},getContext:mkCtx,addEventListener(){},textContent:'',innerHTML:'',offsetHeight:10,offsetWidth:10,clientWidth:960,querySelector:()=>null}),addEventListener(){}};
global.window={matchMedia:()=>({matches:false}),addEventListener(){},visualViewport:null,AudioContext:AC,webkitAudioContext:AC,devicePixelRatio:1,innerWidth:960,innerHeight:620,getComputedStyle:()=>({paddingTop:'0',paddingBottom:'0',paddingLeft:'0',paddingRight:'0',display:'block'})};
global.getComputedStyle=global.window.getComputedStyle;global.navigator={maxTouchPoints:0};global.requestAnimationFrame=()=>{};global.performance={now:()=>Date.now()};global.structuredClone=x=>JSON.parse(JSON.stringify(x));global.localStorage={getItem:()=>null,setItem:()=>{}};
let src=require('fs').readFileSync('/home/user/Mahbus/mahbus.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
src+='\nglobal.hardSequence=hardSequence;global.legalMoves=legalMoves;global.setDL=()=>{AI_DEADLINE=Date.now()+2500;};';
eval(src);
function empty(){const a=[];for(let i=0;i<=24;i++)a.push({top:null,count:0,trapped:null});return a;}
let max=0,over=0,stuck=0;
for(let trial=0; trial<1500; trial++){
  const st={points:empty(),off:{W:0,B:0},current:'B',phase:'move',dicePool:[]};
  const v1=1+(Math.random()*6|0),v2=1+(Math.random()*6|0);
  st.dicePool=(v1===v2)?[v1,v1,v1,v1].map(v=>({v,used:false})):[{v:v1,used:false},{v:v2,used:false}];
  let b=0;const pts=[];while(pts.length<11){const i=2+(Math.random()*18|0);if(!pts.includes(i))pts.push(i);}
  for(const i of pts){if(b>=15)break;const c=Math.min(15-b,1+(Math.random()*2|0));st.points[i]={top:'B',count:c,trapped:null};b+=c;}
  st.points[20]={top:'W',count:1,trapped:null};st.points[21]={top:'W',count:1,trapped:null};st.points[19]={top:'W',count:1,trapped:null};
  setDL();
  const t0=Date.now();const seq=hardSequence(st);const dt=Date.now()-t0;
  if(dt>max)max=dt; if(dt>3000)over++;
  if(legalMoves(st,'B').length>0&&(!seq||seq.length===0))stuck++;
}
console.log(`1500 hard turns @2500ms budget: max=${max}ms, over-3000ms=${over}, empty-with-legal-moves=${stuck}`);
