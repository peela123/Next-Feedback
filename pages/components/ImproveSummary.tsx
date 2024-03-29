import { FC, useEffect, useState } from "react";
import axios from "axios";
import { FetchedCourse, Comment } from "../../types/CommentType";

// import { FetchedCourse, Comment } from "../../types/CommentType";

import { BarChart } from "@mantine/charts";
import { Sparkline } from "@mantine/charts";
import { Stack, Text } from "@mantine/core";
import { AreaChart } from "@mantine/charts";
import { LineChart } from "@mantine/charts";
import { count } from "console";
import { headers } from "next/headers";

interface Props {
  cmuAccount: string;
  courseNo: number | undefined;
  isDarkMode: boolean;
}

interface Data {
  semesterNYear: string;
  Positive: number;
  Negative: number;
  Neutral: number;
}

const ImproveSummary: FC<Props> = ({ cmuAccount, courseNo, isDarkMode }) => {
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
    semesterNYear: ` ${course.academicYear} ${course.semester}`,
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
        backgroundColor: isDarkMode === true ? "#efefef" : " #404040",
        height: "42%",
        width: "100%",
        // backgroundColor: "#404040",
        color: "#9d9d9d",
      }}
    >
      <h1
        className="mx-auto mt-2 font-semibold text-gray-300"
        style={{ color: isDarkMode ? "#414141" : "" }}
      >
        Historical Statistic
      </h1>
      <div className="grow flex flex-row ">
        {fetchedData.length > 0 ? (
          <LineChart
            style={{ width: "95%", flexGrow: "0" }}
            color="rgba(207, 190, 190, 1)"
            data={prepareData}
            dataKey="semesterNYear"
            series={[
              { name: "Positive", color: "#51aa55" },
              { name: "Negative", color: "#e8493e" },
              { name: "Neutral", color: "#8a8a8a" },
            ]}
            curveType="linear"
            tickLine="y"
            gridAxis="y"
            withLegend
            // withGradient={false}
          />
        ) : (
          <div className="mx-auto my-auto">No data available</div>
        )}
      </div>
    </section>
  );
};

export default ImproveSummary;
