import { MoveDetailPage } from "@/features/moves";

export default async function Page({ params }) {
  const { "move-id": moveId } = await params;

  return <MoveDetailPage moveId={moveId} />;
}
