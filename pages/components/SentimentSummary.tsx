import { FC, useEffect, useState } from "react";
import BarCharts from "./BarCharts";

import { FetchedCourse, Comment } from "../../types/CommentType";
import { match } from "assert";
import { Bar } from "recharts";

interface Props {
  fetchedCourse: FetchedCourse[];
  courseNo: number | undefined;
}

const SentimentSummary: FC<Props> = ({ fetchedCourse, courseNo }) => {
  const [message, setMessage] = useState("Sentiment Analysis");
  //   const [courseNo, setCourseNo] = useState<number>(courseNo);
  // Find the course that matches the courseNo
  const matchedCourse = fetchedCourse.find(
    (course) => course.courseNo === courseNo
  );

  // Guard clause to handle case where no course matches the courseNo
  if (!matchedCourse) {
    return <div className="summary-text-style">Course not found</div>;
  }

  useEffect(() => {
    console.log("matched course:", matchedCourse);
  }, [courseNo]);

  return (
    <section
      style={{ backgroundColor: "#FDFDFD", width: "1200px", height: "50%" }}
      className="flex flex-col border-2 border-black rounded"
    >
      <p className="bg-red-400 w-max ml-4 mt-4 summary-text-style">
        Sentiment Summary
      </p>
      <div className="grow flex flex-row bg-red-300">
        {matchedCourse && (
          <div className="w-1/4">
            <BarCharts
              teachingMethodComments={matchedCourse.teachingMethodComments}
              assessmentComments={matchedCourse.assessmentComments}
              contentComments={matchedCourse.contentComments}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default SentimentSummary;
