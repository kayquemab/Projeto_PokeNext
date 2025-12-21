"use client";

export default function Kanto() {
    return (
        <div className="relative w-full text-zinc-200">

            {/* HERO */}
            <section className="w-full mt-10 px-10 lg:px-8 mb-16">
                <h1 className="text-4xl font-bold mb-4">
                    Região de Kanto
                </h1>

                <p className="text-red/80 max-w-3xl">
                    O ponto de partida de milhões de treinadores ao redor do mundo.
                    Kanto é a primeira região apresentada na franquia Pokémon,
                    onde a aventura começou e a lenda nasceu.
                </p>
            </section>

            {/* VISÃO GERAL */}
            <section className="px-10 lg:px-8 mb-16">
                <h2 className="text-2xl font-semibold mb-6">
                    Visão geral
                </h2>

                <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    <li className="bg-neutral-900/60 p-4 rounded-lg">
                        🌍 <span className="font-semibold">Região:</span> Kanto
                    </li>
                    <li className="bg-neutral-900/60 p-4 rounded-lg">
                        🎮 <span className="font-semibold">Geração:</span> I
                    </li>
                    <li className="bg-neutral-900/60 p-4 rounded-lg">
                        🧬 <span className="font-semibold">Pokémon nativos:</span> 151
                    </li>
                    <li className="bg-neutral-900/60 p-4 rounded-lg">
                        🏆 <span className="font-semibold">Liga Pokémon:</span> Indigo Plateau
                    </li>
                </ul>
            </section>

            {/* POKÉMON INICIAIS */}
            <section className="px-10 lg:px-8 mb-20">
                <h2 className="text-2xl font-semibold mb-6">
                    Pokémon Iniciais
                </h2>

                <p className="text-zinc-400 mb-8 max-w-3xl">
                    Todo treinador que inicia sua jornada em Kanto escolhe um entre três Pokémon,
                    cada um representando um caminho diferente de batalha e estratégia.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
                    <div className="bg-neutral-900/60 p-6 rounded-lg">
                        🌱
                        <h3 className="font-semibold mt-2">Bulbasaur</h3>
                        <p className="text-sm text-zinc-400 mt-1">
                            Tipo Grama/Veneno. Equilibrado e resistente,
                            cresce junto com seu treinador.
                        </p>
                    </div>

                    <div className="bg-neutral-900/60 p-6 rounded-lg">
                        🔥
                        <h3 className="font-semibold mt-2">Charmander</h3>
                        <p className="text-sm text-zinc-400 mt-1">
                            Tipo Fogo. Frágil no início, mas extremamente poderoso
                            em sua evolução final.
                        </p>
                    </div>

                    <div className="bg-neutral-900/60 p-6 rounded-lg">
                        💧
                        <h3 className="font-semibold mt-2">Squirtle</h3>
                        <p className="text-sm text-zinc-400 mt-1">
                            Tipo Água. Defensivo e confiável,
                            ideal para batalhas estratégicas.
                        </p>
                    </div>
                </div>
            </section>

            {/* CIDADES E GINÁSIOS */}
            <section className="px-10 lg:px-8 mb-20">
                <h2 className="text-2xl font-semibold mb-6">
                    Cidades e Ginásios
                </h2>

                <p className="text-zinc-400 mb-8 max-w-3xl">
                    Kanto é composta por cidades icônicas, cada uma com sua identidade,
                    desafios únicos e líderes de ginásio que testam as habilidades
                    dos treinadores.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-sm">
                    {[
                        "Pewter City — Brock (Pedra)",
                        "Cerulean City — Misty (Água)",
                        "Vermilion City — Lt. Surge (Elétrico)",
                        "Celadon City — Erika (Grama)",
                        "Fuchsia City — Koga (Venenoso)",
                        "Saffron City — Sabrina (Psíquico)",
                        "Cinnabar Island — Blaine (Fogo)",
                        "Viridian City — Giovanni (Terra)",
                    ].map((city) => (
                        <div
                            key={city}
                            className="bg-neutral-900/60 p-4 rounded-lg"
                        >
                            {city}
                        </div>
                    ))}
                </div>
            </section>

            {/* INSÍGNIAS */}
            <section className="px-10 lg:px-8 mb-20">
                <h2 className="text-2xl font-semibold mb-6">
                    Insígnias de Kanto
                </h2>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6 text-center text-sm">
                    {[
                        "Boulder",
                        "Cascade",
                        "Thunder",
                        "Rainbow",
                        "Soul",
                        "Marsh",
                        "Volcano",
                        "Earth",
                    ].map((badge) => (
                        <div
                            key={badge}
                            className="bg-neutral-900/60 p-4 rounded-lg"
                        >
                            🏅
                            <p className="mt-2">{badge}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* LENDÁRIOS */}
            <section className="px-10 lg:px-8 mb-20">
                <h2 className="text-2xl font-semibold mb-6">
                    Pokémon Lendários e Míticos
                </h2>

                <p className="text-zinc-400 mb-8 max-w-3xl">
                    Lendas antigas falam de Pokémon extremamente raros,
                    escondidos em locais remotos e protegidos por desafios intensos.
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6 text-center">
                    {[
                        { name: "Articuno", emoji: "❄️" },
                        { name: "Zapdos", emoji: "⚡" },
                        { name: "Moltres", emoji: "🔥" },
                        { name: "Mewtwo", emoji: "🧬" },
                        { name: "Mew", emoji: "✨" },
                    ].map((pokemon) => (
                        <div
                            key={pokemon.name}
                            className="bg-neutral-900/60 p-6 rounded-lg"
                        >
                            <div className="text-3xl mb-2">{pokemon.emoji}</div>
                            <p className="font-semibold">{pokemon.name}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* EQUIPE ROCKET */}
            <section className="px-10 lg:px-8 mb-20">
                <h2 className="text-2xl font-semibold mb-6">
                    Team Rocket
                </h2>

                <p className="text-zinc-400 max-w-3xl">
                    Atuando nas sombras de Kanto, a Team Rocket busca explorar Pokémon
                    para ganho próprio. Liderada por Giovanni, a organização criminosa
                    está presente em diversos pontos da região, incluindo ginásios,
                    cassinos e esconderijos secretos.
                </p>
            </section>

            {/* ENCERRAMENTO  */}
            <section className="px-10 lg:px-8 mb-24">
                <p className="text-zinc-400 max-w-3xl italic">


                    Kanto não é apenas uma região — é o início de uma lenda.
                    Cada cidade, cada rota e cada batalha carregam a essência
                    do que significa ser um Treinador Pokémon.

                    
                </p>
            </section>

        </div>
    );
}

