"use client";
import { BookOpen } from "lucide-react";
import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";
import { courseCurriculum } from "./data/pgdm-global-course-curriculcum-data";
import { getIcon } from "./data/iconMapping";

export default function CurriculumTabsPgdmGlobal() {
  const [activeTab, setActiveTab] = useState(0);
  const [hoveredTab, setHoveredTab] = useState(null);

  // Use a debounced tab change to avoid rapid switching on hover
  const handleTabHover = useCallback((index) => {
    setHoveredTab(index);
    // Only change the active tab if the hover persists
    const timer = setTimeout(() => {
      setActiveTab(index);
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="">
      <motion.div
        className="text-center sm:text-left mt-10 max-w-4xl mx mb-16 relative z-10"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
      >
        <h2 className="sm:text-4xl text-3xl font-bold text-pink-900 mb-6 drop-shadow-md backdrop-blur-sm w-fit">
          COURSE CURRICULUM AI & ML Infused
        </h2>
        <p className="text-gray-700 text-lg drop-shadow-sm backdrop-blur-sm">
          A comprehensive curriculum designed to build strong foundations and advance your expertise in management and technology.
        </p>
      </motion.div>
      <div className="flex flex-col md:flex-row w-full sm:max-w-7xl mx-auto gap-6 sm:px-0">
        {/* Vertical Tab Navigation */}
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="flex flex-col space-y-4">
            {courseCurriculum.map((semester, index) => (
              <motion.button
                key={index}
                onMouseEnter={() => handleTabHover(index)}
                onMouseLeave={() => setHoveredTab(null)}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "text-left px-4 py-3 rounded-lg transition-all duration-200 font-medium",
                  "hover:shadow-md focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50",
                  "flex items-center relative overflow-hidden",
                  activeTab === index
                    ? "bg-gradient-to-r from-pink-700 to-pink-900 text-white drop-shadow-lg text-lg "
                    : "bg-white border-2 border-slate-100 hover:bg-gradient-to-r hover:from-pink-700 hover:to-pink-900 hover:text-white shadow-md shadow-black/20"
                )}
                whileHover={{
                  scale: 1.03,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <motion.div
                  animate={
                    hoveredTab === index
                      ? {
                          x: [0, 3, 0],
                          transition: {
                            duration: 0.5,
                            ease: "easeInOut",
                          },
                        }
                      : {}
                  }
                  className="flex items-center"
                >
                  {(() => {
                    const iconName = semester.title?.iconName || semester.title?.name;
                    const IconComponent = iconName ? getIcon(iconName) : BookOpen;
                    return <IconComponent className="mr-2 h-5 w-5 text-current" />;
                  })()}
                  {semester.semester}
                </motion.div>

                {/* Subtle background pulse effect on hover */}
                {hoveredTab === index && (
                  <motion.div
                    className="absolute inset-0 bg-white opacity-0"
                    animate={{
                      opacity: [0, 0.1, 0],
                      scale: [1, 1.05, 1],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatType: "loop",
                    }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Content Display with Animation */}
        <div className="flex-1 bg-white/80 p-6 rounded-lg shadow-md min-h-[300px]">
          <AnimatePresence>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-pink-800">
                  {courseCurriculum[activeTab].title.name}
                </h2>
                <p className="text-gray-500">
                  {courseCurriculum[activeTab].semester}
                </p>
              </div>
              <hr className="my-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {courseCurriculum[activeTab].modules.map((module, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center p-4 bg-white rounded-lg shadow-sm border border-slate-100 hover:shadow-md hover:scale-105 transition-all duration-200"
                  >
                    {(() => {
                      const ModuleIcon = getIcon(module.iconName || module.name);
                      return <ModuleIcon className="w-10 h-10 text-pink-600 mr-3 flex-shrink-0" />;
                    })()}
                    <p className="text-sm font-medium text-slate-700">
                      {module.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

