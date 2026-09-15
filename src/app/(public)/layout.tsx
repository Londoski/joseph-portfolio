import { Navbar } from "@/components/public/Navbar";
import { Footer } from "@/components/public/Footer";
import { PageViewTracker } from "@/components/public/PageViewTracker";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-base w-full overflow-x-hidden">
      <PageViewTracker />
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      <Footer />
    </div>
  );
}