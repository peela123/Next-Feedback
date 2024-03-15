import { FC } from "react";
import Link from "next/link";

import { TfiWrite } from "react-icons/tfi";
import { GoGraph } from "react-icons/go";
import { Menu } from "@mantine/core";
import CmuLoginBtn from "./CmuLogInBtn";
import UserInfoBtn from "./UserInfoBtn";

interface Props {
  fullName: string;
  cmuAccount: String;
}

const Navbar: FC<Props> = ({ fullName, cmuAccount }) => {
  return (
    <nav
      className="flex flex-row gap-x-4 justify-between items-center h-12"
      style={{ backgroundColor: "#292929", height: "62px" }}
    >
      <div className="flex flex-row items-center gap-x-4 ml-8">
        <Link href="/UploadFile" className="flex flex-row gap-x-5 items-center">
          <TfiWrite size={30} color="white" />
          <h1 className="text-white text-2xl font-semibold">
            FeedbackClassifier
          </h1>
        </Link>
      </div>
      <div className="flex flex-row items-center pr-4">
        {/* <Link
          href="/Analyze"
          className=" flex flex-row items-center mx-4 h-screen gap-x-1"
        >
          <GoGraph color="white" size={20} />
          <p className="text-white text-sm">Analyze</p>
        </Link> */}

        <div className="flex flex-col">
          <p className="text-white text-sm">{fullName}</p>
          <p className="text-white text-sm">{cmuAccount}</p>
        </div>

        <UserInfoBtn haveDropDown={true} />
      </div>
    </nav>
  );
};

export default Navbar;
