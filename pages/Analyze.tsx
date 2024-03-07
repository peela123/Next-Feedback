import { FC } from "react";
// import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";

import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import BarCharts from "./components/BarCharts";
import PieCharts from "./components/PieCharts";

interface FetchedCourse {
  courseName: string;
  courseNo: number;
  semester: string;
  academicYear: number;

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

  //get value from home component by useNavigate() and store BasicInfo
  //   const location = useLocation();
  //   const [courseName, setCourseName] = useState<string>(
  //     location.state ? location.state.courseName : ""
  //   );

  //   const [courseNo, setCourseNo] = useState<number>(
  //     location.state ? location.state.courseNo : NaN
  //   );

  //   const [academicYear, setAcademicYear] = useState<number>(
  //     location.state ? location.state.academicYear : NaN
  //   );

  //   const [semester, setSemester] = useState<string>(
  //     location.state ? location.state.semester : ""
  //   );

  //   const [responseMessage, setResponseMessage] = useState<string>(
  //     location.state ? location.state.responseMessage : ""
  //   );
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

  //retrive all course for user account
  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/courses`)
      .then((res) => {
        //axios already parse JSON to javascript object
        setFetchedCourse(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, []);
  //   }, [location.state]);

  return (
    <main className="bg-cyan-400 h-screen">
      {/* <Navbar /> */}
      {/* main container */}
      <div className="flex flex-row h-full bg-red-600">
        {/* left side */}
        <div className="flex w-2/12 h-full">
          <SideBar
            fetchedCourse={fetchedCourse}
            onCourseBtnClick={handleCourseBtnClick}
          />
        </div>
        {/* right side */}
        <div
          className="flex flex-col h-full grow w-10/12"
          style={{ backgroundColor: "#7C6B6B" }}
        >
          {/* <p className="bg-blue-300">
            {`[current dataset] courseName = ${courseName} courseNo = ${courseNo}  selected year = ${academicYear} selected term = ${semester} responseMessage = ${responseMessage}`}
          </p> */}

          {/* pie and bar container */}
          {/* <section className="flex flex-row gap-x-12 ml-6 mr-10 mt-6 "> */}
          {/* pie container */}
          {/* <section
              style={{
                backgroundColor: "#3b3b3b",
                height: "200px",
                width: "270px",
              }}
              className="rounded-lg flex flex-row justify-center items-center"
            >
              <PieCharts
                tmComments={teachingMethodComments}
                amComments={assessmentComments}
                cComments={contentComments}
              />
            </section> */}
          {/* bar container */}
          {/* <section
              style={{
                backgroundColor: "#3b3b3b",
                height: "200px",
                width: "500px",
              }}
              className="rounded-lg w-24 flex flex-row justify-center items-center"
            >
              <BarCharts
                tmComments={teachingMethodComments}
                amComments={assessmentComments}
                cComments={contentComments}
              />
            </section> */}
          {/* </section> */}

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
