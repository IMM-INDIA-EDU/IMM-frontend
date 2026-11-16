import { generateMetadataForPath } from "@/lib/metadata";
import Schema from "../../components/Schema";
import { generateAdmissionSchema } from "@/lib/schema";

export async function generateMetadata() {
  return generateMetadataForPath("/admissions");
}

export default function AdmissionsLayout({ children }) {
  const admissionSchema = generateAdmissionSchema();
  return (
    <>
      <Schema schema={admissionSchema} />
      {children}
    </>
  );
}
