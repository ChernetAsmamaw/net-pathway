"use client";

import { useRouter } from "next/navigation";

import BlogEdit from "@/components/admin/BlogEdit";

export default function NewBlogPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-50">
      <main>
        <BlogEdit onCancel={() => router.push("/admin")} />
      </main>
    </div>
  );
}
