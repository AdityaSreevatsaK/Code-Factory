import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync,mkdtempSync,existsSync,rmSync} from "node:fs";
import {join} from "node:path";
import {tmpdir} from "node:os";
import {spawnSync} from "node:child_process";
import {buildFactoryBundle} from "../scripts/create-factory.mjs";
const sample=JSON.parse(readFileSync(new URL("../fixtures/adityasreevatsak-public-activity.json",import.meta.url),"utf8"));
test("any GitHub snapshot generates four named stills, source JSON and ready Markdown",()=>{
 const result=buildFactoryBundle(sample);
 assert.equal(result.files.length,6);
 assert.equal(result.summary.username,"AdityaSreevatsaK");
 assert.ok(result.files.every(f=>!f.content.includes("<script")));
 assert.ok(result.files.some(f=>f.name==="README-embed.md"&&f.content.includes("./live-isometric-dark-still.svg")));
 assert.ok(result.files.some(f=>f.name==="public-activity.json"));
});
test("hosted embed URLs are opt-in and constrained to safe HTTPS",()=>{
 const bundle=buildFactoryBundle(sample,{assetBaseUrl:"https://raw.githubusercontent.com/example/profile/main/assets/"});
 assert.match(bundle.files.find(f=>f.name==="README-embed.md").content,/raw.githubusercontent.com\/example\/profile\/main\/assets\/live-pixel-light-still.svg/);
 for(const unsafe of ["javascript:alert(1)","http://localhost/","https://user:secret@example.com/path","https://example.com/folder?a=b","https://example.com/hello world"]){
  assert.throws(()=>buildFactoryBundle(sample,{assetBaseUrl:unsafe}),/Asset base URL/);
 }
});
test("offline command needs no username config, network access or special fixtures",()=>{
 const output=mkdtempSync(join(tmpdir(),"factory-test-"));
 try{
  const args=["scripts/create-factory.mjs","--snapshot","fixtures/adityasreevatsak-public-activity.json","--output",output];
  const p=spawnSync(process.execPath,args,{cwd:new URL("..",import.meta.url),encoding:"utf8"});
  assert.equal(p.status,0,p.stderr);
  assert.ok(existsSync(join(output,"live-isometric-dark-still.svg")));
  assert.ok(existsSync(join(output,"README-embed.md")));
 }finally{rmSync(output,{recursive:true,force:true});}
});
test("username mismatch and invalid data are rejected before publication",()=>{
 assert.throws(()=>buildFactoryBundle(sample,{expectedLogin:"unrelated"}),/does not match/);
 const fake=structuredClone(sample);fake.source="demo";
 assert.throws(()=>buildFactoryBundle(fake),/requires a public GitHub snapshot/);
});
