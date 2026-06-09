function mkCtx(){const grad={addColorStop(){}};return new Proxy({},{get(t,p){if(p==='createLinearGradient'||p==='createRadialGradient')return ()=>grad;if(p==='canvas')return {width:960,height:620};return ()=>{};},set(){return true;}});}
const ap=()=>({setValueAtTime(){},exponentialRampToValueAtTime(){},value:0});
function an(){return new Proxy({},{get(t,p){if(['gain','frequency','Q','pan','threshold','ratio','knee'].includes(p))return ap();if(p==='getChannelData')return ()=>new Float32Array(64);return ()=>an();},set(){return true;}});}
function AC(){return new Proxy({},{get(t,p){if(p==='destination')return an();if(p==='currentTime')return 0;if(p==='sampleRate')return 44100;if(p==='state')return 'running';if(p==='createBuffer')return ()=>({getChannelData:()=>new Float32Array(64)});return ()=>an();},set(){return true;}});}
global.document={createElement:()=>({width:0,height:0,getContext:mkCtx}),getElementById:()=>({style:{},classList:{add(){},remove(){}},getContext:mkCtx,addEventListener(){},textContent:'',innerHTML:'',offsetHeight:10,offsetWidth:10,clientWidth:960,querySelector:()=>null}),addEventListener(){}};
global.window={matchMedia:()=>({matches:false}),addEventListener(){},visualViewport:null,AudioContext:AC,webkitAudioContext:AC,devicePixelRatio:1,innerWidth:960,innerHeight:620,getComputedStyle:()=>({paddingTop:'0',paddingBottom:'0',paddingLeft:'0',paddingRight:'0',display:'block'})};
global.getComputedStyle=global.window.getComputedStyle;global.navigator={maxTouchPoints:0};global.requestAnimationFrame=()=>{};global.performance={now:()=>Date.now()};global.structuredClone=x=>JSON.parse(JSON.stringify(x));global.localStorage={getItem:()=>null,setItem:()=>{}};
let src=require('fs').readFileSync('/home/user/Mahbus/mahbus.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1];
src+='\nglobal.applyMove=applyMove;global.legalMoves=legalMoves;global.opp=opp;';
eval(src);
function empty(){const a=[];for(let i=0;i<=24;i++)a.push({top:null,count:0,trapped:null});return a;}
let pass=0,fail=0;const ok=(n,c)=>{c?pass++:(fail++,console.log("FAIL:",n));};

// NORMAL win: White bears off last, Black already has 1 off => normal, 1 pt
{ const st={points:empty(),off:{W:14,B:1},current:'W',dicePool:[{v:1,used:false}],phase:'move',winner:null};
  st.points[1]={top:'W',count:1,trapped:null};
  applyMove(st,{from:1,to:'off',die:1});
  ok('normal win type', st.phase==='over'&&st.winner==='W'&&st.winType==='normal'&&st.winPoints===1);
}
// MARS: White bears off all 15, Black has 0 off => mars, 2 pts
{ const st={points:empty(),off:{W:14,B:0},current:'W',dicePool:[{v:1,used:false}],phase:'move',winner:null};
  st.points[1]={top:'W',count:1,trapped:null};
  applyMove(st,{from:1,to:'off',die:1});
  ok('mars win type', st.phase==='over'&&st.winner==='W'&&st.winType==='mars'&&st.winPoints===2);
}
// KAPUT: White pins Black's mother on Black's start (point 1) before it left. White's mother already left start (24 empty of W).
{ const st={points:empty(),off:{W:0,B:0},current:'W',dicePool:[{v:6,used:false}],phase:'move',winner:null};
  st.points[1]={top:'B',count:1,trapped:null};   // Black's lone mother on its start
  st.points[7]={top:'W',count:1,trapped:null};   // White lands 7->1
  // White's own start (24) has no White (mother already left) => not waived
  applyMove(st,{from:7,to:1,die:6});
  ok('kaput win type', st.phase==='over'&&st.winner==='W'&&st.winType==='kaput'&&st.winPoints===3);
  ok('kaput pinned the mother', st.points[1].trapped==='B'&&st.points[1].top==='W');
}
// KAPUT WAIVED: White pins Black's mother but White still has its OWN mother home (24) => NOT kaput, game continues
{ const st={points:empty(),off:{W:0,B:0},current:'W',dicePool:[{v:6,used:false}],phase:'move',winner:null};
  st.points[1]={top:'B',count:1,trapped:null};
  st.points[7]={top:'W',count:1,trapped:null};
  st.points[24]={top:'W',count:5,trapped:null}; // White's mother still home -> waived
  applyMove(st,{from:7,to:1,die:6});
  ok('kaput waived when pinner mother still home', st.phase!=='over');
}
// TIE: both mothers pinned. White's mother (24) already pinned by Black; now White pins Black's mother (1) -> tie
{ const st={points:empty(),off:{W:0,B:0},current:'W',dicePool:[{v:6,used:false}],phase:'move',winner:null};
  st.points[24]={top:'B',count:1,trapped:'W'};  // White's mother imprisoned at its own start by Black
  st.points[1]={top:'B',count:1,trapped:null};  // Black's mother lone on its start
  st.points[7]={top:'W',count:1,trapped:null};
  applyMove(st,{from:7,to:1,die:6});
  ok('tie when both mothers pinned', st.phase==='over'&&st.winner===null&&st.winType==='tie'&&st.winPoints===0);
}
// NOT kaput: pinning a non-mother (a checker not on the start point) is a normal trap, no game end
{ const st={points:empty(),off:{W:0,B:0},current:'W',dicePool:[{v:3,used:false}],phase:'move',winner:null};
  st.points[10]={top:'B',count:1,trapped:null};
  st.points[13]={top:'W',count:1,trapped:null};
  applyMove(st,{from:13,to:10,die:3});
  ok('pinning non-mother is not kaput', st.phase!=='over' && st.points[10].trapped==='B');
}
// Black kaput on White's start (24): Black pins White's mother at 24 before it leaves
{ const st={points:empty(),off:{W:0,B:0},current:'B',dicePool:[{v:6,used:false}],phase:'move',winner:null};
  st.points[24]={top:'W',count:1,trapped:null}; // White mother on start
  st.points[18]={top:'B',count:1,trapped:null}; // Black 18->24
  applyMove(st,{from:18,to:24,die:6});
  ok('black kaput on White start', st.phase==='over'&&st.winner==='B'&&st.winType==='kaput'&&st.winPoints===3);
}
console.log(`\n${pass} passed, ${fail} failed`); process.exit(fail?1:0);
