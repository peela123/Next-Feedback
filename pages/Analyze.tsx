import { useState, useEffect, FC } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError, AxiosResponse } from "axios";

import { WhoAmIResponse } from "./api/whoAmI";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import BarCharts from "./components/BarCharts";
import PieCharts from "./components/PieCharts";
import { Label } from "recharts";
import OverallSummary from "./components/OverallSummary";
import SentimentSummary from "./components/SentimentSummary";

import { FetchedCourse, Comment } from "../types/CommentType";

const Analyze: FC = () => {
  const [fetchedCourse, setFetchedCourse] = useState<FetchedCourse[]>([]); //array for store course object
  const [courseName, setCourseName] = useState<string>();
  const [courseNo, setCourseNo] = useState<number>();
  const [academicYear, setAcademicYear] = useState<number>();
  const [semester, setSemester] = useState<string>();

  const [teachingMethodComments, setTeachingMethodComments] = useState<
    Comment[] | null
  >(null);
  const [assessmentComments, setAssessmentComments] = useState<
    Comment[] | null
  >(null);
  const [contentComments, setContentComments] = useState<Comment[] | null>(
    null
  );

  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [cmuAccount, setCmuAccount] = useState<string>("");
  const [studentId, setStudentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isSummarize, setIsSummarize] = useState<boolean>(false);

  const handleCourseBtnClick = (
    name: string,
    no: number,
    year: number,
    term: string,
    tmComments: Comment[],
    amComments: Comment[],
    cComments: Comment[]
  ) => {
    setCourseName(name);
    setCourseNo(no);
    setAcademicYear(year);
    setSemester(term);

    setTeachingMethodComments(tmComments);
    setAssessmentComments(amComments);
    setContentComments(cComments);
  };

  const toggleSummarize = () => {
    setIsSummarize((prevIsSummarize) => !prevIsSummarize);
  };

  //get auth info
  useEffect(() => {
    //All cookies that belong to the current url will be sent with the request automatically
    //so we don't have to attach token to the request
    //You can view token (stored in cookies storage) in browser devtools (F12). Open tab "Application" -> "Cookies"
    axios
      .get<{}, AxiosResponse<WhoAmIResponse>, {}>("/api/whoAmI")
      .then((response) => {
        const data = response.data;
        if (data.ok) {
          setFullName(data.firstName + " " + data.lastName);
          setCmuAccount(data.cmuAccount);
          setStudentId(data.studentId ?? "No Student Id");
        }
      })
      .catch((error: AxiosError<WhoAmIResponse>) => {
        if (!error.response) {
          setErrorMessage(
            "Cannot connect to the network. Please try again later."
          );
        } else if (error.response.status === 401) {
          setErrorMessage("Authentication failed");
        } else if (error.response.data && error.response.data.ok === false) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Unknown error occurred. Please try again later");
        }
      });
  }, []);

  //retrive all course according to cmuAccount
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/user_courses?cmuAccount=${cmuAccount}`)
      .then((res) => {
        //axios already parse JSON to javascript object
        setFetchedCourse(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [cmuAccount]);

  return (
    <main className="bg-cyan-400 h-screen">
      {/* main container */}
      <div className="flex flex-row h-full bg-red-600">
        {/* left side container*/}
        <div className="flex w-2/12 h-full">
          <SideBar
            fetchedCourse={fetchedCourse}
            onCourseBtnClick={handleCourseBtnClick}
            fullName={fullName}
            cmuAccount={cmuAccount}
            isSummarize={isSummarize} // You're already passing this correctly
            toggleSummarize={toggleSummarize} // Make sure this line is included
          />
        </div>

        {/* right side container*/}
        <div
          className="flex flex-col h-full grow w-10/12"
          // style={{ backgroundColor: "#7C6B6B" }}
          style={{ backgroundColor: "#EFEFEF" }}
        >
          {isSummarize ? (
            // summarize container
            <section
              className="flex flex-col justify-between mt-6 ml-6 rounded-lg bg-red-400"
              style={{
                height: "93%",
                width: "1200px",
                // backgroundColor: "#fdfdfd",
                backgroundColor: "#D9D9D9",
              }}
            >
              <div className="rounded-lg w-fit ml-6 my-4">
                {/* <p style={{ color: "#414141" }}> */}
                <p>
                  ปีการศึกษา {academicYear} ภาคเรียนที่ {semester} กระบวนวิชา{" "}
                  {courseName}
                  isSummarize {isSummarize ? "True" : "False"}
                </p>
                <h1 className="text-xl ">
                  {`หัวข้อที่พูดถึง(${
                    (teachingMethodComments?.length ?? 0) +
                    (assessmentComments?.length ?? 0) +
                    (contentComments?.length ?? 0)
                  })`}
                </h1>
              </div>
              <div className="grow bg-red-400">
                <OverallSummary />
                <SentimentSummary
                  fetchedCourse={fetchedCourse}
                  courseNo={courseNo}
                />
              </div>
            </section>
          ) : (
            // feedback container
            <section
              className="flex flex-col mt-6 ml-6 rounded-lg"
              style={{
                backgroundColor: "#D9D9D9",

                height: "93%",
                width: "1200px",
              }}
            >
              <div className="rounded-lg w-fit ml-6 my-4">
                <p style={{ color: "#414141" }}>
                  ปีการศึกษา {academicYear} ภาคเรียนที่ {semester} กระบวนวิชา{" "}
                  {courseName}
                  isSummarize {isSummarize ? "True" : "False"}
                </p>
                <h1 className="text-xl ">
                  {`หัวข้อที่พูดถึง(${
                    (teachingMethodComments?.length ?? 0) +
                    (assessmentComments?.length ?? 0) +
                    (contentComments?.length ?? 0)
                  })`}
                </h1>
              </div>

              <div
                className="overflow-auto rounded-lg pl-8 pt-2 w-full h-full"
                style={{ backgroundColor: "#FDFDFD" }}
              >
                <div>
                  <h1 className="summary-text-style mb-1">
                    Content ({contentComments?.length ?? 0})
                  </h1>
                  <ul>
                    {contentComments?.map((comment: Comment, index: number) => (
                      <li
                        key={index}
                      >{`comment: ${comment.text} sentiment: ${comment.sentiment} label: ${comment.label}`}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h1 className="summary-text-style mb-1">
                    Assessment ({assessmentComments?.length ?? 0})
                  </h1>
                  <ul>
                    {assessmentComments?.map(
                      (comment: Comment, index: number) => (
                        <li
                          key={index}
                        >{`comment: ${comment.text} sentiment: ${comment.sentiment} label: ${comment.label}`}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h1 className="summary-text-style mb-1">
                    Teaching Method ({teachingMethodComments?.length ?? 0})
                  </h1>
                  <ul>
                    {teachingMethodComments?.map(
                      (comment: Comment, index: number) => (
                        <li
                          key={index}
                        >{`comment: ${comment.text} sentiment: ${comment.sentiment} label: ${comment.label}`}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
};

export default Analyze;
