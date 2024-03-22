import { FC, useEffect, useState } from "react";
import axios from "axios";
import { FetchedCourse, Comment } from "../../types/CommentType";

// import { FetchedCourse, Comment } from "../../types/CommentType";

import { BarChart } from "@mantine/charts";
import { Sparkline } from "@mantine/charts";
import { Stack, Text } from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { count } from "console";
import { headers } from "next/headers";

interface Props {
  // fetchedCourse: FetchedCourse[];
  cmuAccount: string;
  courseNo: number | undefined;
}

interface Data {
  semesterNYear: string;
  Positive: number;
  Negative: number;
  Neutral: number;
}

const ImproveSummary: FC<Props> = ({ cmuAccount, courseNo }) => {
  const [fetchedData, setFetchedData] = useState<FetchedCourse[]>([]);

  const countSentiment = (arr: Comment[], option: string): number => {
    let pos = 0,
      neg = 0,
      neu = 0;

    arr.forEach((comment) => {
      switch (comment.sentiment) {
        case "Positive":
          pos++;
          break;
        case "Negative":
          neg++;
          break;
        case "Neutral":
          neu++;
          break;
      }
    });

    if (option === "Pos") return pos;
    else if (option === "Neg") return neg;
    else if (option === "Neu") return neu;

    return 0;
  };
  const prepareData: Data[] = fetchedData.map((course) => ({
    semesterNYear: `ปี${course.academicYear}เทอม${course.semester}`,
    Positive:
      countSentiment(course.teachingMethodComments, "Pos") +
      countSentiment(course.assessmentComments, "Pos") +
      countSentiment(course.contentComments, "Pos"),
    Negative:
      countSentiment(course.teachingMethodComments, "Neg") +
      countSentiment(course.assessmentComments, "Neg") +
      countSentiment(course.contentComments, "Neg"),
    Neutral:
      countSentiment(course.teachingMethodComments, "Neu") +
      countSentiment(course.assessmentComments, "Neu") +
      countSentiment(course.contentComments, "Neu"),
  }));

  // console.log("prepare data:", prepareData);

  // fetch course by courseNo and cmuAccount
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:5000/api/user_course?cmuAccount=${cmuAccount}&courseNo=${courseNo}`
      )
      .then((res) => {
        //axios already parse JSON to javascript object
        setFetchedData(res.data);
        // console.log("fetchedData", fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [cmuAccount, courseNo]);

  return (
    <section
      className=" rounded flex flex-col"
      style={{
        height: "48%",
        width: "100%",
        backgroundColor: "#363636",
        color: "#9d9d9d",
      }}
    >
      <h1 className="mx-auto font-semibold text-gray-300">
        Historical Statistic
      </h1>
      <div className="grow flex flex-row ">
        {fetchedData.length > 0 ? (
          <AreaChart
            style={{ width: "95%", flexGrow: "0" }}
            color="rgba(207, 190, 190, 1)"
            data={prepareData}
            dataKey="semesterNYear"
            series={[
              { name: "Positive", color: "lime" },
              { name: "Negative", color: "red" },
              { name: "Neutral", color: "#808080" },
            ]}
            curveType="linear"
            tickLine="xy"
            gridAxis="xy"
            withGradient={false}
          />
        ) : (
          <div className="flex flex-row w-full  justify-center items-center">
            No data available
          </div>
        )}
      </div>
    </section>
  );
};

export default ImproveSummary;
