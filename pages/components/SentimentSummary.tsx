import { FC, useEffect, useState } from "react";
import { FetchedCourse, Comment } from "../../types/CommentType";
import BarCharts from "./BarCharts";
interface Props {
  fetchedCourse: FetchedCourse[];
  courseNo: number | undefined;
}

const SentimentSummary: FC<Props> = ({ fetchedCourse, courseNo }) => {
  // Filter to always get an array, even if it's empty on no match.
  let matchedCourses = fetchedCourse.filter(
    (course) => course.courseNo === courseNo
  );

  // Sort matched courses by academicYear first, then by semester.
  matchedCourses = matchedCourses.sort((a, b) => {
    // Compare by academicYear first
    if (a.academicYear !== b.academicYear) {
      return a.academicYear - b.academicYear;
    }
    return a.semester.localeCompare(b.semester);
  });

  // useEffect(() => {
  //   console.log("input courseno:", courseNo);
  //   console.log("matched course:", matchedCourses);
  // }, [courseNo]);

  return (
    <section
      style={{ backgroundColor: "#FDFDFD", width: "1200px", height: "50%" }}
      className="flex flex-col border-2 border-black rounded"
    >
      <p className="bg-red-400 w-max mx-4 my-2 summary-text-style">
        Each Semester Sentiment Summary
      </p>
      <div className="grow flex flex-row overflow-auto  bg-red-200">
        {matchedCourses.length > 0 ? (
          // Map through matchedCourses if there are any
          matchedCourses.map((course, index) => (
            <div
              key={index}
              style={{
                flexShrink: 0,
              }}
              className="flex flex-col h-full text-center"
            >
              <BarCharts
                teachingMethodComments={course.teachingMethodComments}
                assessmentComments={course.assessmentComments}
                contentComments={course.contentComments}
                academicYear={course.academicYear}
                semester={course.semester}
              />
              <p className="grow-0">
                ปี{course.academicYear}เทอม{course.semester}
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
