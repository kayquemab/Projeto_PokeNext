import EventCard from "@/components/EventCard";
import MegaEvolucaoInfo from "@/components/MegaEvolucaoInfo";
import PokedexInfo from "@/components/PokedexInfo";

export default function Home() {
  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center p-6">

      {/* Esquerda: */}
      <div className="w-full md:w-1/2 flex justify-start">
        <EventCard />
      </div>

      {/* Direita: */}
      <div className="w-full md:w-1/2 flex flex-col">

        {/* Container dos cards */}
        <div className="flex flex-wrap p-0 m-0">
          <MegaEvolucaoInfo />
          <PokedexInfo />
        </div>



        {/* Card 2 */}
        {/* <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <PokedexInfo />
        </div> */}
      </div>


    </div>
  );
}
