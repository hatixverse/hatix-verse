import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Shared frame for inner pages (product and service pages, legal pages).
export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div id="top">
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
    </div>
  );
}
