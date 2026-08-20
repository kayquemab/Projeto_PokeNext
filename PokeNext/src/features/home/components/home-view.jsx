import { Suspense } from "react";
import Eeveelution from "./eeveelution";
import EventCard from "./event-card";
import IniciaisInfo from "./iniciais-info";
import MegaEvolucaoInfo from "./mega-evolucao-info";
import NovoJogoInfo from "./novo-jogo";
import PokebolaInfo from "./pokebola-info";
import PokedexInfo from "./pokedex-info";
import FeaturedPokemonCarousel from "./featured-pokemon-carousel";

function PokemonCarouselFallback() {
  return (
    <div className="w-full h-[350px] pb-10 pt-8 lg:pt-0" aria-label="Carregando Pokémon em destaque">
      <div className="mx-auto h-11 w-64 animate-pulse bg-neutral-800/80" />
      <div className="mt-4 h-[290px] w-full animate-pulse bg-neutral-300/40" />
    </div>
  );
}

export default function Home() {
  return (
    <div>
      <h1
        className="
          text-2xl sm:text-3xl
          font-normal tracking-tight text-neutral-700
          text-left
          ml-5 sm:ml-10 md:ml-10 lg:ml-16
        "
      >
        PokeNext
      </h1>

      <div className="w-full flex flex-col items-center pt-6 px-6 sm:px-20">

        {/* GRID PRINCIPAL */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-4">

          {/* COLUNA ESQUERDA */}
          <div className="flex flex-col lg:col-span-2 gap-4">
            <EventCard />
            <NovoJogoInfo />
          </div>

          {/* COLUNA DIREITA */}
          <div className="grid grid-cols-1 lg:grid-cols-2 lg:col-span-2 gap-4">
            <div className="flex flex-col gap-4">
              <MegaEvolucaoInfo />
              <Eeveelution />
            </div>

            <div className="flex flex-col gap-4">
              <PokedexInfo />
              <PokebolaInfo />
              <IniciaisInfo />
            </div>
          </div>
        </div>
      </div>

      {/* Carrousel - final */}
      <div className="w-full flex flex-col items-center px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:px-14">
        <div className="w-full">
          <Suspense fallback={<PokemonCarouselFallback />}>
            <FeaturedPokemonCarousel />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
