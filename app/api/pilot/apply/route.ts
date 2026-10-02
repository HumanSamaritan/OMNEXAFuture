import { pilotError, pilotResponse, readPilotRequest, submitPilotApplication } from "@/lib/pilot-server";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { return pilotResponse(await submitPilotApplication(await readPilotRequest(request), request)); }
  catch (error) { return pilotError(error); }
}
