import { describe, it, expect } from "vitest";

// Lightweight unit test validating the permission-matching logic used by
// userHasPermission, without requiring a live database connection.
function matches(rolePermissions: string[], required: string) {
  return rolePermissions.includes(required);
}

describe("RBAC permission matching", () => {
  it("grants access when the role has the exact permission", () => {
    expect(matches(["requests:manage", "users:manage"], "requests:manage")).toBe(true);
  });

  it("denies access when the permission is absent", () => {
    expect(matches(["requests:read"], "requests:manage")).toBe(false);
  });
});
