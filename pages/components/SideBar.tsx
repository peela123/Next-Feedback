import { useState, useEffect, FC } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { useRouter } from "next/router";
import { WhoAmIResponse } from "../api/whoAmI";
import Link from "next/link";

import UserInfoBtn from "./UserInfoBtn";
import AddFeedbackBtn from "./AddFeedbackBtn";
import { MdOutlineSubject, MdOutlineDarkMode } from "react-icons/md";
import { BsDatabase } from "react-icons/bs";
import { GrNotes } from "react-icons/gr";
import { TiDeleteOutline } from "react-icons/ti";
import { IoChevronDownSharp } from "react-icons/io5";

import { IconInfoCircle } from "@tabler/icons-react";
import { Switch } from "@mantine/core";
import {
  Modal,
  Group,
  Button,
  Text,
  Select,
  Menu,
  Badge,
  Alert,
  ScrollArea,
} from "@mantine/core";
import { useDisclosure, useCounter } from "@mantine/hooks";

import { FetchedCourse, Comment } from "../../types/CommentType";
import LogOutBtn from "./LogOutBtn";

interface Props {
  fetchedCourse: FetchedCourse[];
  handleSubFeedbackClick: (
    courseName: string,
    courseNo: number,
    academicYear: number,
    semester: string,
    teachingMethodComments: Comment[],
    assessmentComments: Comment[],
    contentComments: Comment[],
    responseCount: number
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
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<string | null>(null);

  const router = useRouter();

  const handleDeleteFeedback = async (
    cmuAccount: string,
    academicYear: number,
    semester: string,
    courseNo: number
  ) => {
    try {
      const res = await axios.delete(
        `http://127.0.0.1:5000/api/user_course_delete`,
        {
          params: {
            cmuAccount,
            academicYear,
            semester,
            courseNo,
          },
        }
      );
      console.log(`${res.data.message}`);
      // If deletion is successful, refresh the page
      router.reload();
    } catch (error) {
      console.error("Something wrong delete document: ", error);
    }
  };

  const icon = <IconInfoCircle />;
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <ScrollArea
      w={430}
      type="scroll"
      scrollbars="y"
      scrollbarSize={6}
      scrollHideDelay={500}
      style={{ backgroundColor: "#202427" }}
      className="flex flex-col"
    >
      <div className="flex flex-col justify-center items-center text-white grow">
        {/* user info button*/}
        <section className="my-2 flex flex-row items-center justify-center ">
          <UserInfoBtn haveDropDown={false} />
          <div className="flex flex-col pl-4">
            <p className="text-white text-sm">{fullName}</p>
            <p className="text-white text-sm">{cmuAccount}</p>
          </div>
        </section>

        {/* line break */}
        <hr
          style={{
            marginTop: "32px",
            marginBottom: "32px",
            borderWidth: "1px",
            width: "95%",
            borderColor: "#824B4B",
          }}
        ></hr>

        {/* all menu */}
        <div className="flex flex-col gap-y-2 w-11/12">
          {/* course section*/}
          <section className="flex flex-col gap-y-2">
            {/* course button */}
            <button className="sidebar-btn-style flex flex-row justify-center items-center hover:bg-neutral-500 transition-colors duration-150">
              <GrNotes size={25} color={"white"} />
              <p className="pl-3">Course</p>
              <IoChevronDownSharp size={25} color={"white"} className="ml-16" />
            </button>
            {/*sub course button*/}
            {fetchedCourse &&
              fetchedCourse
                .filter(
                  (course, index, self) =>
                    index ===
                    self.findIndex((c) => c.courseName === course.courseName)
                )
                .map((course: FetchedCourse, index: number) => (
                  <button
                    key={index}
                    className="sidebarsub-btn-style w-full text-nowrap px-4 overflow-hidden hover:bg-neutral-500"
                    style={{
                      backgroundColor:
                        selectedCourseNo === course.courseNo ? "#727877 " : "",
                    }}
                    onClick={() => {
                      setSelectedCourseNo(course.courseNo || null);
                    }}
                  >
                    {`${course.courseNo || ""} ${course.courseName || ""}`}
                  </button>
                ))}
          </section>

          {/* feedback section*/}
          <section className="flex flex-col gap-y-2 mt-4 overflow-auto">
            {/* feedback button */}
            <button className="sidebar-btn-style flex flex-row justify-center items-center border-2 border-transparent hover:bg-stone-500 transition-colors duration-100">
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
                    className="sidebarsub-btn-style flex flex-row justify-center items-center hover:bg-neutral-500 "
                    style={{
                      backgroundColor:
                        selectedCourseNo === course.courseNo &&
                        selectedYear === course.academicYear &&
                        selectedSemester === course.semester
                          ? "#727877 "
                          : "",
                    }}
                    onClick={() => {
                      handleSubFeedbackClick(
                        course.courseName,
                        course.courseNo,
                        course.academicYear,
                        course.semester,
                        course.teachingMethodComments,
                        course.assessmentComments,
                        course.contentComments,
                        course.responseCount
                      );
                      setSelectedCourseNo(course.courseNo);
                      setSelectedYear(course.academicYear); // Set the selected year
                      setSelectedSemester(course.semester); // Set the selected semester
                    }}
                  >
                    <p
                      className="w-11/12 truncate"
                      title={`Year ${course.academicYear} Term ${course.semester} (${course.responseCount})`}
                    >
                      {" "}
                      {`Year ${course.academicYear} Term ${course.semester} (${course.responseCount})`}
                    </p>
                    <TiDeleteOutline
                      style={{
                        width: "24px",
                        height: "24px",
                        color: "red",
                        marginRight: "5px",
                      }}
                      className="w-1/12 transition-all duration-100 ease-in-out hover:scale-125"
                      // onClick={(e) => {
                      //   e.stopPropagation();
                      //   const isConfirmed = window.confirm(
                      //     "Are you sure you want to delete this feedback?"
                      //   );
                      //   if (isConfirmed) {
                      //     handleDeleteFeedback(
                      //       cmuAccount,
                      //       course.academicYear,
                      //       course.semester,
                      //       course.courseNo
                      //     );
                      //   }
                      // }}
                      onClick={() =>
                        handleDeleteFeedback(
                          cmuAccount,
                          course.academicYear,
                          course.semester,
                          course.courseNo
                        )
                      }
                    />
                  </button>
                ))}
          </section>

          {/* sumarize section*/}
          <section className="flex flex-col gap-y-2">
            {/* summarize button */}
            <button
              className="flex flex-row justify-center items-center mt-4 sidebar-btn-style hover:bg-neutral-500"
              onClick={() => toggleSummarize()}
            >
              <MdOutlineSubject size={30} />
              <p className="pl-3">Summarize</p>
            </button>
          </section>
          {/* dark mode section */}
          <button className="mt-4 sidebar-btn-style flex flex-row  justify-evenly items-center ">
            <div className="flex flex-row">
              <MdOutlineDarkMode size={30} />
              <p className="">Dark Mode</p>
            </div>
            <Switch
              defaultChecked
              color="green"
              size="md"
              onClick={toggleDarkMode}
              className="transition-all duration-1000 ease-in-out"
            />
          </button>

          {/* add feedback section */}
          <AddFeedbackBtn />
        </div>

        {/* logout */}
        <LogOutBtn />
      </div>
    </ScrollArea>
  );
};

export default SideBar;
