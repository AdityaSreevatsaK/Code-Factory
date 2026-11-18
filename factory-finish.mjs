// Pure, browser-safe, deterministic factory detailing. No synthetic events or machines.
export function enhanceFactorySvg(svg){
  if(typeof svg!=="string"||!svg.startsWith("<svg "))throw Error("Expected a standalone factory SVG");
  if(svg.includes('data-factory-finish="2"'))return svg;
  const dark=svg.includes('fill="#071923"'),metal=dark?"#557c8e":"#90b3b7",rim=dark?"#91b3b6":"#6e969a",ink=dark?"#fbefd9":"#29454b",low=dark?"#06121d":"#53716f",accent=dark?"#f3bf7a":"#b8814e";
  const tones={commit:"#63d9bc",pr_opened:"#90b6ff",pr_merged:"#ffc27f",issue_opened:"#ff98a7",release:"#c8adff"};
  const peak=Math.max(1,...[...svg.matchAll(/data-cell-date="[^"]+" data-intensity="\d+" data-units="(\d+)"/g)].map(m=>Number(m[1])));
  const rect=(x,y,w,h,c,extra="")=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}" ${extra}/>`;
  const path=(d,stroke,width=2,extra="")=>`<path d="${d}" fill="none" stroke="${stroke}" stroke-width="${width}" ${extra}/>`;
  const circ=(x,y,r,fill,extra="")=>`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" ${extra}/>`;
  function sprite(x,y,kind,layout,units){
    const tone=tones[kind];if(!tone)throw Error("Unknown machine kind");
    const strength=Math.min(5,Math.max(1,1+Math.floor(4*Math.log(Number(units))/Math.log(Math.max(2,peak)))));
    const stage=[];
    if(kind==="commit")stage.push(rect(x-16,y-7,27,18,low,'rx="3"'),rect(x-12,y-5,19,14,tone,'rx="2" class="cf-energy"'),rect(x-9,y-2,13,8,low),rect(x-20,y-12,5,14,metal),rect(x-20,y-16,9,4,rim),path(`M${x-6} ${y-9}v-6m6 6v-8`,accent,2,'stroke-linecap="round" class="cf-steam"'));
    else if(kind==="pr_opened")stage.push(circ(x-8,y+4,7,low,`stroke="${rim}" stroke-width="2"`),path(`M${x-8} ${y+4}L${x+1} ${y-11}L${x+15} ${y-7}`,tone,5,'stroke-linejoin="round"'),circ(x+1,y-11,4,accent),circ(x+15,y-7,4,metal),path(`M${x+15} ${y-7}v11m-6 -4l6 5 6 -5`,rim,2,'class="cf-grip"'));
    else if(kind==="pr_merged")stage.push(rect(x-15,y-13,5,28,metal),rect(x+11,y-13,5,28,metal),rect(x-17,y-15,35,5,tone),rect(x-8,y-10,16,14,low,'rx="1"'),rect(x-11,y+2,23,5,accent,'class="cf-press"'),rect(x-16,y+9,33,5,tone),circ(x-12,y-13,1.6,ink),circ(x+12,y-13,1.6,ink));
    else if(kind==="issue_opened")stage.push(circ(x,y-4,13,low,`stroke="${tone}" stroke-width="3"`),circ(x,y-4,7,metal,'opacity=".65"'),path(`M${x-7} ${y-4}h14m-7 -7v14`,ink,1.4,'opacity=".9"'),path(`M${x+9} ${y+5}l10 10`,rim,5,'stroke-linecap="round"'),rect(x-19,y+10,11,4,accent,'class="cf-energy"'));
    else if(kind==="release")stage.push(rect(x-19,y-14,5,31,metal),rect(x-18,y-15,38,4,tone),path(`M${x+13} ${y-11}v10`,rim,3),path(`M${x+9} ${y-1}q4 7 8 0`,accent,2),rect(x+2,y+9,22,15,tone,'rx="1" class="cf-crate"'),path(`M${x+13} ${y+9}v15m-11 -8h22`,low,2));
    const base=layout==="isometric"?`<path d="M${x-23} ${y+19}l24 -8 25 9 -24 8z" fill="${metal}" stroke="${rim}" stroke-width="1.3"/>`:rect(x-25,y+18,52,9,metal,'shape-rendering="crispEdges"');
    const gear=`<g class="cf-gear" style="transform-origin:${x+20}px ${y+15}px">${circ(x+20,y+15,6,low,`stroke="${rim}" stroke-width="2"`)}${path(`M${x+20} ${y+10}v10m-5 -5h10`,tone,1.6)}</g>`;
    const lamps=Array.from({length:5},(_,i)=>rect(x-19+i*8,y+27,5,3,i<strength?tone:metal,'rx="1"')).join("");
    return `<g data-factory-sprite="${kind}" data-factory-level="${strength}">${base}<g class="cf-stage cf-${kind}">${stage.join("")}</g>${gear}${lamps}</g>`;
  }
  let lane=0;
  svg=svg.replace(/(<g data-load-date="([^"]+)" data-load-level="(\d+)">[\s\S]*?<\/g>)/g,(whole,base,date,tier)=>{
    const x=41+lane++*160,level=Number(tier);if(!level)return base;
    const top=374,rail=rect(x+17,top,122,9,low,'rx="2" opacity=".75"'),dash=path(`M${x+21} ${top+2}H${x+135}`,accent,2,'stroke-dasharray="5 6" class="cf-belt-dashes"');
    const wheels=[x+29,x+78,x+127].map(cx=>circ(cx,top+9,3,metal,`stroke="${rim}" stroke-width="1"`)).join("");
    return base+`<g data-factory-belt="${date}" data-belt-level="${level}">${rail}${dash}${wheels}</g>`;
  });
  if(lane!==7)throw Error("Factory artwork requires seven daily workshop lanes");
  const dayOffsets=[...svg.matchAll(/<g data-day="\d{4}-\d{2}-\d{2}">/g)].map(m=>m.index);
  if(dayOffsets.length!==7)throw Error("Factory artwork requires seven source-backed days");
  const activePattern=/(<g class="active" data-repo="([^"]+)" data-kind="([^"]+)" data-records="(\d+)" data-units="(\d+)"><g class="machine (isometric|pixel)"(?: shape-rendering="crispEdges")?><g class="machine-part">)([\s\S]*?)(<\/g>)(?=<text x)/g;
  const active=[...svg.matchAll(activePattern)];
  const dayFor=offset=>{let day=-1;for(let i=0;i<dayOffsets.length;i++)if(offset>dayOffsets[i])day=i;return day;};
  const byDay=Array(7).fill(0);
  for(const m of active){const day=dayFor(m.index);if(day<0)throw Error("Machine outside a day");byDay[day]++;}
  const current=Array(7).fill(0);let installed=0;
  svg=svg.replace(activePattern,(all,prefix,repo,kind,records,units,layout,part,close,offset)=>{
    const day=dayFor(offset),ordinal=current[day]++;
    if(byDay[day]>2)throw Error("More than two machines in one day");
    const laneX=41+day*160,x=byDay[day]===1?laneX+79:laneX+(ordinal===0?43:110);
    installed++;return prefix+part+sprite(x,312,kind,layout,units)+close;
  });
  if(installed!==active.length)throw Error("Not all source machines were decorated");
  svg=svg.replace(/(<path d="M[\d.]+ 203V215H595V221" fill="none")/,'$1 class="cf-power-feed"');
  if(svg.includes("<animateMotion")){
    const css=`@keyframes cfBelt{to{stroke-dashoffset:-22}}@keyframes cfTurn{to{transform:rotate(360deg)}}@keyframes cfGlow{50%{opacity:.36}}@keyframes cfPump{50%{transform:translateY(3px)}}@keyframes cfPower{to{stroke-dashoffset:-32}}.cf-belt-dashes{animation:cfBelt .75s linear infinite}.cf-gear{animation:cfTurn 2.8s linear infinite}.cf-energy,.cf-steam{animation:cfGlow 1.3s ease-in-out infinite}.cf-press,.cf-grip,.cf-crate{animation:cfPump 1.6s ease-in-out infinite}.cf-power-feed{animation:cfPower 1.5s linear infinite}@media(prefers-reduced-motion:reduce){.cf-belt-dashes,.cf-gear,.cf-energy,.cf-steam,.cf-press,.cf-grip,.cf-crate,.cf-power-feed{animation:none!important}}`;
    svg=svg.replace("</style>",css+"</style>");
  }
  return svg.replace('role="img" aria-labelledby=', 'data-factory-finish="2" role="img" aria-labelledby=');
}
