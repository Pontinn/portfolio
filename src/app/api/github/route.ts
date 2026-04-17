import { NextResponse } from "next/server"

export async function GET() {
  const res = await fetch(
    "https://api.github.com/users/Pontinn/repos?sort=updated&per_page=6",
    {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      next: { revalidate: 3600 },
    }
  )

  if (!res.ok) {
    return NextResponse.json([], { status: res.status })
  }

  const data = await res.json()
  return NextResponse.json(data)
}
