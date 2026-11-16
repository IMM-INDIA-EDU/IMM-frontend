import { generateMetadataForPath } from "@/lib/metadata";

export async function generateMetadata() {
  return generateMetadataForPath("/pgdm-global");
}

export default function PgdmGlobalLayout({ children }) {
  return children;
}
