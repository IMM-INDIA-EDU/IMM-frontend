import { generateMetadataForPath } from "@/lib/metadata";
import Schema from "../../../components/Schema";
import { generateEventsPageSchema } from "@/lib/schema";

export async function generateMetadata() {
  return generateMetadataForPath("/life-at-imm/events-and-activities");
}

export default function EventsAndActivitiesLayout({ children }) {
  const eventsSchema = generateEventsPageSchema();
  return (
    <>
      <Schema schema={eventsSchema} />
      {children}
    </>
  );
}
