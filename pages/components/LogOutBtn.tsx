import { FC } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";

import { BsArrowReturnLeft } from "react-icons/bs";

const LogOutBtn: FC = () => {
  const router = useRouter();

  function signOut() {
    axios.post("/api/signOut").finally(() => {
      router.push("/");
    });
  }

  return (
    <Link
      href="/"
      className="flex flex-row justify-evenly w-11/12 items-center my-10 rounded-2xl h-9 bg-slate-600 hover:bg-red-400  transition-colors duration-100"
      onClick={signOut}
    >
      <BsArrowReturnLeft size={32} color={"red"} />
      <p className="text-lg">Log Out</p>
    </Link>
  );
};

export default LogOutBtn;
