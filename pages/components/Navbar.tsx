import { FC } from "react";
import Link from "next/link";

import { TfiWrite } from "react-icons/tfi";
import CmuLoginBtn from "./CmuLogInBtn";
import SignInBtn from "./SignInBtn";
import UserInfoBtn from "./UserInfoBtn";

interface Props {
  fullName: string;
  cmuAccount: String;
}

const Navbar: FC<Props> = ({ fullName, cmuAccount }) => {
  return (
    <nav
      className="flex flex-row gap-x-4 justify-between items-center h-12 border-b-1 border-black"
      style={{ backgroundColor: "#2f2626", height: "55px" }}
    >
      <div className="flex flex-row items-center gap-x-4 ml-8">
        <Link href="/" className="flex flex-row gap-x-5 items-center">
          <TfiWrite size={30} color="white" />
          <h1 className="text-white text-2xl font-semibold">
            FeedbackClassifier
          </h1>
        </Link>
      </div>
      <div className="flex flex-row items-center pr-4">
        <div className="flex flex-col">
          <p className="text-white text-sm">{fullName}</p>
          <p className="text-white text-sm">{cmuAccount}</p>
        </div>

        <UserInfoBtn />
      </div>
    </nav>
  );
};

export default Navbar;
