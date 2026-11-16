import { generateMetadataForPath } from "@/lib/metadata";
import Schema from "../../components/Schema";
import { generateProgramsSchema } from "@/lib/schema";

export async function generateMetadata() {
  return generateMetadataForPath("/programs");
}

export default function ProgramsLayout({ children }) {
  const programsSchema = generateProgramsSchema();
  return (
    <>
      <Schema schema={programsSchema} />
      {children}
    </>
  );
}
