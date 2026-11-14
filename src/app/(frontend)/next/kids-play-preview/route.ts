
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { draftMode } from "next/headers";

import { getPayloadClient } from "@/lib/cms/payload";

export async function GET(request: NextRequest) {
  const payload = await getPayloadClient();

  const { user } = await payload.auth({
    headers: request.headers,
  });

  if (!user) {
    return new NextResponse(
      "Authentication required",
      { status: 401 },
    );
  }

  try {
    await payload.findGlobal({
      slug: "kids-play-page",
      user,
      overrideAccess: false,
      depth: 0,
    });
  } catch {
    return new NextResponse(
      "Preview access denied",
      { status: 403 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(
    new URL("/kids-play", request.url),
  );
}
