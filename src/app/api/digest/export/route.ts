import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format") || "html";
  const date = searchParams.get("date") || new Date().toISOString().split("T")[0];

  if (format === "markdown") {
    return new NextResponse(
      `# Acadia Media Monitor - ${date}\n\nDigest content here.`,
      { headers: { "Content-Type": "text/markdown" } }
    );
  }
  return new NextResponse(
    `<html><body><h1>Acadia Media Monitor - ${date}</h1></body></html>`,
    { headers: { "Content-Type": "text/html" } }
  );
}
