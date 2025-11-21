import EventCard from "@/components/EventCard";
import MegaEvolucaoInfo from "@/components/MegaEvolucaoInfo";
import NovoJogoInfo from "@/components/NovoJogo";
import PokedexInfo from "@/components/PokedexInfo";

export default function Home() {
  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center p-6">

      {/* Esquerda */}
      <div className="w-full md:w-1/2 flex justify-start">
        <EventCard />
      </div>

      {/* Direita */}
      <div className="w-full md:w-1/2 flex flex-col gap-2">

        {/* Cards lado a lado */}
        <div className="flex flex-wrap gap-2 p-0 m-0">

          {/* Card 1 */}
          <div className="w-[52%]"><MegaEvolucaoInfo /></div>

          {/* Card 2 */}
          <div className="w-[36%]"><PokedexInfo /></div>

        </div>

        {/* Cards lado a lado */}
        <div className="flex flex-wrap gap-2 p-0 m-0">

          {/* Card 1 */}
          <div className="w-full"><NovoJogoInfo /></div>

        </div>

      </div>

    </div>
  );
}
