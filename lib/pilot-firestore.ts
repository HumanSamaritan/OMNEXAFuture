/** Keyless Vercel OIDC → Google STS → scoped Firestore service account. Server only. */
type Value = { stringValue?: string; booleanValue?: boolean; integerValue?: string; nullValue?: null; mapValue?: { fields: Record<string,Value> }; arrayValue?: { values: Value[] } };
const env = () => {
  const project = process.env.FIREBASE_PILOT_PROJECT_ID;
  const email = process.env.FIREBASE_PILOT_CLIENT_EMAIL;
  const db = process.env.FIREBASE_PILOT_DATABASE_ID || "(default)";
  if (!project || !email) throw new Error("OMNeXa Pilot Firestore not configured");
  return {project,email,db};
};
const encode = (x:unknown):Value => x===null?{nullValue:null}: typeof x==="string"?{stringValue:x}:typeof x==="boolean"?{booleanValue:x}:typeof x==="number"?{integerValue:String(x)}:Array.isArray(x)?{arrayValue:{values:x.map(encode)}}:{mapValue:{fields:Object.fromEntries(Object.entries(x as Record<string,unknown>).filter(([,v])=>v!==undefined).map(([k,v])=>[k,encode(v)]))}};
const fields = (x:Record<string,unknown>)=>Object.fromEntries(Object.entries(x).filter(([,v])=>v!==undefined).map(([k,v])=>[k,encode(v)]));
const decode = (v: Value): unknown => {
  if ("nullValue" in v) return null;
  if (v.stringValue !== undefined) return v.stringValue;
  if (v.booleanValue !== undefined) return v.booleanValue;
  if (v.integerValue !== undefined) return Number(v.integerValue);
  if (v.mapValue) return Object.fromEntries(Object.entries(v.mapValue.fields).map(([k, w]) => [k, decode(w)]));
  if (v.arrayValue) return v.arrayValue.values.map(decode);
  return null;
};
async function token(request: Request): Promise<string> {
  if (process.env.VERCEL_ENV !== "preview") throw new Error("Pilot federation limited to Preview");
  const oidc = request.headers.get("x-vercel-oidc-token") || process.env.VERCEL_OIDC_TOKEN;
  if (!oidc) throw new Error("Vercel OIDC identity unavailable");
  const audience = "//iam.googleapis.com/projects/465158402810/locations/global/workloadIdentityPools/omnexa-vercel/providers/vercel";
  const sts = await fetch("https://sts.googleapis.com/v1/token", {
    method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"},
    body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:token-exchange",
      audience,scope:"https://www.googleapis.com/auth/cloud-platform",
      requested_token_type:"urn:ietf:params:oauth:token-type:access_token",
      subject_token_type:"urn:ietf:params:oauth:token-type:jwt",subject_token:oidc}),cache:"no-store"
  });
  const result = await sts.json() as {access_token?:string};
  if (!sts.ok || !result.access_token) throw new Error("Google federation token exchange failed: "+sts.status);
  const {email}=env();
  const imp=await fetch("https://iamcredentials.googleapis.com/v1/projects/-/serviceAccounts/"+encodeURIComponent(email)+":generateAccessToken", {
    method:"POST",headers:{"Content-Type":"application/json",Authorization:"Bearer "+result.access_token},
    body:JSON.stringify({scope:["https://www.googleapis.com/auth/datastore"],lifetime:"1800s"}),cache:"no-store"
  });
  const access=await imp.json() as {accessToken?:string};
  if (!imp.ok || !access.accessToken) throw new Error("Service account impersonation failed: "+imp.status);
  return access.accessToken;
}
const collectionUrl=()=>{const c=env();return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(c.project)}/databases/${encodeURIComponent(c.db)}/documents/omnexa_pilot_applications`;};
export type PilotIntakeRecord={reference:string;productSlug:string;email:string;status:"pending_review"|"approved"|"invited"|"active"|"completed"|"declined"|"withdrawn";createdAt:string;agreementVersion:string;agreementSha256:string;recordSha256:string;consents:Record<string,boolean>;application:Record<string,unknown>;firstUsedAt?:string|null;lastUsedAt?:string|null};
export async function createPilotIntake(record:PilotIntakeRecord, request:Request){
  const url=collectionUrl()+"/"+encodeURIComponent(record.reference);
  const r=await fetch(url+"?currentDocument.exists=false",{method:"PATCH",headers:{Authorization:"Bearer "+await token(request),"Content-Type":"application/json"},body:JSON.stringify({fields:fields(record as unknown as Record<string,unknown>)}),cache:"no-store"});
  if(r.status===409 || r.status===412)throw new Error("Pilot reference already stored; do not create duplicate");
  if(!r.ok)throw new Error("Pilot intake database write failed: "+r.status);
  return record.reference;
}
export async function getPilotIntake(reference:string, request:Request):Promise<PilotIntakeRecord|null>{
  if(!/^OMX-[a-f0-9-]{36}$/.test(reference))return null;
  const r=await fetch(collectionUrl()+"/"+encodeURIComponent(reference),{headers:{Authorization:"Bearer "+await token(request)},cache:"no-store"});
  if(r.status===404)return null;
  if(!r.ok)throw new Error("Pilot intake database read failed: "+r.status);
  const doc=await r.json() as {fields:Record<string,Value>};
  return Object.fromEntries(Object.entries(doc.fields).map(([k,v])=>[k,decode(v)])) as PilotIntakeRecord;
}
