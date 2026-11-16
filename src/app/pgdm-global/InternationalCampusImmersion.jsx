"use client";
import Image from "next/image";
import Heading from "../../components/Heading";

const universities = [
  {
    id: 1,
    name: "University of Oxford",
    image: "/assets/partners/pgdm-global/UniversityofOxford.jpg",
  },
  {
    id: 2,
    name: "COLUMBIA UNIVERSITY",
    image: "/assets/partners/pgdm-global/ColumbiaUniverstiy.jpeg",
  },
  {
    id: 3,
    name: "University of Warwick",
    image: "/assets/partners/pgdm-global/UniversityOfWarwick.jpeg",
  },
  {
    id: 4,
    name: "Emlyon Business School",
    image: "/assets/partners/pgdm-global/EmlyonBusinessSchool.jpeg",
  },
];

export default function InternationalCampusImmersion() {
  return (
    <section className="mt-10 sm:mt-20">
      <Heading
        title="1 Week International Campus Immersion"
        subtitle="Experience global education at a world-class institution with expert-led learning and international exposure."
        titleClassName="text-3xl sm:text-4xl font-bold text-pink-900 mb-4 drop-shadow-md backdrop-blur-sm"
        subtitleClassName="text-gray-600 text-base sm:text-lg mb-8 backdrop-blur-sm"
        className="md:mb-4"
      />
      
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:mt-4 mt-2">
        {universities.map((university) => (
          <div
            key={university.id}
            className="flex flex-col items-center bg-white md:p-6 p-4 text-center rounded-sm shadow-md hover:translate-y-[-10px] duration-300 transition-all"
          >
            <div className="mb-4 md:h-32 h-24 w-full flex items-center justify-center">
              <Image
                src={university.image}
                alt={university.name}
                width={200}
                height={128}
                className="mx-auto h-full object-contain"
                onError={(e) => {
                  // Fallback to placeholder if image doesn't exist
                  e.target.src = "/assets/partners/placeholder.png";
                }}
              />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-semibold text-gray-900">
                {university.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
