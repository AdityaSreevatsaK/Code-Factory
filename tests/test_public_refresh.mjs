import test from "node:test";
import assert from "node:assert/strict";
import { collect, assertDate, sourceRepo } from "../refresh-public-activity.mjs";

const user="AdityaSreevatsaK";
const repo="example/public-repo";
const privateRepo="example/private-repo";
const date=new Date("2026-11-17T08:00:00.000Z");

function fakeRequest(route,{allowEmpty=false}={}){
 const url=new URL("https://api.github.com"+route);
 if(url.pathname==="/search/issues"){
  const q=url.searchParams.get("q");
  assert.match(q,/is:public/);
  if(q.includes("is:pr")){
   return {total_count:1,incomplete_results:false,items:[{
    number:10,repository_url:"https://api.github.com/repos/"+repo,
    user:{login:user},created_at:"2026-11-15T09:00:00Z",
    html_url:"https://github.com/"+repo+"/pull/10",
    pull_request:{merged_at:"2026-11-16T10:00:00Z"}
   }]};
  }
  return {total_count:1,incomplete_results:false,items:[{
   number:11,repository_url:"https://api.github.com/repos/"+repo,
   user:{login:user},created_at:"2026-11-15T12:00:00Z",
   html_url:"https://github.com/"+repo+"/issues/11"
  }]};
 }
 if(url.pathname==="/users/"+user+"/repos")return [
  {full_name:repo,owner:{login:user},private:false,visibility:"public"},
  {full_name:privateRepo,owner:{login:user},private:true,visibility:"private"},
  {full_name:"other/claimed",owner:{login:"other"},private:false,visibility:"public"}
 ];
 if(url.pathname==="/repos/"+repo+"/commits")return [
  {sha:"abc",author:{login:user},commit:{committer:{date:"2026-11-16T16:00:00Z"}},html_url:"https://github.com/"+repo+"/commit/abc"},
  {sha:"foreign",author:{login:"other"},commit:{committer:{date:"2026-11-16T17:00:00Z"}},html_url:"https://github.com/"+repo+"/commit/foreign"}
 ];
 throw Error("Unexpected API route: "+route);
}
test("collector exports verified public issues, PRs, merged stages and commits",async()=>{
 const snapshot=await collect({request:fakeRequest,now:date,since:"2026-11-01"});
 assert.equal(snapshot.source,"github");
 assert.equal(snapshot.user.login,user);
 assert.deepEqual(snapshot.repositories.map(r=>r.full_name),[repo]);
 assert.deepEqual(snapshot.activity.map(e=>e.kind),["pr_opened","issue_opened","pr_merged","commit"]);
 assert.equal(snapshot.activity.length,4);
 assert.ok(snapshot.activity.every(e=>e.repo_full_name===repo));
 assert.ok(snapshot.coverage.notes.every(n=>!n.includes("private repository data")));
 assert.equal(snapshot.coverage.search_totals.pr,1);
 assert.equal(snapshot.coverage.search_totals.issue,1);
});
test("collector cannot query private repository commit endpoints",async()=>{
 const calls=[];
 const request=async(route,args)=>{calls.push(route);return fakeRequest(route,args)};
 await collect({request,now:date,since:"2026-11-01"});
 assert.ok(!calls.some(route=>route.includes(privateRepo)));
 assert.ok(calls.some(route=>route.includes("is%3Apublic")));
});
test("search pagination cap fails closed instead of silently losing activity",async()=>{
 const request=async(route)=>{
  if(route.includes("/search/issues"))return {total_count:1001,incomplete_results:false,items:[]};
  throw Error("should not reach other endpoints");
 };
 await assert.rejects(collect({request,now:date,since:"2026-11-01"}),/1,000-result API limit/);
});
test("incomplete GitHub public search fails closed",async()=>{
 const request=async()=>({total_count:1,incomplete_results:true,items:[]});
 await assert.rejects(collect({request,now:date,since:"2026-11-01"}),/incomplete/);
});
test("future-created events cannot enter a source snapshot",async()=>{
 const request=async(route,args)=>{
  const out=fakeRequest(route,args);
  if(route.includes("/search/issues")&&route.includes("is%3Apr"))
   {out.items[0].created_at="2026-11-18T00:00:00Z";out.items[0].pull_request.merged_at="2026-11-18T01:00:00Z";}
  return out;
 };
 const snap=await collect({request,now:date,since:"2026-11-01"});
 assert.equal(snap.activity.some(e=>e.kind==="pr_opened"),false);
 assert.equal(snap.activity.some(e=>e.kind==="pr_merged"),false);
});
test("collector enforces safe UTC start date and repository URLs",()=>{
 assert.equal(assertDate("2026-11-17").toISOString(),"2026-11-17T00:00:00.000Z");
 assert.throws(()=>assertDate("2026-02-30"),/Invalid start/);
 assert.throws(()=>assertDate("17/11/2026"),/YYYY-MM-DD/);
 assert.equal(sourceRepo("https://api.github.com/repos/example/repo"),"example/repo");
 assert.throws(()=>sourceRepo("https://evil.example/repos/example/repo"),/Invalid repository URL/);
});

