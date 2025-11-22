import Eeveelution from "@/components/Eeveelution";          // Componente: Card das Evoluções do Eevee
import EventCard from "@/components/EventCard";              // Componente: Card de eventos
import IniciaisInfo from "@/components/IniciaisInfo";
import MegaEvolucaoInfo from "@/components/MegaEvolucaoInfo"; // Componente: Card de Mega Evolução
import NovoJogoInfo from "@/components/NovoJogo";            // Componente: Card sobre novo jogo anunciado
import PokebolaInfo from "@/components/PokebolaInfo";
import PokedexInfo from "@/components/PokedexInfo";          // Componente: Card de Pokédex

export default function Home() {
  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center p-6">

      {/* COLUNA ESQUERDA */}
      <div className="w-full md:w-1/2 flex flex-col gap-2">

        {/* Componente: Card de Evento */}
        <EventCard />

        {/* Componente: Card do Novo Jogo */}
        <NovoJogoInfo />

      </div>

      {/* COLUNA DIREITA */}
      <div className="w-full md:w-1/2 flex flex-col gap-2">

        {/* LINHA 1 — MEGA + POKEDEX */}
        <div className="flex flex-wrap gap-2 p-0 m-0">

          {/* Componente: Mega Evolução */}
          <div className="w-[52%]">
            <MegaEvolucaoInfo />
          </div>

          {/* Componente: Pokédex */}
          <div className="w-[36%]">
            <PokedexInfo />
          </div>

        </div>

        {/* LINHA 2 — EEVEE + COLUNA MEGA/POKEDEX */}
        <div className="flex gap-2 p-0 m-0">

          {/* Componente: Eeveelutions */}
          <div className="w-[52%]">
            <Eeveelution />
          </div>

          {/* Coluna com Mega + Pokédex */}
          <div className="w-[36%] flex flex-col gap-2">

            {/* Componente: Mega Evolução (versão pequena) */}
            <div className="w-full">
              <PokebolaInfo />
            </div>

            {/* Componente: Pokédex (versão pequena) */}
            <div className="w-full">
              <IniciaisInfo />
            </div>
            
          </div>

        </div>

      </div>

    </div>
  );
}
