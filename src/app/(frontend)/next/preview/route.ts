
import { NextRequest, NextResponse } from "next/server";
import { draftMode } from "next/headers";
import { getPayload } from "payload";
import config from "@payload-config";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.searchParams.get("path");

  // This route is dedicated to the homepage.
  if (path !== "/") {
    return new NextResponse("Invalid preview path", {
      status: 400,
    });
  }

  const payload = await getPayload({ config });

  const { user } = await payload.auth({
    headers: request.headers,
  });

  if (!user) {
    return new NextResponse("Authentication required", {
      status: 401,
    });
  }

  try {
    await payload.findGlobal({
      slug: "homepage",
      user,
      overrideAccess: false,
    });
  } catch {
    return new NextResponse("Preview access denied", {
      status: 403,
    });
  }

  const draft = await draftMode();
  draft.enable();

  return NextResponse.redirect(
    new URL("/", request.url),
  );
}
