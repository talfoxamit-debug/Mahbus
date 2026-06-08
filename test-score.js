function mkCtx(){const grad={addColorStop(){}};return new Proxy({},{get(t,p){if(p==='createLinearGradient'||p==='createRadialGradient')return ()=>grad;if(p==='canvas')return {width:960,height:620};return ()=>{};},set(){return true;}});}
const ap=()=>({setValueAtTime(){},exponentialRampToValueAtTime(){},value:0});
function an(){return new Proxy({},{get(t,p){if(['gain','frequency','Q','pan','threshold','ratio','knee'].includes(p))return ap();if(p==='getChannelData')return ()=>new Float32Array(64);return ()=>an();},set(){return true;}});}
function AC(){return new Proxy({},{get(t,p){if(p==='destination')return an();if(p==='currentTime')return 0;if(p==='sampleRate')return 44100;if(p==='state')return 'running';if(p==='createBuffer')return ()=>({getChannelData:()=>new Float32Array(64)});return ()=>an();},set(){return true;}});}
// localStorage mock
const LS={}; global.localStorage={getItem:k=>k in LS?LS[k]:null,setItem:(k,v)=>{LS[k]=String(v);},removeItem:k=>{delete LS[k];}};
global.document={createElement:()=>({width:0,height:0,getContext:mkCtx}),getElementById:()=>({style:{},classList:{add(){},remove(){}},getContext:mkCtx,addEventListener(){},textContent:'',innerHTML:'',offsetHeight:10,offsetWidth:10,clientWidth:960,querySelector:()=>null}),addEventListener(){}};
global.window={matchMedia:()=>({matches:false}),addEventListener(){},visualViewport:null,AudioContext:AC,webkitAudioContext:AC,devicePixelRatio:1,innerWidth:960,innerHeight:620,getComputedStyle:()=>({paddingTop:'0',paddingBottom:'0',paddingLeft:'0',paddingRight:'0',display:'block'})};
global.getComputedStyle=global.window.getComputedStyle;global.navigator={maxTouchPoints:0};global.requestAnimationFrame=()=>{};global.performance={now:()=>Date.now()};global.structuredClone=x=>JSON.parse(JSON.stringify(x));
let src=require('fs').readFileSync('/home/user/Mahbus/mahbus.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
src+='\nglobal.recordWin=recordWin;global.loadScore=loadScore;global.resetScore=resetScore;global.getSCORE=()=>SCORE;global.setSTATE=s=>{STATE=s;};';
eval(src);
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log('FAIL:',n));};

// vs AI: human (White) wins => you++
setSTATE({mode:'ai',winner:'W'}); recordWin();
ok('AI human win => you=1', getSCORE().you===1 && getSCORE().computer===0);
// vs AI: computer (Black) wins => computer++
setSTATE({mode:'ai',winner:'B'}); recordWin();
ok('AI computer win => computer=1', getSCORE().computer===1);
// hotseat: white win
setSTATE({mode:'hotseat',winner:'W'}); recordWin();
ok('hotseat white win => white=1', getSCORE().white===1);
// hotseat: black win
setSTATE({mode:'hotseat',winner:'B'}); recordWin();
ok('hotseat black win => black=1', getSCORE().black===1);
// persisted to localStorage
ok('persisted to localStorage', JSON.parse(localStorage.getItem('mahbus_score')).you===1);
// reload picks it up
eval(src); loadScore();
ok('loadScore restores you=1', getSCORE().you===1 && getSCORE().black===1);
// reset clears
resetScore(); ok('reset clears', getSCORE().you===0 && getSCORE().computer===0 && getSCORE().white===0 && getSCORE().black===0);

console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail?1:0);
