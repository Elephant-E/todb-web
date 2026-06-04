import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = process.env.UPSTREAM_API_URL || "https://theotherdb.org/api";

async function proxyRequest(
  method: string,
  request: NextRequest,
  params: Promise<{ path: string[] }>
): Promise<NextResponse> {
  const { path } = await params;
  const url = `${UPSTREAM}/${path.join("/")}${request.nextUrl.search}`;

  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("Content-Type", contentType);
  else if (method !== "GET" && method !== "DELETE") headers.set("Content-Type", "application/json");
  else headers.set("Accept", "application/json");

  const authorization = request.headers.get("authorization");
  if (authorization) headers.set("Authorization", authorization);

  try {
    const body = method !== "GET" && method !== "DELETE" ? await request.arrayBuffer() : undefined;
    const res = await fetch(url, { method, headers, body, redirect: "manual" });

    if (res.status === 301 || res.status === 302) {
      const location = res.headers.get("location") || "/";
      const redirectRes = NextResponse.redirect(new URL(location, request.url));
      return redirectRes;
    }

    const responseBody = res.status === 204 ? null : await res.arrayBuffer();
    const response = new NextResponse(responseBody, { status: res.status, statusText: res.statusText });

    res.headers.forEach((value, key) => {
      if (!["content-encoding", "content-length", "transfer-encoding", "set-cookie"].includes(key.toLowerCase())) {
        response.headers.set(key, value);
      }
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Upstream request failed" }, { status: 502 });
  }
}

type RouteContext = { params: Promise<{ path: string[] }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  return proxyRequest("GET", request, params);
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  return proxyRequest("POST", request, params);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  return proxyRequest("PUT", request, params);
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  return proxyRequest("DELETE", request, params);
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  return proxyRequest("PATCH", request, params);
}
