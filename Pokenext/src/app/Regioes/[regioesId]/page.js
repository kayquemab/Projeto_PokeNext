"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function RegioesPage() {
    const router = useRouter();
    return (
        <div>
            <main className="relative w-full h-screen overflow-hidden">

                {/* 🗺️ MAPA DE FUNDO */}
                <Image
                    src="/mapa.jpg"
                    alt="Mapa do mundo Pokémon"
                    fill
                    priority
                    className="object-cover"
                />

                {/* imagem 1 */}
                <div className="absolute left-[58%] top-[3%] w-[170px] h-[300px] z-10">
                    <Image
                        src="/Pokemon League.jpg"
                        alt="Pokemon League"
                        fill
                        className="object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* imagem 2 */}
                <div className="absolute left-[40%] top-[60%] w-[130px] h-[190px] z-10">
                    <Image
                        src="/pikachu_card.jpg"
                        alt="Pikachu Card"
                        fill
                        className="object-cover rounded-lg shadow-lg"
                    />
                </div>

                {/* imagem 3 */}
                <div className="absolute left-[80%] top-[26%] w-40 h-[260px] z-10">
                    <Image
                        src="/silhueta/kanto.jpeg"
                        alt="Silhueta da região de Kanto"
                        fill
                        className="object-cover rounded-lg shadow-lg"
                    />
                </div>
            </main>

            
        </div>
    );
}
