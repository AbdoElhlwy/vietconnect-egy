export function StatCard({ value, label }: { value: string | number; label: string }) {
  return (
    <div className="card-diplomatic text-center">
      <div className="text-3xl font-extrabold text-vn-red">{value}</div>
      <div className="mt-1 text-sm text-diplomatic-navy/70">{label}</div>
    </div>
  );
}
