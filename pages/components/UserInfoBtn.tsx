import { FC } from "react";
import { FaRegUser } from "react-icons/fa6";
const UserInfoBtn: FC = () => {
  return (
    <button className="flex flex-row ml-3 mt-2">
      <FaRegUser color="white" size={35} />
    </button>
  );
};

export default UserInfoBtn;
