import { generateMetadataForPath } from "@/lib/metadata";
import Schema from "../../components/Schema";
import { generateContactPageSchema } from "@/lib/schema";

export async function generateMetadata() {
  return generateMetadataForPath("/contact-us");
}

export default function ContactUsLayout({ children }) {
  const contactSchema = generateContactPageSchema();
  return (
    <>
      <Schema schema={contactSchema} />
      {children}
    </>
  );
}
