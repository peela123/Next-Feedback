import { FC, useEffect, useState } from "react";
import axios from "axios";
import { FetchedCourse, Comment } from "../../types/CommentType";
import BarCharts from "./BarCharts";
interface Props {
  // fetchedCourse: FetchedCourse[];
  cmuAccount: string;
  courseNo: number | undefined;
}

const SentimentSummary: FC<Props> = ({ cmuAccount, courseNo }) => {
  const [fetchedData, setFetchedData] = useState<FetchedCourse[]>([]);

  // // Filter to always get an array, even if it's empty on no match.
  // let matchedCourses = fetchedCourse.filter(
  //   (course) => course.courseNo === courseNo
  // );

  // Sort matched courses by academicYear first, then by semester.
  // let matchedCourses = fetchedData.sort((a, b) => {
  //   // Compare by academicYear first
  //   if (a.academicYear !== b.academicYear) {
  //     return a.academicYear - b.academicYear;
  //   }
  //   return a.semester.localeCompare(b.semester);
  // });

  // useEffect(() => {
  //   console.log("input courseno:", courseNo);
  //   console.log("matched course:", matchedCourses);
  // }, [courseNo]);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:5000/api/user_course?cmuAccount=${cmuAccount}&courseNo=${courseNo}`
      )
      .then((res) => {
        //axios already parse JSON to javascript object
        setFetchedData(res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [cmuAccount, courseNo]);

  return (
    <section
      style={{
        backgroundColor: "#FDFDFD",
        width: "1200px",
        height: "48.5%",
        borderWidth: "0px",
      }}
      className="flex flex-col"
    >
      <p className=" w-max mx-4 my-2 summary-text-style">
        Each Semester Sentiment Summary
      </p>
      <div className="grow flex flex-row overflow-auto">
        {fetchedData.length > 0 ? (
          // Map through matchedCourses if there are any
          fetchedData.map((course, index) => (
            <div key={index} className="flex flex-col h-full text-center">
              <BarCharts
                teachingMethodComments={course.teachingMethodComments}
                assessmentComments={course.assessmentComments}
                contentComments={course.contentComments}
                academicYear={course.academicYear}
                semester={course.semester}
              />
              <p className="grow-0">
                ปีการศึกษา {course.academicYear} ภาคเรียนที่ {course.semester}
              </p>
            </div>
          ))
        ) : (
          // Render nothing or a placeholder if no courses match
          // <p>No data available for the selected course number.</p>
          <div className="w-full justify-center flex items-center">
            <p className="text-xl">No data available .</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default SentimentSummary;
