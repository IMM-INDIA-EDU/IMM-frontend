import { generateMetadataForPath } from "@/lib/metadata";
import Schema from "../../components/Schema";
import { generatePlacementSchema } from "@/lib/schema";

export async function generateMetadata() {
  return generateMetadataForPath("/placements");
}

export default function PlacementsLayout({ children }) {
  const placementSchema = generatePlacementSchema();
  return (
    <>
      <Schema schema={placementSchema} />
      {children}
    </>
  );
}
