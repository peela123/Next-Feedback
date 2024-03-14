import { FC, useEffect, useState } from "react";
import { FetchedCourse, Comment } from "../../types/CommentType";

import axios from "axios";

// import { BarChart } from "@mantine/charts";
import { BarChart } from "@mui/x-charts/BarChart";

interface Props {
  cmuAccount: string;
  courseNo: number | undefined;
}

const OverallSummary: FC<Props> = ({ cmuAccount, courseNo }) => {
  const [fetchedData, setFetchedData] = useState<FetchedCourse[]>([]);

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

  const data = [
    { month: "January", Smartphones: 1200, Laptops: 900, Tablets: 200 },
    { month: "February", Smartphones: 1900, Laptops: 1200, Tablets: 400 },
    { month: "March", Smartphones: 400, Laptops: 1000, Tablets: 200 },
    { month: "April", Smartphones: 1000, Laptops: 200, Tablets: 800 },
    { month: "May", Smartphones: 800, Laptops: 1400, Tablets: 1200 },
    { month: "June", Smartphones: 750, Laptops: 600, Tablets: 1000 },
  ];

  const coursePrepare = (course: FetchedCourse) => {
    const tmLength = course.teachingMethodComments.length;
    const amLength = course.assessmentComments.length;
    const cLength = course.contentComments.length;

    let tmPos = 0,
      tmNeg = 0,
      tmNeu = 0;

    let amPos = 0,
      amNeg = 0,
      amNeu = 0;

    let cPost = 0,
      cNeg = 0,
      cNeu = 0;

    course.teachingMethodComments.forEach((comment) => {
      switch (comment.sentiment) {
        case "Positive":
          tmPos++;
        case "Negative":
          tmNeg++;
        case "Neutral":
          tmNeu++;
      }
    });

    course.assessmentComments.forEach((comment) => {
      switch (comment.sentiment) {
        case "Positive":
          tmPos++;
        case "Negative":
          tmNeg++;
        case "Neutral":
          tmNeu++;
      }
    });

    course.contentComments.forEach((comment) => {
      switch (comment.sentiment) {
        case "Positive":
          tmPos++;
        case "Negative":
          tmNeg++;
        case "Neutral":
          tmNeu++;
      }
    });
  };

  return (
    <section
      style={{
        // backgroundColor: "#FDFDFD",
        backgroundColor: "#363636",
        color: "#9d9d9d",
        width: "1200px",
        height: "48.5%",
        boxSizing: "border-box",
      }}
      className="flex flex-col rounded overflow-auto "
    >
      <h1 className=" mx-auto font-semibold">Course Overall Summary</h1>
      <div className="flex flex-row grow bg-red-400">
        <BarChart
          // style={{ width: "100%", height: "100%" }}
          series={[
            { data: [3, 4, 1], stack: "A" }, //label teachingMethod with 3 semester
            { data: [4, 3, 1], stack: "A" }
            // { data: [4, 2, 5, 4, 1], stack: "B" },
            { data: [2, 8, 1], stack: "B" },
            { data: [10, 6, 5], stack: "C" },
          ]}
          // width={600}
          height={280}
        />
        {/* {matchedCourses.length !== 0 ? (
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
        )} */}
      </div>
    </section>
  );
};

export default OverallSummary;
