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

    ml-5
    sm:ml-6
    md:ml-10
    lg:ml-16
  "
      >
        PokeNext
      </h1>







      {/* <div className="w-full flex flex-col items-center p-6">


        <div className="w-full flex flex-col md:flex-row items-start justify-center gap-4">


          <div className="w-full md:w-1/2 flex flex-col gap-2">
            <EventCard />
            <NovoJogoInfo />
          </div>


          <div className="w-full md:w-1/2 flex flex-col gap-2">


            <div className="flex flex-wrap gap-2 p-0 m-0">
              <div className="w-[52%]"><MegaEvolucaoInfo /></div>
              <div className="w-[36%]"><PokedexInfo /></div>
            </div>


            <div className="flex gap-2 p-0 m-0">

              <div className="w-[52%]"><Eeveelution /></div>

              <div className="w-[36%] flex flex-col gap-2">
                <PokebolaInfo />
                <IniciaisInfo />
              </div>

            </div>

          </div>

        </div>


        <div className="w-full px-7">
          <PokemonCarousel />
        </div>

      </div> */}

    </div>
  );
}


