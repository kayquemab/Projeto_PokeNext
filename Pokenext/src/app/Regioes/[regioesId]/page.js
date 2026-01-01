"use client";

import { useParams } from "next/navigation";
import Image from "next/image";


export default function RegioesPage() {
    const { regioesId } = useParams();

    const nomeRegiao =
        regioesId.charAt(0).toUpperCase() + regioesId.slice(1);

    return (
        <div>

            <main className="relative w-full h-screen overflow-hidden">

                {/* TEXTO — SEM ALTERAR DESIGN EXISTENTE */}
                <div className="absolute left-[8%] top-[35%] z-10">
                    <p className="text-[#2B3A4A] text-lg">Região de:</p>
                    <p className="text-[#2B3A4A] text-5xl font-medium">
                        {nomeRegiao}
                    </p>
                </div>

                <div className="relative mx-auto w-[92%] h-full overflow-hidden">
                    <Image
                        src="/mapa.jpg"
                        alt="Mapa do mundo Pokémon"
                        fill
                        priority
                        className="object-cover"
                    />
                </div>

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

                {/* imagem 3 — DINÂMICA, MESMO DESIGN */}
                <div className="absolute left-[80%] top-[26%] w-40 h-[260px] z-10">
                    <Image
                        src={`/silhueta/${regioesId}.jpeg`}
                        alt={`Silhueta da região de ${nomeRegiao}`}
                        fill
                        className="object-cover rounded-lg shadow-lg"
                    />
                </div>
            </main>

        </div>
    );
}
