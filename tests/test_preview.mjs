import test from "node:test";
import assert from "node:assert/strict";
import {readFileSync} from "node:fs";
import {spawnSync} from "node:child_process";
const html=readFileSync(new URL("../preview.html",import.meta.url),"utf8");
test("local snapshot picker and still download are accessible",()=>{
 assert.match(html,/id="fileInput" type="file" accept="\.json,application\/json"/);
 assert.match(html,/id="downloadSvg" disabled/);
 assert.match(html,/data source|Activity source/);
 assert.match(html,/calendarModel\(incoming\)/);
 assert.match(html,/new Blob\(\[content\]/);
});
test("browser ES module has valid modern JavaScript syntax",()=>{
 const matched=html.match(/<script type="module">([\s\S]*?)<\/script>/);
 assert.ok(matched,"browser ES module must be present");
 const checked=spawnSync(process.execPath,["--check","--input-type=module"],{input:matched[1],encoding:"utf8"});
 assert.equal(checked.status,0,checked.stderr);
});
