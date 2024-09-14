import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { styles } from "./styles";
import { NavLinks, NavLink } from "./constants";
import { logo, close, menu } from "./assets";

const Navbar: React.FC = () => {
  const [active, setActive] = useState<string>("");
  const [toggle, setToggle] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setScrolled(scrollY > 100); // example threshold for scrolled state
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <nav
      className={`${styles.paddingX} w-full flex items-center py-5 fixed top-0 z-20 bg-blue-700 ${scrolled ? "bg-blue-900" : "bg-blue-700"}`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <img src={logo} alt="logo" className="w-9 h-9 object-contain" />
          <p className="text-white text-[18px] font-bold cursor-pointer flex">
            Tangle&nbsp;
            <span className="sm:block hidden"> | Connect The North </span>
          </p>
        </Link>

        {/* Desktop Menu */}
        <ul className="list-none hidden sm:flex flex-row gap-10">
          {NavLinks.map((nav: NavLink) => (
            <li
              key={nav.id}
              className={`${
                active === nav.title ? "text-white" : "text-gray-300"
              } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
        </ul>

        {/* Mobile Menu */}
        <div className="sm:hidden flex flex-1 justify-end items-center">
          <img
            src={toggle ? close : menu}
            alt="menu"
            className="w-[28px] h-[28px] object-contain cursor-pointer"
            onClick={() => setToggle(!toggle)}
          />
          <div
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl bg-blue-700`}
          >
            <ul className="list-none flex justify-end items-start flex-col gap-4">
              {NavLinks.map((nav: NavLink) => (
                <li
                  key={nav.id}
                  className={`${
                    active === nav.title ? "text-white" : "text-gray-300"
                  } font-poppins font-medium cursor-pointer text-[16px]`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
