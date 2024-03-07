import { FC } from "react";
import Link from "next/link";

import { TfiWrite } from "react-icons/tfi";
import CmuLoginBtn from "./CmuLogInBtn";
import SignInBtn from "./SignInBtn";
import UserInfoBtn from "./UserInfoBtn";

const Navbar: FC = () => {
  return (
    <nav
      className="flex flex-row gap-x-4 justify-between items-center h-12 border-b-1 border-black"
      style={{ backgroundColor: "#2f2626", height: "55px" }}
    >
      <div className="flex flex-row items-center gap-x-4 ml-8">
        <Link href="/Analyze" className="flex flex-row gap-x-5 items-center">
          <TfiWrite size={30} />
          <h1 className="text-white text-2xl font-semibold">
            FeedbackClassifier
          </h1>
        </Link>
      </div>
      <UserInfoBtn width="35" height="35" />
    </nav>
  );
};

export default Navbar;
