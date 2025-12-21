export default function KantoNewsPage() {
    return (
        <div className="relative w-full flex flex-col max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <main className="min-h-screen bg-white text-gray-900">

                {/* HERO */}
                <section className="container mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                            Explore a Região de <br /> Kanto
                        </h1>
                        <p className="mt-4 text-gray-600 max-w-md">
                            Fique por dentro das últimas notícias, descobertas e acontecimentos
                            das cidades, rotas e ginásios da região mais icônica do mundo Pokémon.
                        </p>
                        <button className="mt-6 px-6 py-3 rounded-xl bg-black text-white hover:bg-gray-800 transition">
                            Ver últimas notícias
                        </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="h-48 bg-gray-200 rounded-2xl flex items-center justify-center text-sm">
                            Cidade de Pallet
                        </div>
                        <div className="h-48 bg-gray-200 rounded-2xl flex items-center justify-center text-sm">
                            Cerulean City
                        </div>
                        <div className="col-span-2 h-56 bg-gray-200 rounded-2xl flex items-center justify-center text-sm">
                            Floresta de Viridian
                        </div>
                    </div>
                </section>

                {/* LOCAIS EM DESTAQUE */}
                <section className="container mx-auto px-6 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Locais em Destaque em Kanto</h2>
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                            Explorar região
                        </button>
                    </div>

                    <div className="flex gap-3 mb-6 flex-wrap text-sm text-gray-600">
                        <span className="px-3 py-1 rounded-full bg-gray-100">Cidades</span>
                        <span className="px-3 py-1 rounded-full bg-gray-100">Ginásios</span>
                        <span className="px-3 py-1 rounded-full bg-gray-100">Rotas</span>
                        <span className="px-3 py-1 rounded-full bg-gray-100">Locais Lendários</span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: "Pewter City", desc: "Ginásio do Brock · Tipo Pedra" },
                            { name: "Cerulean City", desc: "Ginásio da Misty · Tipo Água" },
                            { name: "Lavender Town", desc: "Torre Pokémon · Tipo Fantasma" },
                            { name: "Cinnabar Island", desc: "Ginásio do Blaine · Tipo Fogo" },
                        ].map((place, i) => (
                            <div key={i} className="space-y-3">
                                <div className="h-40 bg-gray-200 rounded-2xl flex items-center justify-center text-sm">
                                    {place.name}
                                </div>
                                <div>
                                    <p className="font-medium">{place.name}</p>
                                    <p className="text-sm text-gray-500">{place.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* ÚLTIMAS NOTÍCIAS */}
                <section className="container mx-auto px-6 py-10">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold">Últimas Notícias de Kanto</h2>
                        <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                            Ver todas
                        </button>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 h-72 bg-gray-200 rounded-2xl p-6 flex items-end">
                            <p className="font-semibold">
                                Atividade incomum registrada na Caverna Cerulean
                            </p>
                        </div>

                        <div className="space-y-4">
                            {[
                                "Ginásio de Cinnabar reabre após atividade vulcânica",
                                "Lt. Surge anuncia batalhas amistosas em Vermilion",
                                "Aumento de Pokémon selvagens na Rota 1",
                            ].map((news, i) => (
                                <div key={i} className="flex gap-4">
                                    <div className="w-24 h-20 bg-gray-200 rounded-xl" />
                                    <div>
                                        <p className="font-medium text-sm">{news}</p>
                                        <p className="text-xs text-gray-500 mt-1">
                                            Relatório oficial da Liga Pokémon
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* TREINADOR EM DESTAQUE */}
                <section className="container mx-auto px-6 py-10">
                    <h2 className="text-2xl font-semibold mb-6">Treinador em Destaque</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-300" />
                                <div>
                                    <p className="font-medium">Treinador Red</p>
                                    <p className="text-sm text-gray-500">
                                        Explorador da Região de Kanto
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-600 text-sm">
                                Uma jornada histórica enfrentando líderes de ginásio,
                                documentando Pokémon raros e eventos importantes para
                                a Liga Pokémon.
                            </p>

                            <button className="px-4 py-2 border rounded-lg hover:bg-gray-100 transition">
                                Ver jornada completa
                            </button>
                        </div>

                        <div className="lg:col-span-2 h-64 bg-gray-200 rounded-2xl relative">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full bg-white shadow flex items-center justify-center">
                                    ▶
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
