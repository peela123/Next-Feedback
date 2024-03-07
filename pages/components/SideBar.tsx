import { useState, useEffect, FC } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { WhoAmIResponse } from "../api/whoAmI";
import Link from "next/link";

import UserInfoBtn from "./UserInfoBtn";
import { MdOutlineSubject, MdOutlineDarkMode } from "react-icons/md";
import { BsDatabase } from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { IoMdAddCircleOutline } from "react-icons/io";
import { BsArrowReturnLeft } from "react-icons/bs";
import { IoChevronDownSharp } from "react-icons/io5";
import { Select, Menu } from "@mantine/core";

interface FetchedCourse {
  courseName: string;
  courseNo: number;
  academicYear: number;
  semester: string;

  teachingMethodComments: Comment[];
  assessmentComments: Comment[];
  contentComments: Comment[];
}

interface Comment {
  text: string;
  sentiment: string;
  label: string;
}

interface Props {
  fetchedCourse: FetchedCourse[];
  onCourseBtnClick: (
    courseName: string,
    courseNo: number,
    year: number,
    term: string,
    tmComments: Comment[],
    amComments: Comment[],
    CComments: Comment[]
  ) => void;
}

const SideBar: FC<Props> = ({ fetchedCourse, onCourseBtnClick }) => {
  const [selectedCourseNo, setSelectedCourseNo] = useState<number | null>(null);

  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [cmuAccount, setCmuAccount] = useState("");
  const [studentId, setStudentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <nav
      className="flex flex-col overflow-auto"
      style={{ width: "390px", backgroundColor: "#363636" }}
    >
      <section className="mx-1 text-white grow">
        {/* user info button*/}
        <section className="flex flex-row">
          <UserInfoBtn width="33" height="33" />
          <p className="">Username123</p>
        </section>

        {/* line break */}
        <hr
          style={{
            border: "none",
            height: "2px",
            backgroundColor: "#824B4B",
            marginTop: "32px",
            marginBottom: "32px",
          }}
        ></hr>

        {/* all menu */}
        <section className="flex flex-col mt-3 gap-y-2">
          {/* course */}
          <div className="flex flex-col gap-y-2" style={{ width: "" }}>
            {/* course button */}
            <button className="sidebar-btn-style flex flex-row justify-center items-center hover:bg-neutral-500 transition-colors duration-150">
              <GrNotes size={25} color={"white"} />
              <p className="pl-3">Course</p>
              <IoChevronDownSharp size={25} color={"white"} className="ml-16" />
            </button>
            {/*render course button with no duplicate name */}
            {fetchedCourse
              .filter(
                (course, index, self) =>
                  index ===
                  self.findIndex((c) => c.courseName === course.courseName)
              )
              .map((course: FetchedCourse, index: number) => (
                <button
                  key={index}
                  className="sidebarsub-btn-style hover:bg-neutral-500"
                  onClick={() => setSelectedCourseNo(course.courseNo || null)}
                >
                  {`${course.courseNo || ""} ${course.courseName || ""}`}
                </button>
              ))}
          </div>

          {/* dataset*/}
          <div className="flex flex-col gap-y-2 mt-4 overflow-auto">
            {/* dataset button */}
            <button className="sidebar-btn-style flex flex-row justify-center items-center border-2 border-transparent hover:bg-stone-500 transition-colors duration-150">
              <BsDatabase size={30} />
              <p className="pl-3"> Feedback</p>
              <IoChevronDownSharp size={25} className="ml-12" />
            </button>
            {/* sub dataset button*/}
            {selectedCourseNo &&
              fetchedCourse
                .filter(
                  (course: FetchedCourse) =>
                    course.courseNo === selectedCourseNo
                )
                .map((course: FetchedCourse, index: number) => (
                  <button
                    key={index}
                    className="sidebarsub-btn-style hover:bg-neutral-500"
                    onClick={() =>
                      onCourseBtnClick(
                        course.courseName,
                        course.courseNo,
                        course.academicYear,
                        course.semester,
                        course.teachingMethodComments,
                        course.assessmentComments,
                        course.contentComments
                      )
                    }
                  >
                    {`Year ${course.academicYear} Term ${course.semester}`}
                  </button>
                ))}
          </div>

          {/* sumarize section*/}
          <div>
            <button className="mt-4 sidebar-btn-style flex flex-row justiy-center items-center hover:bg-neutral-500">
              <MdOutlineSubject size={30} />
              <p className="pl-3">Summarize</p>
            </button>
          </div>
          {/* <button className="mt-4 sidebar-btn-style hover:bg-neutral-500">
            <MdOutlineSubject size={30} />
            <p className="pl-3">Summarize</p>
          </button> */}
          {/* dark mode section */}
          <button className="mt-4 sidebar-btn-style flex flex-row justiy-center items-center hover:bg-neutral-500">
            <MdOutlineDarkMode size={30} />
            <p className="pl-3 ">Dark Mode</p>
          </button>
          {/* add feedback section */}
          <Link
            href="/UploadFile"
            className="bg-lime-700 hover:bg-lime-600 py-2 flex flex-row justify-center items-center"
          >
            <IoMdAddCircleOutline size={30} />
            <p className="pl-3">Add Feedback</p>
          </Link>
        </section>

        {/* logout */}
        <Link
          href="/"
          className="flex flex-row justify-evenly items-center my-10 rounded-2xl h-9 bg-slate-600 hover:bg-red-400"
        >
          <BsArrowReturnLeft size={32} color={"red"} />
          <p className="text-lg">Log Out</p>
        </Link>
      </section>
    </nav>
  );
};

export default SideBar;
