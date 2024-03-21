import Link from "next/link";
import { FC } from "react";

import { IoMdAddCircleOutline } from "react-icons/io";

const AddFeedbackBtn: FC = () => {
  return (
    <Link
      href="/UploadFile"
      className="bg-lime-600 hover:bg-lime-700 py-2 flex flex-row justify-center items-center rounded-sm"
    >
      <IoMdAddCircleOutline size={30} />
      <p className="pl-3">Add Feedback</p>
    </Link>
  );
};

export default AddFeedbackBtn;
