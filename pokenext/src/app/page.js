import EventCard from "@/components/EventCard";
import MegaEvolucaoInfo from "@/components/MegaEvolucaoInfo";

export default function Home() {
  return (
    <div className="w-full flex flex-col md:flex-row items-start justify-center gap-8 p-6">

      {/* Card grande à esquerda */}
      <div className="flex-1 flex justify-start">
        <EventCard />
      </div>

      {/* Card pequeno à direita */}
      <div className="shrink-0 flex flex-col justify-end gap-4">
        <MegaEvolucaoInfo />
        <MegaEvolucaoInfo />
      </div>


    </div>
  );
}
