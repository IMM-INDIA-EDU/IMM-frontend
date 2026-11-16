"use client";

import PgdmFeaturesGlobal from "./PgdmFeaturesGlobal";

import { useState } from "react";
import { ArrowRight, ArrowUp } from "lucide-react";

import SemesterTabPgdmGlobalMobile from "../programs/SemesterTabPgdmGlobalMobile";
import CurriculumTabsPgdmGlobal from "../programs/CurriculumTabsPgdmGlobal";
import CurriculumTabsPgdmGlobalMobile from "../programs/CurriculumTabsPgdmGlobalMobile";
import InternationalCampusImmersion from "./InternationalCampusImmersion";
import PgdmSpecializationPgdmGlobal from "../programs/PgdmSpecializationPgdmGlobal";
import SemesterTabPgdmGlobal from "../programs/SemesterTabPgdmGlobal";

const PgdmProgramGlobal = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <section className=" ">
      <div className="space-y-4">
        <h1 className="sm:text-4xl text-3xl font-bold text-pink-900 mb-6 drop-shadow-md backdrop-blur-sm w-fit">
          PGDM Program with Dual Specialization
        </h1>
        <p className="text-gray-600 text-base backdrop-blur-sm">
          IMM is one of the most premium Business Schools for PGDM in Delhi. The
          two-year full-time Post Graduate Diploma in Management (PGDM), is the
          flagship programme of IMM-Business School.
        </p>
        {isOpen && (
          <>
            <p className="text-gray-600 text-base backdrop-blur-sm">
              Its main objective is to develop young men and women into
              competent professional managers, capable of working in any sector
              of organized activity, learning leadership skills and achieving
              excellence in performance while contributing to the welfare of the
              larger society.
            </p>
            <p className="text-gray-600 text-base backdrop-blur-sm">
              Students learn to sharpen their managerial skills, open their
              minds to appreciate diverse managerial perspectives, creatively
              find innovative solutions to problems, and analyse different
              career options in a new way of working.
            </p>
          </>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-primary-color flex group items-center  animate-pulse"
        >
          {isOpen ? "Read Less" : "Read More"}
          {isOpen ? (
            <ArrowUp className="ml-1 mt-1 h-4 w-4 group-hover:rotate-90 group-hover:ml-2 transition-all duration-300" />
          ) : (
            <ArrowRight className="ml-1 mt-1 h-4 w-4 group-hover:rotate-90 group-hover:ml-2 transition-all duration-300" />
          )}
        </button>
      </div>
      
      {/* International Campus Immersion Section - Added after PGDM Program with Dual Specialization */}
      <InternationalCampusImmersion />
      
      <div className="sm:hidden mt-10 sm:mt-20">
        <CurriculumTabsPgdmGlobalMobile />
      </div>
      <div className="hidden sm:block mt-10 sm:mt-20">
        <CurriculumTabsPgdmGlobal />
      </div>
      <div className="mt-8 max-w-4xl">
        <p className="text-gray-600 text-base backdrop-blur-sm leading-relaxed">
          Students select two specializations from seven available options at the beginning of Semester 2. Each specialization is a mix of different subjects, offering a comprehensive understanding and expertise in the chosen domains. This flexible structure enables students to tailor their learning journey to align with their career aspirations.
        </p>
        <p className="text-gray-500 text-sm mt-4 italic backdrop-blur-sm">
          *The Curriculum may be modified by IMM Academic Committee as per requirement of Industry's dynamics
        </p>
      </div>
      <div className=" pt-10 grid sm:grid-cols-2 gap-4">
        <div className="order-2 sm:order-1">
          <PgdmSpecializationPgdmGlobal />
        </div>
        <div className="order-1 sm:order-2 sm:pt- grid justify-center items-center">
          <div className="text-justify sm:text-left lg:px-20">
            <p className="text-gray-700 font-semibold text-center sm:text-left uppercase tracking-wider">
              SPECIALIZATIONS
            </p>
            <h1 className="text-4xl text-center sm:text-left md:text-7xl leading-tight font-bold uppercase tracking-wide text-black">
              FUTURE <span className="text-pink-900">READY</span>
            </h1>
            <p className=" text-lg sm:text-xl leading-normal opacity-75 mt-4 mb-6 backdrop-blur-sm">
              Our PGDM program offers cutting edge specializations in emerging
              technologies and modern business practices.
            </p>
            <p className="opacity-50 text-sm lg:mx backdrop-blur-sm">
            We offer seven future focused specializations including Marketing, Human Resources, Finance, Operations, International Business, Business Analytics, and Entrepreneurship. These are supported by a range of globally recognized certifications. The curriculum is designed to connect technology with real business strategy so that students are prepared for today’s fast changing digital world.

You will gain hands on experience through dynamic data visualization using Power BI, practical data analysis with Python and R, and immersive learning experiences in the metaverse. By the time you graduate, you will have the practical skills, confidence, and innovative thinking required to succeed and lead in a data driven environment.
            </p>
          </div>
        </div>
      </div>
      <div className=" mt-10 sm:mt-20">
        <PgdmFeaturesGlobal />
      </div>
      <div className="sm:hidden mt-10 sm:mt-20">
        <SemesterTabPgdmGlobalMobile />
      </div>
      <div className="hidden sm:block mt-10 sm:mt-20">
        <SemesterTabPgdmGlobal />
      </div>
   
    </section>
  );
};

export default PgdmProgramGlobal;
