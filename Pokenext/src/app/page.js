
import Eeveelution from "@/components/Eeveelution";
import EventCard from "@/components/EventCard";
import IniciaisInfo from "@/components/IniciaisInfo";
import MegaEvolucaoInfo from "@/components/MegaEvolucaoInfo";
import NovoJogoInfo from "@/components/NovoJogo";
import PokebolaInfo from "@/components/PokebolaInfo";
import PokedexInfo from "@/components/PokedexInfo";
import PokemonCarousel from "@/components/PokemonCarousel";
import Teste from "@/components/teste";

export default function Home() {
  return (
    <div>

      <h1
        className="
    text-2xl sm:text-3xl
    font-normal tracking-tight text-neutral-700
    text-left

    ml-5
    sm:ml-6
    md:ml-10
    lg:ml-16
  "
      >
        PokeNext
      </h1>

      <div className="w-full flex flex-col items-center py-6 px-14">

        {/* PRIMEIRA LINHA */}
        <div className="w-full flex flex-col lg:flex-row gap-2 ">

          {/* EventCard */}
          <div className="w-full lg:w-2/4">
            <EventCard />
          </div>


          {/* MegaEvolucaoInfo */}
          <div className="w-full lg:w-1/4">
            <MegaEvolucaoInfo />
          </div>

          {/* PokedexInfo */}
          <div className="w-full lg:w-1/4">
            <PokedexInfo />
          </div>

        </div>

        {/* SEGUNDA LINHA EM CONSTRUÇÃO */}
      </div>


      <div className="w-full flex flex-col items-center py-6 px-6">

        <div className="w-full lg:px-7">
          <PokemonCarousel />
        </div>

      </div>

    </div>
  );
}













