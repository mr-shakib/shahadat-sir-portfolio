import Link from "next/link";

export default function AdminNotFound() {
  return (
    <div className="py-16">
      <h1 className="font-serif text-3xl font-medium tracking-tight">Not found</h1>
      <p className="mt-2 text-fg-2">This section or item doesn’t exist. It may have been deleted.</p>
      <Link href="/admin/" className="btn btn-secondary mt-6">
        Back to overview
      </Link>
    </div>
  );
}
