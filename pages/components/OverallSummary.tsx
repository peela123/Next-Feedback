import { FC, useEffect, useState } from "react";
// import { BarChart } from "@mui/x-charts/BarChart";
import { BarChart } from "@mantine/charts";
import { Bar } from "recharts";
import axios from "axios";

export interface FetchedCourse {
  courseName: string;
  courseNo: number;
  semester: string;
  academicYear: number;
  cmuAccount: string;
  teachingMethodComments: Comment[];
  assessmentComments: Comment[];
  contentComments: Comment[];
}

export interface Comment {
  text: string;
  sentiment: string;
  label: string;
}
interface Props {
  cmuAccount: string;
  fetchedCourse: FetchedCourse[];
  courseNo: number | undefined;
}

interface CategoryData {
  label: string;
  positive: number;
  negative: number;
  neutral: number;
}

const OverallSummary: FC<Props> = ({ cmuAccount, fetchedCourse, courseNo }) => {
  const [fetchedData, setFetchedData] = useState<FetchedCourse[]>([]);
  //filter fetchedCourse to match courseNo and sort with ascending order year and semester
  let matchedCourses = fetchedCourse
    .filter((course) => course.courseNo === courseNo)
    .sort((a, b) => {
      if (a.academicYear !== b.academicYear) {
        return a.academicYear - b.academicYear;
      }
      return a.semester.localeCompare(b.semester);
    });

  // fetch course by courseNo and cmuAccount
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

  const prepareData = (): any => {
    return fetchedData.map((course): CategoryData[] => {
      // Initialize counts
      let teachingMethodCounts = { positive: 0, negative: 0, neutral: 0 };
      let assessmentCounts = { positive: 0, negative: 0, neutral: 0 };
      let contentCounts = { positive: 0, negative: 0, neutral: 0 };

      // Count sentiments for teachingMethodComments
      course.teachingMethodComments.forEach((comment) => {
        if (comment.sentiment.toLowerCase() === "positive")
          teachingMethodCounts.positive++;
        else if (comment.sentiment.toLowerCase() === "negative")
          teachingMethodCounts.negative++;
        else if (comment.sentiment.toLowerCase() === "neutral")
          teachingMethodCounts.neutral++;
      });

      // Count sentiments for assessmentComments
      course.assessmentComments.forEach((comment) => {
        if (comment.sentiment.toLowerCase() === "positive")
          assessmentCounts.positive++;
        else if (comment.sentiment.toLowerCase() === "negative")
          assessmentCounts.negative++;
        else if (comment.sentiment.toLowerCase() === "neutral")
          assessmentCounts.neutral++;
      });

      // Count sentiments for contentComments
      course.contentComments.forEach((comment) => {
        if (comment.sentiment.toLowerCase() === "positive")
          contentCounts.positive++;
        else if (comment.sentiment.toLowerCase() === "negative")
          contentCounts.negative++;
        else if (comment.sentiment.toLowerCase() === "neutral")
          contentCounts.neutral++;
      });

      // Return an array for each course with objects for each category
      return [
        {
          label: "teachingMethod",
          positive: teachingMethodCounts.positive,
          negative: teachingMethodCounts.negative,
          neutral: teachingMethodCounts.neutral,
        },
        {
          label: "assessment",
          positive: assessmentCounts.positive,
          negative: assessmentCounts.negative,
          neutral: assessmentCounts.neutral,
        },
        {
          label: "content",
          positive: contentCounts.positive,
          negative: contentCounts.negative,
          neutral: contentCounts.neutral,
        },
      ];
    });
  };

  const dataForCharts = prepareData(); // Call the function to get the array of arrays

  const getPrepareData = (course: FetchedCourse) => {
    let teachingMethodCounts = { positive: 0, negative: 0, neutral: 0 };
    let assessmentCounts = { positive: 0, negative: 0, neutral: 0 };
    let contentCounts = { positive: 0, negative: 0, neutral: 0 };

    // Count sentiments for teachingMethodComments
    course.teachingMethodComments.forEach((comment) => {
      if (comment.sentiment.toLowerCase() === "positive")
        teachingMethodCounts.positive++;
      else if (comment.sentiment.toLowerCase() === "negative")
        teachingMethodCounts.negative++;
      else if (comment.sentiment.toLowerCase() === "neutral")
        teachingMethodCounts.neutral++;
    });

    // Count sentiments for assessmentComments
    course.assessmentComments.forEach((comment) => {
      if (comment.sentiment.toLowerCase() === "positive")
        assessmentCounts.positive++;
      else if (comment.sentiment.toLowerCase() === "negative")
        assessmentCounts.negative++;
      else if (comment.sentiment.toLowerCase() === "neutral")
        assessmentCounts.neutral++;
    });

    // Count sentiments for contentComments
    course.contentComments.forEach((comment) => {
      if (comment.sentiment.toLowerCase() === "positive")
        contentCounts.positive++;
      else if (comment.sentiment.toLowerCase() === "negative")
        contentCounts.negative++;
      else if (comment.sentiment.toLowerCase() === "neutral")
        contentCounts.neutral++;
    });
    return [
      {
        label: "teachingMethod",
        positive: teachingMethodCounts.positive,
        negative: teachingMethodCounts.negative,
        neutral: teachingMethodCounts.neutral,
      },
      {
        label: "assessment",
        positive: assessmentCounts.positive,
        negative: assessmentCounts.negative,
        neutral: assessmentCounts.neutral,
      },
      {
        label: "content",
        positive: contentCounts.positive,
        negative: contentCounts.negative,
        neutral: contentCounts.neutral,
      },
    ];
  };

  // useEffect(() => {
  //   console.log("Matched courses:", matchedCourses);
  //   console.log("Prepared data:", dataForCharts);
  // }, [matchedCourses, dataForCharts]); // Add dependencies to useEffect for correct update logging
  return (
    <section
      style={{
        backgroundColor: "#FDFDFD",
        width: "1200px",
        height: "48.5%",
        boxSizing: "border-box",
      }}
      className="flex flex-col  rounded overflow-auto "
    >
      <h1 className="summary-text-style mx-4 my-2  w-fit">
        Course Overall Summary
      </h1>
      <div className="flex flex-row h-full">
        {matchedCourses.length !== 0 ? (
          <section className="flex flex-row ">
            {matchedCourses.map((course: FetchedCourse, index: number) => (
              <div className=" flex flex-col items-center justify-center border-r-2 border-black">
                <BarChart
                  data={getPrepareData(course)} // Wrap the data object in an array
                  dataKey="label"
                  type="stacked"
                  style={{ minWidth: "400px" }}
                  className="w-full h-full"
                  series={[
                    { name: "positive", color: "#34eb49" }, // Adjusted colors for better visibility
                    { name: "negative", color: "#e83146" },
                    { name: "neutral", color: "#868e96" },
                  ]}
                />
                <p>
                  ปีการศึกษา
                  {course.academicYear} ภาคเรียนที่ {course.semester}
                </p>
              </div>
            ))}
          </section>
        ) : (
          <section className="w-full flex justify-center items-center ">
            <p className="text-xl">No data available.</p>
          </section>
        )}
      </div>
    </section>
  );
};

export default OverallSummary;
