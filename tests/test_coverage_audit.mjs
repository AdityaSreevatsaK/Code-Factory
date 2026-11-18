import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {auditCoverage} from "../scripts/audit-coverage.mjs";
const old=JSON.parse(readFileSync(new URL("../fixtures/adityasreevatsak-public-activity.json",import.meta.url),"utf8"));
const current=JSON.parse(readFileSync(new URL("../data/live-public-activity.json",import.meta.url),"utf8"));
test("frozen-to-live account audit precisely reconciles missing and new records",()=>{
 const result=auditCoverage(old,current);
 assert.equal(result.historical.records,1219);
 assert.equal(result.refreshed.records,894);
 assert.equal(result.reconciliation.missingFromNew,457);
 assert.equal(result.reconciliation.newInRefresh,132);
 assert.equal(result.reconciliation.arithmeticCheck,true);
 assert.equal(result.missingByKind.commit,373);
 assert.equal(result.mostAffectedRepositories[0].missing,455);
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
