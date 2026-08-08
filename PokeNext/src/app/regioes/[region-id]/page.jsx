import { RegionDetailPage } from "@/features/regions";

export default async function Page({ params }) {
  const { "region-id": regionId } = await params;

  return <RegionDetailPage regionId={regionId} />;
}
