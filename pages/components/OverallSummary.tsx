import { FC } from "react";
import { FetchedCourse, Comment } from "../../types/CommentType";

interface Props {
  fetchedCourse: FetchedCourse[];
  courseNo: number | undefined;
}

const OverallSummary: FC<Props> = ({ fetchedCourse, courseNo }) => {
  // Filter to always get an array, even if it's empty on no match.
  const matchedCourses = fetchedCourse.filter(
    (course) => course.courseNo === courseNo
  );
  return (
    <section
      style={{ backgroundColor: "#FDFDFD", width: "1200px", height: "50%" }}
      className="flex flex-col border-2 border-black rounded"
    >
      <h1 className="summary-text-style ml-4 mt-4 bg-red-200 w-fit">
        Course Overall Summary(Label Summary with Sentiment Percentage)
      </h1>
      <div className="bg-blue-200  flex flex-row grow">
        {matchedCourses.length > 0 ? (
          <p>data here</p>
        ) : (
          <div className="w-full flex justify-center items-center bg-red-400">
            <p className="text-xl">No data available .</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default OverallSummary;
