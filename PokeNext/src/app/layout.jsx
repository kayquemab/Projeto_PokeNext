// app/layout.js
import { Footer, Navbar } from "@/shared/components";
import "./globals.css";

export const metadata = {
  title: "PokeNext",
  description: "Projeto PokeNext em Next.js com Tailwind CSS",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <head>
        {/* Webicon */}
        <link rel="icon" href="/webicon.png" />
      </head>

      <body className="bg-pokedex-wallpaper">
        <Navbar />
        <div className="relative min-h-screen">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
