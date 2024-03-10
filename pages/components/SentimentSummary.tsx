import { FC, useEffect, useState } from "react";
import { FetchedCourse, Comment } from "../../types/CommentType";
import BarCharts from "./BarCharts";
interface Props {
  fetchedCourse: FetchedCourse[];
  courseNo: number | undefined;
}

const SentimentSummary: FC<Props> = ({ fetchedCourse, courseNo }) => {
  // Filter to always get an array, even if it's empty on no match.
  const matchedCourses = fetchedCourse.filter(
    (course) => course.courseNo === courseNo
  );

  // useEffect(() => {
  //   console.log("input courseno:", courseNo);
  //   console.log("matched course:", matchedCourses);
  // }, [courseNo]);

  return (
    <section
      style={{ backgroundColor: "#FDFDFD", width: "1200px", height: "50%" }}
      className="flex flex-col border-2 border-black rounded"
    >
      <p className="bg-red-400 w-max ml-4 mt-4 summary-text-style">
        Each Semester Sentiment Summary
      </p>
      <div className="grow flex flex-row">
        {matchedCourses.length > 0 ? (
          // Map through matchedCourses if there are any
          matchedCourses.map((course, index) => (
            <div key={index} className="w-1/4">
              <BarCharts
                teachingMethodComments={course.teachingMethodComments}
                assessmentComments={course.assessmentComments}
                contentComments={course.contentComments}
              />
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
