import { generateMetadataForPath } from "@/lib/metadata";
import Schema from "../../components/Schema";
import { generateAboutPageSchema } from "@/lib/schema";

export async function generateMetadata() {
  return generateMetadataForPath("/about");
}

export default function AboutLayout({ children }) {
  const aboutSchema = generateAboutPageSchema();
  return (
    <>
      <Schema schema={aboutSchema} />
      {children}
    </>
  );
}
