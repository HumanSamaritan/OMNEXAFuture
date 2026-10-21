import { pilotError, pilotResponse, readPilotRequest, verifyPilotCode } from "@/lib/pilot-server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { return pilotResponse(verifyPilotCode(await readPilotRequest(request), request)); }
  catch (error) { return pilotError(error); }
}
