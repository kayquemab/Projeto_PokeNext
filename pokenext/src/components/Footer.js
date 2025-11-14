export default function Footer() {
    return (
        <footer className="border-t border-[#E0E0E0] bg-white mt-10">
            <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:px-10 lg:px-20 py-4 sm:flex-row sm:items-center sm:justify-between">
                {/* Texto principal */}
                <div className="text-xs sm:text-sm text-[#666666]">
                    <p className="font-medium text-[#333333]">
                        Pokédex
                    </p>
                    <p>
                        &copy; {new Date().getFullYear()} – Todos os direitos reservados.
                    </p>
                </div>

                {/* Links / navegação extra */}
                <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-[#666666]">
                    <a href="#" className="hover:text-[#E3350D] transition-colors">
                        Termos de uso
                    </a>
                    <span className="hidden sm:inline-block text-[#CCCCCC]">•</span>
                    <a href="#" className="hover:text-[#E3350D] transition-colors">
                        Política de privacidade
                    </a>
                    <span className="hidden sm:inline-block text-[#CCCCCC]">•</span>
                    <a href="#" className="hover:text-[#E3350D] transition-colors">
                        Contato
                    </a>
                </div>
            </div>
        </footer>
    );
}
