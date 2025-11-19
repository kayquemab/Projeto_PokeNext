import EventCard from "@/components/EventCard";
import MegaEvolucaoInfo from "@/components/MegaEvolucaoInfo";

export default function Home() {
  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center p-6">

      {/* Esquerda: */}
      <div className="w-full md:w-1/2 flex justify-start">
        <EventCard />
      </div>

      {/* Direita: */}
      <div className="w-full md:w-1/2 flex flex-col gap-6">
        {/* Card 1 */}
        <div className="grid grid-cols-1 md:grid-cols-1">
          <MegaEvolucaoInfo />
        </div>

        {/* Card 2 */}
        <div className="grid grid-cols-1 md:grid-cols-1">
          {/* <MegaEvolucaoInfo /> */}
        </div>
      </div>


    </div>
  );
}
