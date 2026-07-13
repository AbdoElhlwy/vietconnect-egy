import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userHasPermission } from "@/lib/rbac";
import { prisma } from "@/lib/prisma";

function toCsvRow(values: (string | number | null | undefined)[]) {
  return values
    .map((v) => `"${String(v ?? "").replace(/"/g, '""')}"`)
    .join(",");
}

export async function GET() {
  const session = await auth();
  const userId = (session?.user as any)?.id as string | undefined;

  if (!userId || !(await userHasPermission(userId, "reports:read"))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const requests = await prisma.serviceRequest.findMany({
    include: { user: true },
    orderBy: { createdAt: "desc" }
  });

  const header = toCsvRow(["Reference", "User", "Email", "Type", "Priority", "Status", "Created At"]);
  const rows = requests.map((r) =>
    toCsvRow([r.refNumber, r.user.fullName, r.user.email, r.type, r.priority, r.status, r.createdAt.toISOString()])
  );
  const csv = [header, ...rows].join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="requests-report-${Date.now()}.csv"`
    }
  });
}