test("impossible PR merge timestamps fail closed",async()=>{
 const request=async(route,args)=>{
  const out=fakeRequest(route,args);
  if(route.includes("/search/issues")&&route.includes("is%3Apr"))
   out.items[0].pull_request.merged_at="2026-11-14T00:00:00Z";
  return out;
 };
 await assert.rejects(collect({request,now:date,since:"2026-11-01"}),/predates its opening/);
});

test("recovers a known public owned repository omitted from the account listing",async()=>{
 const missing=user+"/was-public";
 let verifiedAnonymously=false,scanned=false;
 const request=async(route,options={})=>{
   if(route==="/users/"+user+"/repos?type=owner&per_page=100&page=1")return [];
   if(route==="/repos/"+missing){
     assert.equal(options.publicOnly,true);
     assert.equal(options.allowNotFound,true);
     verifiedAnonymously=true;
     return {full_name:missing,owner:{login:user},private:false,visibility:"public"};
   }
   if(route.startsWith("/repos/"+missing+"/commits?")){
     assert.ok(verifiedAnonymously,"must confirm PUBLIC metadata before commits");
     scanned=true;
     return [{sha:"restored",author:{login:user},
       commit:{committer:{date:"2026-11-16T17:00:00Z"}},
       html_url:"https://github.com/"+missing+"/commit/restored"}];
   }
   return fakeRequest(route,options);
 };
 const snap=await collect({request,now:date,since:"2026-11-01",
   previousPublicRepositories:[missing,missing,"foreign/external"]});
 assert.ok(scanned);
 assert.ok(snap.activity.some(e=>e.repo_full_name===missing&&e.kind==="commit"));
 assert.equal(snap.coverage.commit_repo_scan.rechecked_public_repositories,1);
 assert.equal(snap.coverage.commit_repo_scan.unavailable_previous_count,0);
});
test("never scans a previously public repository that is no longer public",async()=>{
 const missing=user+"/now-private",seen=[];
 const request=async(route,options={})=>{
   seen.push(route);
   if(route==="/users/"+user+"/repos?type=owner&per_page=100&page=1")return [];
   if(route==="/repos/"+missing){
     assert.equal(options.publicOnly,true);
     return null; // Anonymous metadata request would return HTTP 404
   }
   return fakeRequest(route,options);
 };
 const snap=await collect({request,now:date,since:"2026-11-01",
   previousPublicRepositories:[missing]});
 assert.equal(snap.coverage.commit_repo_scan.unavailable_previous_count,1);
 assert.ok(!seen.some(route=>route.includes(missing+"/commits")));
 assert.ok(!snap.activity.some(e=>e.repo_full_name===missing));
 assert.ok(!JSON.stringify(snap).includes(missing));
});
test("fails closed on public metadata verification failure",async()=>{
 const missing=user+"/public-api-failure";
 const request=async(route,options={})=>{
   if(route==="/users/"+user+"/repos?type=owner&per_page=100&page=1")return [];
   if(route==="/repos/"+missing)throw Error("public metadata rate limit");
   return fakeRequest(route,options);
 };
 await assert.rejects(collect({request,now:date,since:"2026-11-01",
   previousPublicRepositories:[missing]}),/rate limit/);
});
test("does not treat malformed known-repository hint arrays as trusted",async()=>{
 await assert.rejects(collect({request:fakeRequest,now:date,since:"2026-11-01",
   previousPublicRepositories:"bad"}),/Invalid previous/);
});
