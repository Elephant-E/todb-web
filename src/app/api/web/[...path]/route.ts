import { NextRequest, NextResponse } from "next/server";

const UPSTREAM = process.env.UPSTREAM_API_URL || "https://theotherdb.org/api";
const DEV_SESSION = process.env.DEV_SESSION_COOKIE || "";

function buildCookieHeader(request: NextRequest): { cookieHeader: string; usedDevSession: boolean } {
  const parts: string[] = [];
  let usedDevSession = false;

  if (DEV_SESSION) {
    parts.push(`session=${DEV_SESSION}`);
    usedDevSession = true;
  } else {
    const localSession = request.cookies.get("session")?.value;
    if (localSession) {
      parts.push(`session=${localSession}`);
    }
  }

  const cf = request.cookies.get("cf_clearance")?.value;
  if (cf) parts.push(`cf_clearance=${cf}`);

  return { cookieHeader: parts.join("; "), usedDevSession };
}

function rewriteCookie(raw: string, request: NextRequest): string | null {
  const parts = raw.split(";").map((p) => p.trim());
  const nameValue = parts[0];
  if (!nameValue) return null;

  let sameSite = "";
  for (const p of parts) {
    if (p.toLowerCase().startsWith("samesite=")) {
      const val = p.split("=")[1]?.toLowerCase();
      if (val === "lax" || val === "strict") {
        sameSite = `SameSite=${val.charAt(0).toUpperCase() + val.slice(1)}`;
      }
    }
  }

  const isSecure = request.nextUrl.protocol === "https:";
  return [nameValue, "Path=/", sameSite, isSecure ? "Secure" : "", "HttpOnly"]
    .filter(Boolean)
    .join("; ");
}

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

  const { cookieHeader, usedDevSession } = buildCookieHeader(request);
  if (cookieHeader) headers.set("Cookie", cookieHeader);

  try {
    const body = method !== "GET" && method !== "DELETE" ? await request.arrayBuffer() : undefined;
    const res = await fetch(url, { method, headers, body, redirect: "manual" });

    if (res.status === 301 || res.status === 302) {
      const location = res.headers.get("location") || "/";
      const redirectRes = NextResponse.redirect(new URL(location, request.url));
      if (!usedDevSession) {
        res.headers.forEach((value, key) => {
          if (key === "set-cookie") {
            const rewritten = rewriteCookie(value, request);
            if (rewritten) redirectRes.headers.append("set-cookie", rewritten);
          }
        });
      }
      return redirectRes;
    }

    const responseBody = res.status === 204 ? null : await res.arrayBuffer();
    const response = new NextResponse(responseBody, { status: res.status, statusText: res.statusText });

    res.headers.forEach((value, key) => {
      if (key === "set-cookie") {
        if (!usedDevSession) {
          const rewritten = rewriteCookie(value, request);
          if (rewritten) response.headers.append("set-cookie", rewritten);
        }
      } else if (!["content-encoding", "content-length", "transfer-encoding"].includes(key.toLowerCase())) {
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
