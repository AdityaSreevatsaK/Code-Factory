import { readFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildLiveAssets } from "./generate-live.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const snapshot=JSON.parse(readFileSync(join(root,"data/live-public-activity.json"),"utf8"));
const result=buildLiveAssets(snapshot,{expectedLogin:"AdityaSreevatsaK"});
for(const {name,content} of result.files){
  const actual=readFileSync(join(root,"exports",name),"utf8").replace(/\r\n/g,"\n");
  if(actual!==content.replace(/\r\n/g,"\n")){
    throw Error("Outdated live SVG: "+name+". Regenerate from data/live-public-activity.json.");
  }
}
console.log(`Verified ${result.files.length} live account SVGs: ${result.events} observed public events at ${result.generatedAt}; week ${result.weekIndex}.`);
