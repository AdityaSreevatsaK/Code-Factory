/**
 * Compare two observed public GitHub captures without fetching private data.
 * Usage: node scripts/audit-coverage.mjs historical.json current.json
 */
import {readFileSync} from "node:fs";
import {resolve} from "node:path";
import {pathToFileURL} from "node:url";
import {validSnapshot} from "../calendar-factory.mjs";

export function auditCoverage(earlier,current){
 const prior=validSnapshot(earlier),latest=validSnapshot(current);
 if(prior.source!=="github"||latest.source!=="github"||
    prior.userLogin?.toLowerCase()!==latest.userLogin?.toLowerCase()){
  throw Error("Coverage audit requires two public GitHub snapshots for the same account");
 }
 const oldIds=new Set(prior.events.map(e=>e.id)),newIds=new Set(latest.events.map(e=>e.id));
 const lost=prior.events.filter(e=>!newIds.has(e.id));
 const gained=latest.events.filter(e=>!oldIds.has(e.id));
 function group(events,key){
  const result={};
  for(const e of events){const k=key(e);result[k]=(result[k]||0)+1;}
  return Object.fromEntries(Object.entries(result).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0])));
 }
 const scanned=new Set(Object.keys(current.coverage?.commit_repo_scan?.pages??{}));
 const previouslyOwned=earlier.repositories.map(x=>x.full_name).filter(x=>x.toLowerCase().startsWith(prior.userLogin.toLowerCase()+"/"));
 return {
  account:latest.userLogin,
  historical:{at:earlier.generated_at,records:prior.events.length,repositories:prior.repos.size},
  refreshed:{at:current.generated_at,records:latest.events.length,repositories:latest.repos.size},
  reconciliation:{missingFromNew:lost.length,newInRefresh:gained.length,
    arithmeticCheck:prior.events.length-lost.length+gained.length===latest.events.length},
  missingByKind:group(lost,e=>e.kind),
  gainedByKind:group(gained,e=>e.kind),
  mostAffectedRepositories:Object.entries(group(lost,e=>e.repo)).slice(0,15).map(([repository,missing])=>
    ({repository,missing,scannedInNewOwnedRepoList:scanned.has(repository)})),
  previouslyOwnedNotScanned:previouslyOwned.filter(name=>!scanned.has(name)),
  note:"Different capture times and visibility/discovery can change observed totals. A missing record is not proof it disappeared from GitHub, and activity counts are not official contribution totals."
 };
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){
 const args=process.argv.slice(2);
 if(args.length!==2)throw Error("Usage: node scripts/audit-coverage.mjs old.json new.json");
 const baseline=JSON.parse(readFileSync(resolve(args[0]),"utf8"));
 const refreshed=JSON.parse(readFileSync(resolve(args[1]),"utf8"));
 console.log(JSON.stringify(auditCoverage(baseline,refreshed),null,2));
}
