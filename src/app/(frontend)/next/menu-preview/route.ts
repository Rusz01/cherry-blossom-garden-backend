
import { draftMode } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import config from "@payload-config";

export async function GET(request: NextRequest) {
  const type = request.nextUrl.searchParams.get("type");
  const id = request.nextUrl.searchParams.get("id");

  if (!["settings", "item", "special"].includes(type ?? "")) {
    return new NextResponse("Invalid preview type", { status: 400 });
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
    if (type === "settings") {
      await payload.findGlobal({
        slug: "menu-settings",
        user,
        overrideAccess: false,
      });
    } else {
      if (!id) {
        return new NextResponse(
          "Save the document first to enable preview.",
          { status: 400 },
        );
      }

      await payload.findByID({
        collection:
          type === "item" ? "menu-items" : "special-menus",
        id: /^\d+$/.test(id) ? Number(id) : id,
        draft: true,
        user,
        overrideAccess: false,
      });
    }
  } catch {
    return new NextResponse("Preview access denied", {
      status: 403,
    });
  }

  const draft = await draftMode();
  draft.enable();

  const url = new URL("/menu", request.url);
  url.searchParams.set("previewType", type!);

  if (id) url.searchParams.set("previewId", id);

  return NextResponse.redirect(url);
}
