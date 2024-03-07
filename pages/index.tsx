import Navbar from "./components/Navbar";
import CmuLoginBtn from "./components/CmuLogInBtn";

export default function Home() {
  return (
    <div
      className="flex flex-col h-screen"
      style={{ backgroundColor: "#03001C" }}
    >
      <div className="flex flex-row justify-center items-center grow">
        <CmuLoginBtn />
      </div>
    </div>
  );
}
