
import {
  NextRequest,
  NextResponse,
} from "next/server";

import { draftMode } from "next/headers";

import { getPayloadClient } from "@/lib/cms/payload";

export async function GET(
  request: NextRequest,
) {
  const id = request.nextUrl.searchParams.get("id");

  if (!id) {
    return new NextResponse(
      "Save the event first to enable preview.",
      { status: 400 },
    );
  }

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
    const event = await payload.findByID({
      collection: "events",
      id: /^\d+$/.test(id)
        ? Number(id)
        : id,
      draft: true,
      user,
      overrideAccess: false,
    });

    if (!event?.slug) {
      return new NextResponse(
        "Event slug not found",
        { status: 404 },
      );
    }

    const draft = await draftMode();
    draft.enable();

    return NextResponse.redirect(
      new URL(`/events/${event.slug}`, request.url),
    );
  } catch {
    return new NextResponse(
      "Event not found or preview access denied",
      { status: 403 },
    );
  }
}
