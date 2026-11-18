import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {auditCoverage} from "../scripts/audit-coverage.mjs";
const old=JSON.parse(readFileSync(new URL("../fixtures/adityasreevatsak-public-activity.json",import.meta.url),"utf8"));
const current=JSON.parse(readFileSync(new URL("../data/live-public-activity.json",import.meta.url),"utf8"));
test("frozen-to-live account audit reconciles reliably even after the scheduled snapshot updates",()=>{
 const result=auditCoverage(old,current);
 assert.equal(result.historical.records,old.activity.length);
 assert.equal(result.refreshed.records,current.activity.length);
 assert.equal(result.reconciliation.arithmeticCheck,true);
 const ids=new Set(current.activity.map(e=>e.id));
 assert.equal(result.reconciliation.missingFromNew,old.activity.filter(e=>!ids.has(e.id)).length);
 const oldIds=new Set(old.activity.map(e=>e.id));
 assert.equal(result.reconciliation.newInRefresh,current.activity.filter(e=>!oldIds.has(e.id)).length);
 assert.ok(result.mostAffectedRepositories.every((item,i,items)=>i===0||item.missing<=items[i-1].missing));
});
test("artificial temporary omission is attributed to its public repository source",()=>{
 const historical=structuredClone(old);
 const live=structuredClone(old);
 const owner=old.user.login;
 const publicOwned=historical.repositories.find(r=>r.full_name.startsWith(owner+"/"));
 assert.ok(publicOwned);
 live.activity=live.activity.filter(e=>e.repo_full_name!==publicOwned.full_name);
 live.repositories=live.repositories.filter(r=>r.full_name!==publicOwned.full_name);
 live.coverage.commit_repo_scan.pages={};
 const result=auditCoverage(historical,live);
 assert.equal(result.reconciliation.newInRefresh,0);
 assert.ok(result.reconciliation.missingFromNew>0);
 assert.equal(result.mostAffectedRepositories[0].repository,publicOwned.full_name);
 assert.equal(result.mostAffectedRepositories[0].scannedInNewOwnedRepoList,false);
});
test("audit rejects unrelated users and demo data",()=>{
 const badUser=structuredClone(current);badUser.user.login="another";
 assert.throws(()=>auditCoverage(old,badUser),/same account/);
 const demo=structuredClone(old);demo.source="demo";
 assert.throws(()=>auditCoverage(demo,current),/public GitHub/);
});
test("audit reports exact equality without claiming official contribution totals",()=>{
 const result=auditCoverage(current,current);
 assert.equal(result.reconciliation.missingFromNew,0);
 assert.equal(result.reconciliation.newInRefresh,0);
 assert.ok(result.note.includes("not official contribution totals"));
});
