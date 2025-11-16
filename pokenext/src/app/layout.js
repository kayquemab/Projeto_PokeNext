import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata = {
  title: "PokeNext",
  description: "Projeto PokeNext em Next.js com Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="h-screen">
      <body className="min-h-screen bg-gray-100 text-slate-900 flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
