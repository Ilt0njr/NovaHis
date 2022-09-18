import { propNames } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import Cart from "../Cart";
import Contact from "../Contact";
import Login from "../Login";
import SearchBar from "./SearchBar";

export default props => {
  return (
    <div className="w-screen shadow flex justify-between items-center flex-col">
      <div className="w-full h-24 shadow flex justify-between items-center">
        <a href="/" className="ml-10 cursor-pointer flex items-center">
          <Image src="/logo.png" alt="logo" width={150} height={150} />
        </a>
        <div className="hidden lg:block">
          <SearchBar />
        </div>
        <div className="mx-10 flex gap-10 text-black text-2xl">
          <Contact />
          <Login />
          <Cart drawer="true" />
        </div>
      </div>
      <div className="flex gap-5 lg:hidden">
        <SearchBar />
        {props.children}
      </div>
    </div>
  );
};
