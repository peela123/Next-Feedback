import Navbar from "./components/Navbar";
import CmuLoginBtn from "./components/CmuLogInBtn";

export default function Home() {
  return (
    <div
      className="flex flex-col h-dvh justify-center items-center"
      // style={{ backgroundColor: "#03001C" }}
      style={{ backgroundColor: "#212529" }}
    >
      <div className="flex flex-col gap-y-6 items-center">
        <h1 className="text-4xl font-semibold text-white">
          Student Feedback Classifier
        </h1>

        <CmuLoginBtn />
      </div>
    </div>
  );
}
