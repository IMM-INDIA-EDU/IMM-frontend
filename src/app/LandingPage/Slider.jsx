/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
// import { SparklesText } from "@/components/magicui/sparkles-text";
import { BorderBeam } from "@/components/magicui/border-beam";
import Link from "next/link";
import Image from "next/image";
import Magnet from "../../yes/Magnet/Magnet";
// import AccreditationLogo from "./AccreditationLogo";
// import { AccreditationLogoMobile } from "./AccreditationLogoMobile";
// import logos from "../../assets/Hero/logo-1.webp";
// import Heading from "../../components/Heading";
export default function Slider({
  arrowClassName,
  slides,
  autoPlay = true,
  autoPlayInterval = 6000,
  indicators = true,
  arrows = true,
  effect = "cube",
}) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [direction, setDirection] = useState("right");

  // Filter slides: on mobile, only show slides with mobileImage
  const filteredSlides = isMobile
    ? slides.filter((slide) => slide.mobileImage)
    : slides;

  const slideCount = filteredSlides.length;

  const variants = {
    cube: {
      initial: (direction) => ({
        rotateY: direction === "right" ? 90 : -90,
        opacity: 1,
      }),
      animate: {
        rotateY: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" },
      },
      exit: (direction) => ({
        rotateY: direction === "right" ? -90 : 90,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" },
      }),
    },
    flip: {
      initial: (direction) => ({
        rotateY: direction === "right" ? 180 : -180,
        opacity: 1,
      }),
      animate: {
        rotateY: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" },
      },
      exit: (direction) => ({
        rotateY: direction === "right" ? -180 : 180,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" },
      }),
    },
    fade: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" },
      },
      exit: {
        opacity: 0,
        transition: { duration: 0.8, ease: "easeInOut" },
      },
    },
    slide: {
      initial: (direction) => ({
        x: direction === "right" ? "100%" : "-100%",
        opacity: 1,
      }),
      animate: {
        x: 0,
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" },
      },
      exit: (direction) => ({
        x: direction === "right" ? "-100%" : "100%",
        opacity: 1,
        transition: { duration: 0.8, ease: "easeInOut" },
      }),
    },
  };

  const getVariant = () => {
    switch (effect) {
      case "cube":
        return variants.cube;
      case "flip":
        return variants.flip;
      case "fade":
        return variants.fade;
      default:
        return variants.slide;
    }
  };

  const animateSlideTransition = useCallback(
    (nextIndex, direction) => {
      if (isAnimating) return;

      setIsAnimating(true);
      setDirection(direction);
      setCurrentSlide(nextIndex);
    },
    [isAnimating]
  );

  const nextSlideFunc = useCallback(() => {
    if (isAnimating) return;

    const nextIndex = (currentSlide + 1) % slideCount;
    animateSlideTransition(nextIndex, "right");
  }, [currentSlide, slideCount, isAnimating, animateSlideTransition]);

  const prevSlideFunc = useCallback(() => {
    if (isAnimating) return;

    const nextIndex = (currentSlide - 1 + slideCount) % slideCount;
    animateSlideTransition(nextIndex, "left");
  }, [currentSlide, slideCount, isAnimating, animateSlideTransition]);

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;

    const direction = index > currentSlide ? "right" : "left";
    animateSlideTransition(index, direction);
  };

  // Detect mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640); // 640px is Tailwind's sm breakpoint
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Reset current slide when switching between mobile/desktop
  useEffect(() => {
    if (filteredSlides.length > 0 && currentSlide >= filteredSlides.length) {
      setCurrentSlide(0);
    }
  }, [isMobile, filteredSlides.length, currentSlide]);

  // Auto play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      nextSlideFunc();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, nextSlideFunc]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowLeft") {
        prevSlideFunc();
      } else if (e.key === "ArrowRight") {
        nextSlideFunc();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [nextSlideFunc, prevSlideFunc]);

  // Handle touch events for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSlideFunc();
    } else if (isRightSwipe) {
      prevSlideFunc();
    }

    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: 1000 }}
    >
      <AnimatePresence
        custom={direction}
        initial={false}
        onExitComplete={() => setIsAnimating(false)}
      >
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={getVariant()}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute top-0 left-0 w-full h-full"
          style={{
            transformStyle:
              effect === "cube" || effect === "flip" ? "preserve-3d" : "flat",
          }}
        >
          <div className="relative w-full h-full">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/0 to-transparent" />
            <Image
              src={filteredSlides[currentSlide].image || "/placeholder.svg"}
              alt={filteredSlides[currentSlide].title}
              fill
              className="object-cover w-full h-full sm:block hidden sm:h-[82vh]"
            />
            {filteredSlides[currentSlide].mobileImage && (
              <Image
                src={filteredSlides[currentSlide].mobileImage}
                alt={filteredSlides[currentSlide].title}
                fill
                className="object-cover w-full  block sm:hidden h-full"
              />
            )}
            <div className="absolute inset-0 bg-black/10" />
            {currentSlide === 0 && filteredSlides[currentSlide].slider && (
              <div className="absolute bottom-0 left-0 right-0 z-20 flex flex-col items-center justify-end w-full h-full gap-10 sm:flex-row sm:justify-start md:p-12 lg:p-16 mb-8 sm:mb-0">
                <div className="w-full max-w-4xl px-4 sm:ml-10 sm:w-auto sm:space-y-8 sm:px-0">
                  <div className="mb-4 text-center sm:text-left space-y-1 text-4xl font-bold leading-tight md:text-6xl">
                    <h1 className="text-4xl text-white sm:text-5xl md:text-[3.3rem]">
                      {filteredSlides[currentSlide].heading1}
                    </h1>

                    <h2 className="text-4xl  text-white sm:text-5xl md:text-[3.3rem]">
                      {filteredSlides[currentSlide].heading2}
                    </h2>
                  </div>

                  <p className="mx-auto mb-6 max-w-md text-center text-lg text-white/90 sm:mx-0 sm:text-left sm:text-xl md:text-2xl lg:text-3xl">
                    {filteredSlides[currentSlide].description}
                  </p>

                  <div className="mt-5 flex flex-wrap justify-center gap-3 sm:mt-14 sm:justify-start sm:gap-8">
                    <Magnet
                      padding={100}
                      disabled={false}
                      magnetStrength={10}
                      className="relative"
                    >
                      <Link
                        href="/programs/pgdm"
                        className="relative overflow-hidden rounded-full bg-[#C4184B] px-6 py-2 text-sm lg:text-lg font-semibold text-white hover:bg-white hover:text-black duration-150 transition-all hover:-translate-y-2"
                      >
                        <span>PGDM Program</span>
                        <BorderBeam className="absolute inset-0" />
                      </Link>
                    </Magnet>
                    <Magnet
                      padding={100}
                      disabled={false}
                      magnetStrength={10}
                      className="relative"
                    >
                      <Link
                        href="/programs/bba"
                        className="relative overflow-hidden rounded-full bg-[#C4184B] px-6 py-2 text-sm lg:text-lg font-semibold text-white hover:bg-white hover:text-black duration-150 transition-all hover:-translate-y-2"
                      >
                        <span>BBA Program</span>
                        <BorderBeam className="absolute inset-0" />
                      </Link>
                    </Magnet>
                  </div>

                  {/* <img
                    src={logos}
                    alt="logo image"
                    className="hidden object-contain w-full h-full rounded-lg sm:block max-h-32 drop-shadow-xl"
                  /> */}
                </div>
                {/* <div className="hidden px-5 py-1 rounded-lg md:block bg-black/40 backdrop-blur-3xl">
                  <AccreditationLogo />
                </div> */}
                {/* <div className="block px-5 py-1 rounded-lg sm:hidden bg-black/40 backdrop-blur-3xl">
                  <AccreditationLogoMobile />
                </div> */}
              </div>
            )}

            {!filteredSlides[currentSlide].slider && (
              <div className="absolute left-0 right-0 z-20 bottom-10">
                <div className="max-w-4xl mx-auto">
                  {/* <h2 className="mb-3 text-3xl font-bold text-white md:text-4xl lg:text-5xl md:mb-6">{filteredSlides[currentSlide].title}</h2> */}
                  {/* <p className="max-w-2xl text-base md:text-lg lg:text-xl text-white/90">{filteredSlides[currentSlide].description}</p> */}
                </div>

                {/* <div className="w-full bg-black/40 backdrop-blur-sm">
                  <h1 className="px-3 py-2 mx-auto text-lg text-white rounded-md w-max">
                    {"📍" + filteredSlides[currentSlide].category}
                  </h1>
                </div> */}
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Arrows */}
      {arrows && (
        <div className={`flex ${arrowClassName}`}>
          <Button
            onClick={prevSlideFunc}
            disabled={isAnimating}
            className="absolute z-20 scale-75 sm:scale-100 p-2 -translate-y-1/2 border rounded-full left-2 sm:left-4 top-1/2 bg-white/10 hover:bg-white/20 sm:backdrop-blur-sm border-white/20 md:p-3"
            size="icon"
            variant="ghost"
          >
            <ChevronLeft className="w-5 h-5 text-white md:h-6 md:w-6" />
            <span className="sr-only">Previous slide</span>
          </Button>
          <Button
            onClick={nextSlideFunc}
            disabled={isAnimating}
            className="absolute z-20 scale-75 sm:scale-100 p-2 -translate-y-1/2 border rounded-full right-2 sm:right-4 top-1/2 bg-white/10 hover:bg-white/20 sm:backdrop-blur-sm border-white/20 md:p-3"
            size="icon"
            variant="ghost"
          >
            <ChevronRight className="w-5 h-5 text-white md:h-6 md:w-6" />
            <span className="sr-only">Next slide</span>
          </Button>
        </div>
      )}

      {/* Indicators */}
      {indicators && (
        <div className="absolute z-20 flex space-x-2 -translate-x-1/2 bottom-6 left-1/2">
          {filteredSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={cn(
                "hidden md:block w-2 h-2 md:w-4 md:h-[5px] rounded-full transition-all duration-300",
                index === currentSlide
                  ? "bg-white scale-125"
                  : "bg-white/20 hover:bg-white/60"
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
      {/* <div className="w-full relative" style={{ marginTop: '-150px' }}>
        <div className="container mx-auto px-4">
          <AccreditationLogoMobile />
        </div>
      </div> */}
    </div>
  );
}
