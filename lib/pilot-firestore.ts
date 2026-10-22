import { createSign } from "node:crypto";

/** Server-only Firestore access for the dedicated OMNeXa Pilot Intake project.
 * No browser Firebase credentials or Admin SDK dependency is required.
 * Intentionally fails closed until preview service credentials are configured.
 */
type Value = { stringValue?: string; booleanValue?: boolean; integerValue?: string; nullValue?: null; mapValue?: { fields: Record<string,Value> }; arrayValue?: { values: Value[] } };
const env = () => {
  const project = process.env.FIREBASE_PILOT_PROJECT_ID;
  const email = process.env.FIREBASE_PILOT_CLIENT_EMAIL;
  const key = process.env.FIREBASE_PILOT_PRIVATE_KEY?.replace(/\\n/g,"\n");
  const db = process.env.FIREBASE_PILOT_DATABASE_ID || "(default)";
  if (!project || !email || !key) throw new Error("OMNeXa Pilot Firestore not configured");
  return {project,email,key,db};
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
let cached:{token:string;exp:number}|undefined;
async function token(){
  if(cached && cached.exp>Date.now()+60000)return cached.token;
  const {email,key}=env();const now=Math.floor(Date.now()/1000);
  const unsigned=[{alg:"RS256",typ:"JWT"},{iss:email,scope:"https://www.googleapis.com/auth/datastore",aud:"https://oauth2.googleapis.com/token",iat:now,exp:now+3600}].map(x=>Buffer.from(JSON.stringify(x)).toString("base64url")).join(".");
  const sig=createSign("RSA-SHA256").update(unsigned).sign(key).toString("base64url");
  const r=await fetch("https://oauth2.googleapis.com/token",{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:new URLSearchParams({grant_type:"urn:ietf:params:oauth:grant-type:jwt-bearer",assertion:unsigned+"."+sig}),cache:"no-store"});
  const body=await r.json() as {access_token?:string;expires_in?:number};
  if(!r.ok || !body.access_token)throw new Error("Pilot database authorisation failed");
  cached={token:body.access_token,exp:Date.now()+(body.expires_in||3600)*1000};return cached.token;
}
const collectionUrl=()=>{const c=env();return `https://firestore.googleapis.com/v1/projects/${encodeURIComponent(c.project)}/databases/${encodeURIComponent(c.db)}/documents/omnexa_pilot_applications`;};
export type PilotIntakeRecord={reference:string;productSlug:string;email:string;status:"pending_review"|"approved"|"invited"|"active"|"completed"|"declined"|"withdrawn";createdAt:string;agreementVersion:string;agreementSha256:string;recordSha256:string;consents:Record<string,boolean>;application:Record<string,unknown>;firstUsedAt?:string|null;lastUsedAt?:string|null};
export async function createPilotIntake(record:PilotIntakeRecord){
  const url=collectionUrl()+"/"+encodeURIComponent(record.reference);
  const r=await fetch(url+"?currentDocument.exists=false",{method:"PATCH",headers:{Authorization:"Bearer "+await token(),"Content-Type":"application/json"},body:JSON.stringify({fields:fields(record as unknown as Record<string,unknown>)}),cache:"no-store"});
  if(r.status===409 || r.status===412)throw new Error("Pilot reference already stored; do not create duplicate");
  if(!r.ok)throw new Error("Pilot intake database write failed: "+r.status);
  return record.reference;
}
export async function getPilotIntake(reference:string):Promise<PilotIntakeRecord|null>{
  if(!/^OMX-[a-f0-9-]{36}$/.test(reference))return null;
  const r=await fetch(collectionUrl()+"/"+encodeURIComponent(reference),{headers:{Authorization:"Bearer "+await token()},cache:"no-store"});
  if(r.status===404)return null;
  if(!r.ok)throw new Error("Pilot intake database read failed: "+r.status);
  const doc=await r.json() as {fields:Record<string,Value>};
  return Object.fromEntries(Object.entries(doc.fields).map(([k,v])=>[k,decode(v)])) as PilotIntakeRecord;
}
