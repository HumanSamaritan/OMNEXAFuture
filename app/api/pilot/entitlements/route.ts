import { findPilotIntakesByVerifiedEmail, pilotProductStatus } from "@/lib/pilot-firestore";
import { pilotProducts } from "@/lib/pilot-catalog";
import { limitPilot, readPilotToken, pilotResponse, pilotError, readPilotRequest, pilotIsPreview } from "@/lib/pilot-server";
import { getClientKey } from "@/lib/booking";

export const runtime = "nodejs";
const eligible = new Set(["approved","invited","active"]);
/**
 * Only a verified, short-lived email session can obtain this applicant's
 * per-product eligibility. We do not disclose account history or PII.
 * Preview may read the production entitlement source ONLY through a
 * purpose-specific read-only service identity; no preview writes.
 */
export async function POST(request: Request) {
  try {
    const body=await readPilotRequest(request);
    limitPilot("entitlement-ip",getClientKey(request),15);
    const verified=readPilotToken(body.session,"verified");
    if(pilotIsPreview() && process.env.PILOT_PREVIEW_READONLY_ENABLED!=="true") {
      return pilotResponse({ok:true,source:"unavailable",reason:"Preview read-only pilot database connection is not configured.",products:[]});
    }
    let records;
    try {records=await findPilotIntakesByVerifiedEmail(verified.application.email,request);}
    catch {
      // An inaccessible database must never be interpreted as "not enrolled".
      return pilotResponse({ok:true,source:"unavailable",reason:"Pilot enrolment status could not be verified.",products:[]});
    }
    const selected = verified.application.productSlugs || [verified.application.productSlug];
    const products = selected.filter((slug)=>pilotProducts.some((p)=>p.slug===slug)).map((slug)=>{
      const values=records.map((record)=>pilotProductStatus(record,slug)).filter((v):v is NonNullable<typeof v>=>Boolean(v));
      const access=values.some((v)=>eligible.has(v));
      const previouslyApplied=values.length>0;
      return {slug,previouslyApplied,access,status:access?"eligible":previouslyApplied?"under_review":"not_found"};
    });
    return pilotResponse({ok:true,source:"verified",products});
  }catch(error){return pilotError(error);}
}
