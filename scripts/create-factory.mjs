/**
 * One command from any public GitHub username to four static factory images.
 * Generated bundles are separate from this project's scheduled showcase.
 * No source edits, dependencies, credentials on disk or automatic uploads.
 */
import {readFile,writeFile,mkdir} from "node:fs/promises";
import {resolve,join,dirname} from "node:path";
import {fileURLToPath,pathToFileURL} from "node:url";
import {collect,createRequester,assertDate} from "../refresh-public-activity.mjs";
import {buildLiveAssets} from "./generate-live.mjs";

const root=resolve(dirname(fileURLToPath(import.meta.url)),"..");
function assetBase(value){
 if(value===undefined)return null;
 let parsed;
 try{parsed=new URL(value);}catch{throw Error("Asset base URL must be an HTTPS URL");}
 if(parsed.protocol!=="https:"||!parsed.hostname||parsed.username||parsed.password||parsed.hash||parsed.search||/[()<>\[\]\s]/.test(value)){
  throw Error("Asset base URL must be a plain HTTPS directory without credentials, query or fragments");
 }
 return parsed.href.replace(/\/$/,"");
}
export function buildFactoryBundle(snapshot,{expectedLogin,assetBaseUrl}={}){
 const source=buildLiveAssets(snapshot,{expectedLogin});
 const base=assetBase(assetBaseUrl);
 const image=name=>base?base+"/"+name:"./"+name;
 const headline="# Code Factory for @"+source.username;
 const note="Observed public activity only, not official GitHub contribution totals. Images are static and self-contained.";
 const markdown=[
  headline,"",note,"",
  "## Isometric Foundry","",
  "![Isometric Code Factory for @"+source.username+"]("+image("live-isometric-dark-still.svg")+")","",
  "## Pixel Works","",
  "![Pixel Code Factory for @"+source.username+"]("+image("live-pixel-light-still.svg")+")","",
  "Alternatives: live-isometric-light-still.svg and live-pixel-dark-still.svg.","",
  base?"The URLs above must refer to uploaded, publicly accessible image files.":"Local ./ links work only if the Markdown is in the same public repository directory as the images. For a GitHub profile README, upload the images and pass --asset-base-url pointing to their public raw URL directory.",""
 ].join("\n");
 return {files:[...source.files,{name:"public-activity.json",content:JSON.stringify(snapshot,null,2)+"\n"},{name:"README-embed.md",content:markdown}],summary:{username:source.username,events:source.events,generatedAt:source.generatedAt,weekIndex:source.weekIndex}};
}
export async function writeFactoryBundle(snapshot,outputDir,options={}){
 const bundle=buildFactoryBundle(snapshot,options);
 await mkdir(outputDir,{recursive:true});
 for(const f of bundle.files)await writeFile(join(outputDir,f.name),f.content,"utf8");
 return bundle;
}
function optionsFrom(argv){
 const options={};
 const permitted={"--username":"username","--since":"since","--output":"output","--snapshot":"snapshot","--asset-base-url":"assetBaseUrl"};
 for(let i=0;i<argv.length;i++){
  const arg=argv[i];
  if(arg==="--help"&&argv.length===1)return {help:true};
  if(!Object.hasOwn(permitted,arg)||!argv[i+1]||argv[i+1].startsWith("--"))throw Error("Expected value after recognised option: "+arg);
  const key=permitted[arg];if(options[key]!==undefined)throw Error("Duplicate option: "+arg);
  options[key]=argv[++i];
 }
 if(!options.username&&!options.snapshot)throw Error("Provide --username LOGIN or --snapshot public-activity.json");
 if(options.snapshot&&options.since)throw Error("--since applies only when collecting a username");
 if(options.since)assertDate(options.since);
 if(options.assetBaseUrl)assetBase(options.assetBaseUrl);
 return options;
}
export async function main(argv){
 const args=optionsFrom(argv);
 if(args.help){
  console.log("Usage: node scripts/create-factory.mjs --username LOGIN [--since YYYY-MM-DD] [--output DIR] [--asset-base-url HTTPS_DIRECTORY]\n       node scripts/create-factory.mjs --snapshot public-activity.json [--username LOGIN] [--output DIR]");
  return;
 }
 const snapshot=args.snapshot?JSON.parse(await readFile(resolve(args.snapshot),"utf8")):
  await collect({login:args.username,since:args.since,request:createRequester(process.env.GITHUB_TOKEN)});
 const output=resolve(args.output??join(root,"output",String(snapshot.user?.login??"account").toLowerCase()));
 const bundle=await writeFactoryBundle(snapshot,output,{expectedLogin:args.username,assetBaseUrl:args.assetBaseUrl});
 console.log("Created "+bundle.files.length+" files for @"+bundle.summary.username+" in "+output);
 console.log(bundle.summary.events+" observed public event records. Not official GitHub contribution totals.");
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 main(process.argv.slice(2)).catch(err=>{console.error(String(err));process.exitCode=1;});
}
