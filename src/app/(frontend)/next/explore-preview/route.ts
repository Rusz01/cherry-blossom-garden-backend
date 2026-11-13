
import { draftMode } from "next/headers";

import {
  NextRequest,
  NextResponse,
} from "next/server";

import { getPayloadClient } from
    "@/lib/cms/payload";

import { isFloorKey } from
    "@/lib/explore/defaults";

export async function GET(request: NextRequest) {
  const floor =
    request.nextUrl.searchParams.get("floor");

  if (!isFloorKey(floor)) {
    return new NextResponse(
      "Invalid floor",
      { status: 400 },
    );
  }

  const payload = await getPayloadClient();

  const { user, permissions } = await payload.auth({
    headers: request.headers,
  });

  if (
    !user ||
    !permissions?.collections?.[
      "explore-pages"
      ]?.read
  ) {
    return new NextResponse(
      "Preview access denied",
      { status: 403 },
    );
  }

  const result = await payload.find({
    collection: "explore-pages",
    where: {
      floor: {
        equals: floor,
      },
    },
    draft: true,
    user,
    overrideAccess: false,
    depth: 0,
    limit: 1,
  });

  const document = result.docs[0];

  if (!document?.slug) {
    return new NextResponse(
      "Explore page not found",
      { status: 404 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(
    new URL(
      `/explore/${document.slug}`,
      request.url,
    ),
  );
}
