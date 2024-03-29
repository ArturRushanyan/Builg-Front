"use client";

import { unsetLocalStorage } from "@/service/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Nav = () => {
  const router = useRouter();

  const logout = () => {
    unsetLocalStorage();
    router.replace("/");
  };

  return (
    <>
      <nav
        className="
        flex flex-wrap
        items-center
        justify-between
        w-full
        md:py-0
        px-4
        text-lg text-gray-700
        bg-white
      "
        style={{ height: "60px" }}
      >
        <div>
          <Link href="/dashboard" passHref>
            {/* eslint-disable @next/next/no-img-element */}
            <img className="m-3 ml-7" src="/app-logo.svg" alt="App logo" />
          </Link>
        </div>

        <div
          className="hidden w-full md:flex md:items-center md:w-auto"
          id="menu"
        >
          <ul
            className="
          pt-4
          text-base text-gray-700
          md:flex
          md:justify-between 
          md:pt-0 space-x-2"
          >
            <li>
              <Link
                className="md:p-2 py-2 block hover:text-purple-400"
                href="/personal-page"
              >
                Profile
              </Link>
            </li>
            <li>
              <a
                className="md:p-2 py-2 block hover:text-purple-400"
                onClick={logout}
                style={{ cursor: "pointer" }}
              >
                Logout
              </a>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Nav;
