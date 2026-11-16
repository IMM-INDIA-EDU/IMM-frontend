
"use client";

import { forwardRef, useRef, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/magicui/animated-beam";
import { getIcon } from "./data/iconMapping";

const Circle = forwardRef(({ className, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 flex items-center justify-center rounded-full border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
      className
    )}
  >
    {children}
  </div>
));

const Rectangle = forwardRef(({ className, children }, ref) => (
  <div
    ref={ref}
    className={cn(
      "z-10 flex items-center justify-center rounded border-2 bg-white p-3 shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)]",
      className
    )}
  >
    {children}
  </div>
));

Circle.displayName = "Circle";
Circle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

Rectangle.displayName = "Rectangle";
Rectangle.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export function AnimatedBeamMultipleOutputDemo({
  className,
  curriculumData,
  activeSemesterIndex = 0,
}) {
  const containerRef = useRef(null);
  const centerRef = useRef(null);
  const userRef = useRef(null);
  const [beamsReady, setBeamsReady] = useState(false);

  const ref0 = useRef(null);
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const ref4 = useRef(null);
  const ref5 = useRef(null);
  const ref6 = useRef(null);
  const ref7 = useRef(null);
  const ref8 = useRef(null);
  const ref9 = useRef(null);

  const activeSemester = curriculumData?.[activeSemesterIndex] || null;

  const moduleRefs = [
    ref0, ref1, ref2, ref3, ref4,
    ref5, ref6, ref7, ref8, ref9,
  ];

  const moduleCount = Math.min(activeSemester?.modules?.length || 0, 10);

  useEffect(() => {
    setBeamsReady(false);

    const timer = setTimeout(() => {
      setBeamsReady(true);
    }, 150);

    return () => clearTimeout(timer);
  }, [activeSemesterIndex]);

  const UserIcon = getIcon("User");

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative flex min-h-[500px] w-full items-center justify-center overflow-hidden sm:p-10",
        className
      )}
    >
      {activeSemester ? (
        <div className="flex size-full sm:max-w-3xl flex-row items-stretch justify-between gap-10">
          <div className="flex flex-col justify-center">
            <Circle
              ref={userRef}
              className="transition-all duration-300 hover:scale-110"
            >
              <UserIcon className="h-16 w-16 text-pink-700" />
            </Circle>
          </div>

          <div className="flex flex-col justify-center">
            <Rectangle className="flex flex-col items-center justify-between p-4 transition-all duration-300 hover:scale-105">
              {(() => {
                const TitleIcon = getIcon(
                  activeSemester.title?.iconName ||
                  activeSemester.title?.name
                );

                return (
                  <TitleIcon className="h-16 w-16 text-pink-700" />
                );
              })()}

              <p className="w-max text-center text-sm font-medium text-slate-500">
                {activeSemester.title?.name}
              </p>
            </Rectangle>
          </div>

          <div className="flex flex-col justify-center gap-10">
            {activeSemester.modules.slice(0, 10).map((module, index) => {
              const ModuleIcon = getIcon(module.iconName || module.name);

              return (
                <Rectangle
                  key={index}
                  ref={moduleRefs[index]}
                  className="flex flex-col items-center justify-between transition-all duration-300 hover:scale-105"
                >
                  <ModuleIcon className="h-16 w-16 text-pink-700" />

                  <p className="w-max p-2 text-center text-sm font-medium text-slate-500">
                    {module.name}
                  </p>
                </Rectangle>
              );
            })}
          </div>
        </div>
      ) : (
        <div>No curriculum data available</div>
      )}

      {beamsReady &&
        activeSemester &&
        moduleRefs.slice(0, moduleCount).map(
          (moduleRef, index) =>
            moduleRef.current && (
              <AnimatedBeam
                key={index}
                containerRef={containerRef}
                fromRef={moduleRef}
                toRef={centerRef}
                duration={4}
                reverse
              />
            )
        )}

      {beamsReady && centerRef.current && userRef.current && (
        <AnimatedBeam
          containerRef={containerRef}
          fromRef={centerRef}
          toRef={userRef}
          duration={4}
          reverse
        />
      )}
    </div>
  );
}

AnimatedBeamMultipleOutputDemo.propTypes = {
  className: PropTypes.string,
  curriculumData: PropTypes.array,
  activeSemesterIndex: PropTypes.number,
};
