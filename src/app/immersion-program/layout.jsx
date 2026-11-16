import { generateMetadataForPath } from "@/lib/metadata";

export async function generateMetadata() {
  return generateMetadataForPath("/immersion-program");
}

export default function ImmersionProgramLayout({ children }) {
  return children;
}
