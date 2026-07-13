import { LucideIcon } from "lucide-react";
import Link from "next/link";

export function ServiceCard({
  icon: Icon,
  title,
  description,
  href
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <Link href={href} className="card-diplomatic hover:shadow-lg transition group block h-full">
      <div className="w-11 h-11 rounded-xl bg-diplomatic-navy/5 flex items-center justify-center text-diplomatic-navy group-hover:bg-vn-red group-hover:text-white transition">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 font-bold text-diplomatic-navy">{title}</h3>
      <p className="mt-1 text-sm text-diplomatic-navy/70">{description}</p>
    </Link>
  );
}
