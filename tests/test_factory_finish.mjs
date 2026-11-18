import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {render,selectedModel} from "../calendar-factory.mjs";
import {enhanceFactorySvg} from "../factory-finish.mjs";
const demo=JSON.parse(readFileSync(new URL("../fixtures/demo-activity.json",import.meta.url),"utf8"));
const account=JSON.parse(readFileSync(new URL("../fixtures/adityasreevatsak-public-activity.json",import.meta.url),"utf8"));
test("every selected-week machine gets matching and distinct stage detail",()=>{
 for(const layout of ["isometric","pixel"])for(const input of [demo,account]){
  const svg=render(input,{layout,selectedWeek:51});
  const source=[...svg.matchAll(/<g class="active" data-repo="[^"]+" data-kind="([^"]+)"/g)].map(m=>m[1]).sort();
  const details=[...svg.matchAll(/data-factory-sprite="([^"]+)"/g)].map(m=>m[1]).sort();
  assert.deepEqual(details,source);
  assert.match(svg,/data-factory-finish="2"/);
 }
});
test("only days with observed production receive conveyor belts",()=>{
 for(const animated of [false,true]){
  const model=selectedModel(demo,51),svg=render(demo,{animated,selectedWeek:51});
  assert.deepEqual([...svg.matchAll(/data-factory-belt="([^"]+)"/g)].map(m=>m[1]).sort(),model.week.days.filter(d=>d.units>0).map(d=>d.date).sort());
  if(animated){assert.match(svg,/@keyframes cfBelt/);assert.match(svg,/prefers-reduced-motion:reduce/);}
  else assert.doesNotMatch(svg,/@keyframes cfBelt/);
 }
 const idle=render(demo,{animated:true,selectedWeek:52});
 assert.doesNotMatch(idle,/data-factory-belt=/);
 assert.doesNotMatch(idle,/data-factory-sprite=/);
});
test("pure finish preserves source identity, standalone SVG and idempotence",()=>{
 const still=render(demo,{layout:"pixel",theme:"light"});
 assert.equal(still,enhanceFactorySvg(still));
 assert.equal(still,render(structuredClone(demo),{layout:"pixel",theme:"light"}));
 assert.match(still,/factoryTitle factoryDesc/);
 assert.match(still,/data-repo="sample-dev\/harbour"/);
 assert.doesNotMatch(still,/<script|<foreignObject|<image\b/);
});
