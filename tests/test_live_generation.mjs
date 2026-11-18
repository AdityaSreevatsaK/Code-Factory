import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LIVE_ASSETS,buildLiveAssets } from "../scripts/generate-live.mjs";
import { selectedModel } from "../calendar-factory.mjs";
const publicSource=JSON.parse(readFileSync(new URL("../fixtures/adityasreevatsak-public-activity.json",import.meta.url),"utf8"));

test("live outputs are deterministic, all static, with four distinct names",()=>{
  const first=buildLiveAssets(publicSource,{expectedLogin:"AdityaSreevatsaK"});
  const second=buildLiveAssets(structuredClone(publicSource),{expectedLogin:"adityasreevatsak"});
  assert.deepEqual(first,second);
  assert.deepEqual(first.files.map(f=>f.name),LIVE_ASSETS);
  assert.equal(new Set(LIVE_ASSETS).size,4);
  assert.ok(first.files.every(f=>f.content.includes("@AdityaSreevatsaK")));
  assert.ok(first.files.every(f=>!f.content.includes("<animateMotion")));
  assert.ok(first.files.every(f=>f.content.length<150000));
});
test("live view selects the latest active week, not frozen week 51",()=>{
  const data=structuredClone(publicSource);
  data.generated_at="2026-11-18T10:00:00Z";
  data.activity.push({...data.activity[0],id:"new-live-commit",repo_full_name:data.activity[0].repo_full_name,
    kind:"commit",occurred_at:"2026-11-18T09:00:00Z",count:1,url:"https://github.com/"+data.activity[0].repo_full_name+"/commit/abc123"});
  const selected=selectedModel(data);
  assert.equal(selected.defaultWeek,52);
  const rendered=buildLiveAssets(data);
  assert.equal(rendered.weekIndex,52);
  assert.equal(rendered.generatedAt,data.generated_at);
  assert.ok(rendered.files[0].content.includes('data-day="2026-11-18"'));
});
test("live publication rejects demo or wrong-user snapshots",()=>{
  const fake=structuredClone(publicSource);fake.source="demo";
  assert.throws(()=>buildLiveAssets(fake),/requires a public GitHub snapshot/);
  assert.throws(()=>buildLiveAssets(publicSource,{expectedLogin:"unrelated-user"}),/does not match/);
});
test("live publication rejects missing provenance and URLs",()=>{
  const missing=structuredClone(publicSource);delete missing.coverage;
  assert.throws(()=>buildLiveAssets(missing),/provenance/);
  const invalid=structuredClone(publicSource);invalid.activity[0].url="https://private.example/missing";
  assert.throws(()=>buildLiveAssets(invalid),/source-linked/);
});
