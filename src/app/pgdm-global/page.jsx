"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Container from "../../components/wrappers/Container";
import Heading from "../../components/Heading";
import PgdmProgramTabGlobal from "./PgdmProgramTabGlobal";
import ProjectTab from "../programs/ProjectTab";
import ImgAndBreadcrumb from "../../components/ImgAndBreadcrumb";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { DotPattern } from "@/components/magicui/dot-pattern";
import Magnet from "../../yes/Magnet/Magnet";
import BrochureForm from "../LandingPage/BrochureForm";

const PgdmGlobalPage = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Set initial value
    setIsMobile(window.innerWidth < 768);

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const breadcrumbItems = [
    { href: "/", label: "Home" },
    { href: "/pgdm-global", label: "PGDM Global" },
  ];

  const globalBrochurePath = "/assets/pdfs/PGDM-Global-Brochure.pdf";

  return (
    <div className="relative min-h-screen">
      {/* Download Brochure Side Button */}
      <div className="fixed -right-[4.7rem] sm:-right-[4.2rem] top-[65vh] transform z-[9999] -translate-y-1/2">
        <Magnet
          padding={150}
          disabled={isMobile}
          magnetStrength={20}
          className=""
        >
          <BrochureForm 
            brochurePath={globalBrochurePath}
            brochureTitle="Download PGDM Global Brochure"
          />
        </Magnet>
      </div>
      <ImgAndBreadcrumb
        title={isMobile ? "PGDM Global" : ""}
        imageSrc={isMobile ? "/banners/IMM-Banner-Pdgm-global-mobile.png" : "/banners/IMM-Banner-Pdgm-global.png"}
        imageAlt="Description of the image"
        breadcrumbItems={breadcrumbItems}
      />
      <section className="relative">
        <DotPattern
          glow="true"
          className={cn(
            "[mask-image:radial-gradient(200px_circle_at_center,white,transparent, z-[-99] relative)], hidden md:block"
          )}
        />
        <Container>
          <div className="">
            <Heading
              title="Post Graduate Diploma in Management - Global"
              titleClassName="lg:font-extrabold font-bold text-primary-color"
              subtitle="Our PGDM Global program is designed to provide a comprehensive understanding of modern business practices with international exposure"
              subtitleClassName="text-gray-500 text-justify m-0 lg:text-lg lg:font-normal  text-center mx-auto max-w-4xl backdrop-blur-sm"
              className="w-full text-center sm:col-span-4 pt-12"
            />

            <Tabs defaultValue="pgdm" className="w-full my-2">
              <TabsList className="grid w-full h-full grid-cols-2 ">
                <TabsTrigger
                  value="pgdm"
                  className="data-[state=active]:bg-pink-900 h-10 data-[state=active]:text-white"
                >
                  PGDM
                </TabsTrigger>
                <TabsTrigger
                  value="projects"
                  className="data-[state=active]:bg-pink-900 h-10 data-[state=active]:text-white"
                >
                  Projects
                </TabsTrigger>
              </TabsList>
              <TabsContent value="pgdm" className="mt-6">
                <div className="space-y-8 sm:px-4">
                  <PgdmProgramTabGlobal />
                </div>
              </TabsContent>

              <TabsContent value="curriculum" className="mt-6">
                <ProjectTab />
              </TabsContent>

              <TabsContent value="projects" className="mt-6">
                <div className="space-y-8 sm:px-4">
                  <ProjectTab />
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default PgdmGlobalPage;
