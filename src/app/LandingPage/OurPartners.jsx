
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";

import Heading from "../../components/Heading";
import InternationalPartner from "./InternationalPartner";
import NationalPartners from "./NationalPartners";
import { AccreditationLogoMobile } from "./AccreditationLogoMobile";

const EU = "/assets/partners/EU.png";
const IIT = "/assets/partners/iit.png";

const AACSB = "/assets/accreditationLogo/AACSB.webp";
const AICTE = "/assets/accreditationLogo/AICTE.webp";
const AMDISA = "/assets/accreditationLogo/AMDISA.webp";
const AUAP = "/assets/accreditationLogo/AUAP.webp";
const GGU = "/assets/accreditationLogo/GGU.webp";

export default function OurPartners() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);

  const isHeadingInView = useInView(headingRef, {
    once: true,
    amount: 0.5,
  });

  // International partner data
  const internationalPartner = {
    id: 0,
    name: "European Global Institute of Innovation & Technology (EU Global)",
    logo: EU,
    description:
      "The European Global Institute of Innovation & Technology, also known as European Global Varsity (EU Global), is a prestigious institution based in Malta, Europe.",
    website: "/about/imm-partners",
    category: "Education",
  };

  // National partner data
  const nationalPartners = [
    {
      id: 1,
      name: "IIT Ropar",
      logo: IIT,
      category: "Education",
      fullDescription:
        "The Indian Institute of Technology Ropar (IIT Ropar) is a premier engineering institution in Punjab. The Government of India has officially designated IIT Ropar as a Centre of Excellence in AI, recognizing it as one of the top four institutes leading India's AI revolution. This landmark initiative, reported by the Economic Times, cements IIT Ropar's position at the forefront of AI and innovation, and IMM students will be direct beneficiaries of this elite status.",
      website: "/about/imm-partners",
    },
  ];

  const accreditationLogos = [
    { src: AICTE, alt: "AICTE" },
    { src: AUAP, alt: "AUAP" },
    { src: AACSB, alt: "AACSB" },
    { src: AMDISA, alt: "AMDISA" },
    { src: GGU, alt: "GGU" },
  ];

  return (
    <>
      {/* Accreditation Logos */}
      <div className="relative bg-gradient-to-br from-gray-400 via-gray-100 to-gray-400">
        <div className="block sm:hidden">
          <AccreditationLogoMobile />
        </div>

        <div className="hidden sm:flex justify-center items-center flex-wrap gap-4 p-5">
          {accreditationLogos.map((logo) => (
            <div
              key={logo.alt}
              className="h-36 w-36 bg-white rounded-lg p-5 flex items-center justify-center"
            >
              <Image
                src={logo.src}
                alt={logo.alt}
                width={144}
                height={144}
                className="w-full h-full object-contain hover:-translate-y-2 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Academic Partners */}
      <section
        ref={sectionRef}
        className="bg-gradient-to-t from-primary-color justify-center via-pink-700 to-primary-color lg:py-16 md:py-12 py-8 sm:px-0 px-6"
      >
        <div className="container mx-auto sm:max-w-5xl md:max-w-6xl lg:max-w-7xl">
          {/* Heading */}
          <motion.div
            ref={headingRef}
            className="mb-8 sm:mb-10 text-center"
            initial={{ opacity: 0, y: 50 }}
            animate={{
              opacity: isHeadingInView ? 1 : 0,
              y: isHeadingInView ? 0 : 50,
            }}
            transition={{
              duration: 0.8,
              ease: "easeOut",
            }}
          >
            <Heading
              title="Academic Partners"
              titleClassName="text-center text-2xl font-bold text-white md:text-3xl"
              className="block lg:pb-0 sm:pb-0 mx-auto w-full text-left sm:col-span-4"
              subtitle="Our academic partners are some of the best in the world, and we are proud to have them on board."
              subtitleClassName="text-center text-white/80 text-sm md:text-base"
            />
          </motion.div>

          {/* Partner Sections */}
          <div className="flex flex-col items-center justify-center w-full gap-10 sm:gap-20">
            {/* International Partner */}
            <div className="w-full flex justify-center items-center">
              <InternationalPartner partner={internationalPartner} />
            </div>

            {/* National Partners - Center Aligned */}
            <div className="w-full flex justify-center items-center">
              <div className="w-full flex justify-center items-center">
                <NationalPartners partners={nationalPartners} />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
