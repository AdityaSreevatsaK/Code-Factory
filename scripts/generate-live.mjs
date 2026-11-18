/**
 * Render the latest public GitHub snapshot into four README-ready static SVGs.
 * The snapshot is collected separately; this module never makes network calls.
 * Examples:
 *   node scripts/generate-live.mjs
 *   node scripts/generate-live.mjs data/live-public-activity.json exports
 */
import { readFileSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { validSnapshot, selectedModel, render } from "../calendar-factory.mjs";

const projectRoot=resolve(dirname(fileURLToPath(import.meta.url)),"..");
const LAYOUTS=["isometric","pixel"];
const THEMES=["dark","light"];
export const LIVE_ASSETS=Object.freeze(
  LAYOUTS.flatMap(layout=>THEMES.map(theme=>`live-${layout}-${theme}-still.svg`))
);

/** Pure, deterministic generation. Does not alter the historical showcase. */
export function buildLiveAssets(snapshot,{expectedLogin}={}){
  const validated=validSnapshot(snapshot);
  if(validated.source!=="github")throw Error("Live publication requires a public GitHub snapshot, not synthetic data");
  if(!validated.userLogin)throw Error("Public GitHub username must be supplied");
  if(expectedLogin&&validated.userLogin.toLowerCase()!==expectedLogin.toLowerCase()){
    throw Error("Live public snapshot username does not match the configured account");
  }
  if(!snapshot.coverage||snapshot.coverage.kind!=="public-observed-activity"){
    throw Error("Live publication requires public-observed-activity provenance");
  }
  if(!Array.isArray(snapshot.activity)||!snapshot.activity.every(e=>typeof e.url==="string"&&e.url.startsWith("https://github.com/"))){
    throw Error("Live publication requires source-linked public GitHub event URLs");
  }
  // Select the latest observed week, including the in-progress week. Current
  // contributions therefore appear in the factory without a seven-day lag.
  const model=selectedModel(snapshot);
  const files=[];
  for(const layout of LAYOUTS)for(const theme of THEMES){
    const name=`live-${layout}-${theme}-still.svg`;
    const svg=render(snapshot,{layout,theme,animated:false,selectedWeek:model.weekIndex});
    if(svg.length>150_000||svg.includes("<animateMotion")||svg.includes("<script")||!svg.includes("PUBLIC GITHUB SNAPSHOT")){
      throw Error("Live SVG failed static-profile safety checks: "+name);
    }
    files.push({name,content:svg});
  }
  return {files,weekIndex:model.weekIndex,weekRecords:model.week.records,events:validated.events.length,
    username:validated.userLogin,generatedAt:snapshot.generated_at};
}

export function writeLiveAssets(snapshot,outputDir,{expectedLogin}={}){
  const output=resolve(outputDir);
  const built=buildLiveAssets(snapshot,{expectedLogin});
  mkdirSync(output,{recursive:true});
  for(const f of built.files)writeFileSync(join(output,f.name),f.content,"utf8");
  return built;
}

if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
  const args=process.argv.slice(2);
  if(args.length>2)throw Error("Usage: node scripts/generate-live.mjs [snapshot.json] [output-directory]");
  const input=resolve(args[0]??join(projectRoot,"data/live-public-activity.json"));
  const target=resolve(args[1]??join(projectRoot,"exports"));
  const snapshot=JSON.parse(readFileSync(input,"utf8"));
  const result=writeLiveAssets(snapshot,target,{expectedLogin:process.env.CODE_FACTORY_LIVE_USERNAME});
  console.log(`Generated ${result.files.length} live public SVGs for @${result.username}; ${result.events} observed records; selected week ${result.weekIndex} at ${result.generatedAt}.`);
}
