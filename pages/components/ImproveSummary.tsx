import { FC, useEffect, useState } from "react";
import axios from "axios";
import { FetchedCourse, Comment } from "../../types/CommentType";

import { Stack, Text } from "@mantine/core";
import { AreaChart, LineChart, BarChart, Sparkline } from "@mantine/charts";
import { count } from "console";
import { headers } from "next/headers";
import { Avatar } from "@mantine/core";
import { LuPercent } from "react-icons/lu";

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

  const [isPercent, setIsPercent] = useState<boolean>(false);

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
        height: "40%",
        width: "100%",
        // backgroundColor: "#404040",
        color: "#9d9d9d",
      }}
    >
      <div className="flex flex-row justify-center items-center mt-3 ">
        <h1
          className="font-semibold text-gray-300 fixed"
          style={{ color: isDarkMode ? "#414141" : "" }}
        >
          Historical Statistic
        </h1>
        <button
          style={{ marginLeft: "1050px" }}
          className="hover: transition-all duration-200 ease-in-out hover:scale-110"
          onClick={() => setIsPercent(!isPercent)}
        >
          <Avatar variant="filled" color="#737373" size="2rem" radius="sm">
            <LuPercent color="white" size={16} />
          </Avatar>
        </button>
      </div>
      <div className="grow flex flex-row ">
        {fetchedData.length > 0 ? (
          isPercent ? (
            <BarChart
              h={210}
              style={{ width: "95%", flexGrow: "0" }}
              data={prepareData}
              dataKey="semesterNYear"
              type="percent"
              withLegend
              legendProps={{ verticalAlign: "top", height: 35 }}
              series={[
                { name: "Positive", color: "#51aa55" },
                { name: "Negative", color: "#e8493e" },
                { name: "Neutral", color: "#8a8a8a" },
              ]}
            />
          ) : (
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
              tickLine="x"
              gridAxis="xy"
              withLegend
              // withGradient={false}
            />
          )
        ) : (
          <div className="mx-auto my-auto">No data available</div>
        )}
      </div>
    </section>
  );
};

export default ImproveSummary;
