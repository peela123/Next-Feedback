import Router, { useRouter } from "next/router";
import { FC } from "react";

const CmuLogInBtn: FC = () => {
  const router = useRouter();
  return (
    <a href={process.env.NEXT_PUBLIC_CMU_OAUTH_URL}>
      {/* <button className="bg-fuchsia-500 px-4 py-2 text-base rounded hover:bg-fuchsia-600"> */}
      <button
        className=" bg-blue-600 px-4 py-2 text-semibold text-white text-base rounded hover:bg-blue-700"
        // style={{ backgroundColor: "#0d6efd" }}
      >
        Sign-in with CMU Account
      </button>
    </a>
  );
};

export default CmuLogInBtn;
