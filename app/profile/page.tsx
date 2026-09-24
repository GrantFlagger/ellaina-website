import type { Metadata } from "next";
import Profile from "@/components/Profile";
import { noindexMetadata } from "@/lib/seo";

export const metadata: Metadata = noindexMetadata("Ο Λογαριασμός μου");

export default function ProfilePage() {
  return (
    <main>
      <Profile />
    </main>
  );
}