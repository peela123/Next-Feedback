import { FC } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import { FaRegUser } from "react-icons/fa6";
import { IconSearch } from "@tabler/icons-react";
import { GoGraph } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import { Menu } from "@mantine/core";
import { VscSignOut } from "react-icons/vsc";

const UserInfoBtn: FC = () => {
  const router = useRouter();

  function signOut() {
    //Call sign out api without caring what is the result
    //It will fail only in case of client cannot connect to server
    //This is left as an exercise for you. Good luck.
    axios.post("/api/signOut").finally(() => {
      router.push("/");
    });
  }

  return (
    <Menu
      offset={4}
      trigger="click-hover"
      openDelay={50}
      closeDelay={250}
      // style={{ backgroundColor: "#2f2626" }}
    >
      <Menu.Target>
        <button className="flex flex-row ml-3 mt-2">
          <FaRegUser color="white" size={35} />
        </button>
      </Menu.Target>
      <Menu.Dropdown
        style={{
          backgroundColor: "#2f2626",
          // color: "red",
          borderColor: "gray",
          borderWidth: "1px",
        }}
      >
        <Menu.Item
          leftSection={<CgProfile style={{ width: "14px", height: "14px" }} />}
          color="rgba(196, 179, 179, 1)"
        >
          profile
        </Menu.Item>
        <Menu.Item
          leftSection={<GoGraph style={{ width: "14px", height: "14px" }} />}
          onClick={() => router.push("/Analyze")}
          color="rgba(196, 179, 179, 1)"
        >
          analyze
        </Menu.Item>

        <Menu.Item
          leftSection={<IconSearch style={{ width: "14px", height: "14px" }} />}
          color="rgba(196, 179, 179, 1)"
          // disabled
        >
          Search
        </Menu.Item>

        <Menu.Item
          leftSection={<VscSignOut style={{ width: "14px", height: "14px" }} />}
          onClick={signOut}
          color="rgba(196, 179, 179, 1)"
        >
          sign out
        </Menu.Item>

        {/* Other items ... */}
      </Menu.Dropdown>
    </Menu>
  );
};

export default UserInfoBtn;
