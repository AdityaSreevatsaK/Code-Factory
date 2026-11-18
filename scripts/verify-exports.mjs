import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { render } from "../calendar-factory.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const demo = JSON.parse(readFileSync(resolve(root, "fixtures/demo-activity.json"), "utf8"));
const personal = JSON.parse(readFileSync(resolve(root, "fixtures/adityasreevatsak-public-activity.json"), "utf8"));
const expected = [];
for (const layout of ["isometric", "pixel"]) {
  for (const theme of ["dark", "light"]) {
    for (const animated of [false, true]) {
      expected.push({
        name: `${layout}-${theme}${animated ? "" : "-still"}.svg`,
        input: demo, options: {layout, theme, animated}
      });
    }
  }
}
expected.push(
  {name:"isometric-light-release-week-still.svg",input:demo,options:{layout:"isometric",theme:"light",selectedWeek:48}},
  {name:"pixel-dark-inspection-week-still.svg",input:demo,options:{layout:"pixel",theme:"dark",selectedWeek:45}}
);
for (const layout of ["isometric","pixel"]) {
  for (const theme of ["dark","light"]) {
    expected.push({
      name:`account-${layout}-${theme}-still.svg`,
      input:personal, options:{layout,theme,animated:false,selectedWeek:51}
    });
  }
}
let checked=0;
for(const {name,input,options} of expected) {
  const path=resolve(root,"exports",name);
  const actual=readFileSync(path,"utf8").replace(/\r\n/g,"\n");
  const generated=render(input,options).replace(/\r\n/g,"\n");
  if(actual!==generated)throw Error("Stale SVG export: "+name+". Review and regenerate explicitly.");
  if(!actual.startsWith("<svg")||!actual.trimEnd().endsWith("</svg>")||actual.includes("<script")||actual.includes("<foreignObject")){
    throw Error("Unsafe or malformed SVG export: "+name);
  }
  if(actual.length>150_000)throw Error("SVG exceeds size budget: "+name);
  if(name.includes("still")&&actual.includes("<animateMotion"))throw Error("Unexpected animation in still export: "+name);
  checked++;
}
console.log("Verified "+checked+" historical SVG exports.");
