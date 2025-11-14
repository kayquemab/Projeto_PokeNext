"use client";

import Link from "next/link";

export default function Navbar() {
    return (
        <header className="flex items-center justify-between whitespace-nowrap border-b border-[#E0E0E0] bg-white px-4 sm:px-10 lg:px-20 py-3">
            {/* Logo + título */}
            <div className="flex items-center gap-4 text-[#333333]">
                <div className="size-8 text-[#E3350D]">
                    <svg
                        fill="none"
                        viewBox="0 0 48 48"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4ZM24 38C16.268 38 10 31.732 10 24C10 16.268 16.268 10 24 10C31.732 10 38 16.268 38 24C38 31.732 31.732 38 24 38Z"
                            fill="currentColor"
                        />
                        <path
                            d="M24 30C27.3137 30 30 27.3137 30 24C30 20.6863 27.3137 18 24 18C20.6863 18 18 20.6863 18 24C18 27.3137 20.6863 30 24 30Z"
                            fill="currentColor"
                        />
                        <path
                            d="M0 24H48"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                    </svg>
                </div>
                <h2 className="text-lg font-bold leading-tight tracking-[-0.015em]">
                    Pokédex
                </h2>
            </div>

            {/* Menu de navegação */}
            <div className="flex flex-1 justify-end items-center gap-8">
                <div className="flex items-center gap-9">
                    <Link
                        href="/"
                        className="text-sm font-medium leading-normal text-[#333333] hover:text-[#E3350D] transition-colors"
                    >
                        Home
                    </Link>
                    <Link
                        href="/pokedex"
                        className="text-sm font-medium leading-normal text-[#333333] hover:text-[#E3350D] transition-colors"
                    >
                        Pokédex
                    </Link>
                    <Link
                        href="/regions"
                        className="text-sm font-medium leading-normal text-[#333333] hover:text-[#E3350D] transition-colors"
                    >
                        Regions
                    </Link>
                    <Link
                        href="/favorites"
                        className="text-sm font-medium leading-normal text-[#333333] hover:text-[#E3350D] transition-colors"
                    >
                        Favorites
                    </Link>
                </div>
            </div>
        </header>
    );
}
