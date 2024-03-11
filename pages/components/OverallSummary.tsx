import { FC } from "react";
import { FetchedCourse, Comment } from "../../types/CommentType";

import { BarChart } from "@mantine/charts";

interface Props {
  fetchedCourse: FetchedCourse[];
  courseNo: number | undefined;
}

const OverallSummary: FC<Props> = ({ fetchedCourse, courseNo }) => {
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

  const data = [
    { month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
    { month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
    { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
    { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
    { month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
    { month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
  ];

  return (
    <section
      style={{ backgroundColor: "#FDFDFD", width: "1200px", height: "50%" }}
      className="flex flex-col border-2 border-black rounded"
    >
      <h1 className="summary-text-style mx-4 my-2 bg-red-200 w-fit">
        Course Overall Summary(Label Summary with Sentiment Percentage)
      </h1>
      <div className="bg-blue-100  flex flex-row grow">
        {matchedCourses.length > 0 ? (
          <BarChart
            className="flex flex-col text-center grow bg-red-100"
            h={"100%"}
            w={500}
            data={data}
            dataKey="month"
            type="stacked"
            withLegend
            tickLine="none"
            legendProps={{ verticalAlign: "top" }}
            series={[
              {
                name: "Smartphones",
                label: "Smartphones sales",
                color: "violet.6",
              },
              { name: "Laptops", label: "Laptops sales", color: "blue.6" },
              { name: "Tablets", label: "Tablets sales", color: "teal.6" },
            ]}
          />
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
