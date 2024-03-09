import { useState, useEffect, FC } from "react";
// import { useLocation } from "react-router-dom";
import { useRouter } from "next/router";
import axios, { AxiosError, AxiosResponse } from "axios";

import { WhoAmIResponse } from "./api/whoAmI";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import BarCharts from "./components/BarCharts";
import PieCharts from "./components/PieCharts";
interface FetchedCourse {
  courseName: string;
  courseNo: number;
  semester: string;
  academicYear: number;
  cmuAccount: string;
  teachingMethodComments: Comment[];
  assessmentComments: Comment[];
  contentComments: Comment[];
}
interface Comment {
  text: string;
  sentiment: string;
  label: string;
}

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
        // console.log("user courses:", res.data);
        setFetchedCourse(res.data);
        // console.log("user courses:", res.data);
        // console.log("fetched course:", fetchedCourse);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [cmuAccount]);

  return (
    <main className="bg-cyan-400 h-screen">
      {/* <Navbar /> */}
      {/* main container */}
      <div className="flex flex-row h-full bg-red-600">
        {/* left side container*/}
        <div className="flex w-2/12 h-full">
          <SideBar
            fetchedCourse={fetchedCourse}
            onCourseBtnClick={handleCourseBtnClick}
            fullName={fullName}
            cmuAccount={cmuAccount}
          />
        </div>
        {/* right side container*/}
        <div
          className="flex flex-col h-full grow w-10/12"
          style={{ backgroundColor: "#7C6B6B" }}
        >
          {/* summary container */}
          <section
            className="flex flex-col bg-red-400 mt-6 ml-6 rounded-lg"
            style={{
              backgroundColor: "#3b3b3b",
              height: "93%",
              width: "1200px",
            }}
          >
            {/* summary text container*/}
            <div
              className="rounded-lg w-fit ml-6 my-4"
              style={{
                backgroundColor: "#3C3939",
                borderColor: "#151212",
                borderWidth: "2px",
              }}
            >
              <h1 className="summary-text-style py-1.5 px-3">
                {`หัวข้อที่ถูกพูดถึง(${
                  (teachingMethodComments?.length ?? 0) +
                  (assessmentComments?.length ?? 0) +
                  (contentComments?.length ?? 0)
                })`}
              </h1>
            </div>
            {/*  each labels container*/}
            <div
              className="overflow-auto rounded-lg pl-8 pt-2 w-full h-full text-gray-300"
              // style={{ height: "325px" }}
            >
              <div>
                <h1 className="summary-text-style mb-1">
                  Content ({contentComments?.length ?? 0})
                </h1>
                <ul>
                  {contentComments?.map((comment: Comment, index: number) => (
                    // <li
                    //   key={index}
                    // >{`comment: ${comment.text} sentiment: ${comment.sentiment} label: ${comment.label}`}</li>
                    <li key={index}>{`comment: ${comment.text}`}</li>
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
                      // <li
                      //   key={index}
                      // >{`comment: ${comment.text} sentiment: ${comment.sentiment} label: ${comment.label}`}</li>
                      <li key={index}>{`comment: ${comment.text}`}</li>
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
                      // <li
                      //   key={index}
                      // >{`comment: ${comment.text} sentiment: ${comment.sentiment} label: ${comment.label}`}</li>
                      <li key={index}>{`comment: ${comment.text}`}</li>
                    )
                  )}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Analyze;
