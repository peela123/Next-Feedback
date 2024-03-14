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
import { Button } from "@mantine/core";
import { ScrollArea } from "@mantine/core";

import { FetchedCourse, Comment } from "../../types/CommentType";

interface Props {
  fetchedCourse: FetchedCourse[];
  handleSubFeedbackClick: (
    courseName: string,
    courseNo: number,
    academicYear: number,
    semester: string,
    teachingMethodComments: Comment[],
    assessmentComments: Comment[],
    contentComments: Comment[]
  ) => void;
  fullName: string;
  cmuAccount: string;
  isSummarize: boolean;
  toggleSummarize: () => void;
  toggleDarkMode: () => void;
}

const SideBar: FC<Props> = ({
  fetchedCourse,
  fullName,
  cmuAccount,
  handleSubFeedbackClick,
  toggleSummarize,
  toggleDarkMode,
}) => {
  const [selectedCourseNo, setSelectedCourseNo] = useState<number | null>(null);

  const router = useRouter();
  function signOut() {
    axios.post("/api/signOut").finally(() => {
      router.push("/");
    });
  }

  return (
    <ScrollArea
      w={450}
      type="scroll"
      scrollbars="y"
      offsetScrollbars
      scrollbarSize={6}
      scrollHideDelay={500}
      style={{ backgroundColor: "#363636" }}
      className="flex flex-col"
    >
      <section className="mx-1 text-white grow">
        {/* user info button*/}
        <section className="flex flex-row">
          <UserInfoBtn />
          <div className="flex flex-col pl-4">
            <p>{fullName}</p>
            <p>{cmuAccount}</p>
          </div>
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
          {/* course section*/}
          <div className="flex flex-col gap-y-2">
            {/* course button */}
            <button className="sidebar-btn-style flex flex-row justify-center items-center hover:bg-neutral-500 transition-colors duration-150">
              <GrNotes size={25} color={"white"} />
              <p className="pl-3">Course</p>
              <IoChevronDownSharp size={25} color={"white"} className="ml-16" />
            </button>
            {/*sub course button*/}
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
                  style={{
                    backgroundColor:
                      selectedCourseNo === course.courseNo ? "#727877 " : "",
                  }}
                  onClick={() => {
                    setSelectedCourseNo(course.courseNo || null);
                    // handleSubFeedbackClick(
                    //   course.courseName,
                    //   course.courseNo,
                    //   course.academicYear,
                    //   course.semester,
                    //   course.teachingMethodComments,
                    //   course.assessmentComments,
                    //   course.contentComments
                    // );
                  }}
                >
                  {`${course.courseNo || ""} ${course.courseName || ""}`}
                </button>
              ))}
          </div>

          {/* feedback section*/}
          <div className="flex flex-col gap-y-2 mt-4 overflow-auto">
            {/* feedback button */}
            <button className="sidebar-btn-style flex flex-row justify-center items-center border-2 border-transparent hover:bg-stone-500 transition-colors duration-150">
              <BsDatabase size={30} />
              <p className="pl-3"> Feedback</p>
              <IoChevronDownSharp size={25} className="ml-12" />
            </button>
            {/* sub feedback button*/}

            {selectedCourseNo &&
              fetchedCourse
                .filter(
                  (course: FetchedCourse) =>
                    course.courseNo === selectedCourseNo
                )
                .map((course: FetchedCourse, index: number) => (
                  <button
                    key={index}
                    className="sidebarsub-btn-style hover:bg-neutral-500 "
                    onClick={() =>
                      handleSubFeedbackClick(
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
                    {`Year ${course.academicYear} Term ${course.semester}(${
                      course.teachingMethodComments.length +
                      course.assessmentComments.length +
                      course.contentComments.length
                    })`}
                  </button>
                ))}
          </div>

          {/* sumarize section*/}
          <div className="flex flex-col gap-y-2">
            {/* summarize button */}
            <button
              className="flex flex-row justify-center items-center mt-4 sidebar-btn-style hover:bg-neutral-500"
              onClick={() => toggleSummarize()}
            >
              <MdOutlineSubject size={30} />
              <p className="pl-3">Summarize</p>
            </button>
          </div>
          {/* dark mode section */}
          <button
            onClick={toggleDarkMode}
            className="mt-4 sidebar-btn-style flex flex-row justiy-center items-center hover:bg-neutral-500"
          >
            <MdOutlineDarkMode size={30} />
            <p className="pl-3">Dark Mode</p>
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
          onClick={signOut}
        >
          <BsArrowReturnLeft size={32} color={"red"} />
          <p className="text-lg">Log Out</p>
        </Link>
      </section>
    </ScrollArea>
  );
};

export default SideBar;
