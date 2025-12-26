
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
    <div>

      <h1
        className="
          text-2xl sm:text-3xl
          font-normal tracking-tight text-neutral-700
          text-left
          ml-5 sm:ml-6 md:ml-10 lg:ml-16
        "
      >
        PokeNext
      </h1>

      <div className="w-full flex flex-col items-center p-6">

        {/* PRIMEIRA LINHA */}
        <div className="w-full flex flex-col lg:flex-row gap-4">

          {/* EventCard */}
          <div className="w-full lg:w-2/4">
            <EventCard />
          </div>

        </div>

        {/* CAROUSEL */}
        <div className="w-full px-2 md:px-7 mt-4">
          <PokemonCarousel />
        </div>

      </div>
    </div>
  );
}











