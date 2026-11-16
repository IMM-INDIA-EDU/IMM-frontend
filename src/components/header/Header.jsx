"use client";
import TopBar from "./TopBar";
import Navbar from "./Navbar";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();
  const [isVisible, setIsVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const shouldHideTopBar = pathname === '/application-form-2026';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;

      // Add delay using setTimeout
      setTimeout(() => {
        setIsVisible(
          prevScrollPos > currentScrollPos || currentScrollPos < 100
        );
        setPrevScrollPos(currentScrollPos);
      }, 20); // 100ms delay
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <header
      className={`shadow-sm z-[9999]  transition-all duration-500 ${
        isVisible ? "sticky top-0 translate-y-0" : "relative -translate-y-full"
      }`}
    >
      {!shouldHideTopBar && <TopBar />}

      <Navbar />
    </header>
  );
};

export default Header;
