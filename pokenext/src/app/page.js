import Eeveelution from "@/components/Eeveelution";        
import EventCard from "@/components/EventCard";            
import IniciaisInfo from "@/components/IniciaisInfo";
import MegaEvolucaoInfo from "@/components/MegaEvolucaoInfo"; 
import NovoJogoInfo from "@/components/NovoJogo";           
import PokebolaInfo from "@/components/PokebolaInfo";
import PokedexInfo from "@/components/PokedexInfo";          
import PokemonCarousel from "@/components/PokemonCarousel";

export default function Home() {
  return (

    <div className="w-full flex flex-col items-center p-6">

      {/* WRAPPER DAS DUAS COLUNAS */}
      <div className="w-full flex flex-col md:flex-row items-start justify-center gap-4">

        {/* COLUNA ESQUERDA */}
        <div className="w-full md:w-1/2 flex flex-col gap-2">
          <EventCard />
          <NovoJogoInfo />
        </div>

        {/* COLUNA DIREITA */}
        <div className="w-full md:w-1/2 flex flex-col gap-2">

          {/* LINHA 1 */}
          <div className="flex flex-wrap gap-2 p-0 m-0">
            <div className="w-[52%]"><MegaEvolucaoInfo /></div>
            <div className="w-[36%]"><PokedexInfo /></div>
          </div>

          {/* LINHA 2 */}
          <div className="flex gap-2 p-0 m-0">

            <div className="w-[52%]"><Eeveelution /></div>

            <div className="w-[36%] flex flex-col gap-2">
              <PokebolaInfo />
              <IniciaisInfo />
            </div>
            
          </div>

        </div>

      </div>

      {/* CAROUSEL — AGORA EMBAIXO DE TUDO */}
      <div className="w-full px-7">
        <PokemonCarousel />
      </div>

    </div>

  );
}
