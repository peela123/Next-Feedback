import { FC, useEffect, useState } from "react";
import { FetchedCourse, Comment } from "../../types/CommentType";

import axios from "axios";

import { BarChart } from "@mui/x-charts/BarChart";

interface Props {
  cmuAccount: string;
  courseNo: number | undefined;
  isDarkMode: boolean;
}
interface Data {
  data: number[];
  stack: "A" | "B" | "C";
  label?: string;
  color?: string;
  dataKey?: string;
}

const OverallSummary: FC<Props> = ({ cmuAccount, courseNo, isDarkMode }) => {
  const [fetchedData, setFetchedData] = useState<FetchedCourse[]>([]);

  const [barData, setBarData] = useState<Data[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:5000/api/user_course?cmuAccount=${cmuAccount}&courseNo=${courseNo}`
        );
        const courses: FetchedCourse[] = response.data;
        setFetchedData(courses);

        // Process the fetched data to calculate sentiments
        const sentimentAnalysis = courses.map((course) => {
          let teachingMethodSentiment = {
            Positive: 0,
            Negative: 0,
            Neutral: 0,
          };
          let assessmentSentiment = { Positive: 0, Negative: 0, Neutral: 0 };
          let contentSentiment = { Positive: 0, Negative: 0, Neutral: 0 };

          course.teachingMethodComments.forEach((comment) => {
            teachingMethodSentiment[comment.sentiment]++;
          });

          course.assessmentComments.forEach((comment) => {
            assessmentSentiment[comment.sentiment]++;
          });

          course.contentComments.forEach((comment) => {
            contentSentiment[comment.sentiment]++;
          });

          return {
            teachingMethodSentiment,
            assessmentSentiment,
            contentSentiment,
          };
        });

        // Initialize barData format
        const newBarData: Data[] = [
          {
            data: sentimentAnalysis.map(
              (a) => a.teachingMethodSentiment.Positive
            ),
            stack: "A",
            label: "Positive",
            color: "#4CAF50",
          },
          {
            data: sentimentAnalysis.map(
              (a) => a.teachingMethodSentiment.Negative
            ),
            stack: "A",
            label: "Negative",
            color: "#F44336",
          },
          {
            data: sentimentAnalysis.map(
              (a) => a.teachingMethodSentiment.Neutral
            ),
            stack: "A",
            label: "Neutral",
            color: "#8b8b8b",
          },
          {
            data: sentimentAnalysis.map((a) => a.assessmentSentiment.Positive),
            stack: "B",
            // label: "AM Positive",
            color: "#4CAF50",
          },
          {
            data: sentimentAnalysis.map((a) => a.assessmentSentiment.Negative),
            stack: "B",
            // label: "Negative",
            color: "#F44336",
          },
          {
            data: sentimentAnalysis.map((a) => a.assessmentSentiment.Neutral),
            stack: "B",
            // label: "Neutral",
            color: "#8b8b8b",
          },
          {
            data: sentimentAnalysis.map((a) => a.contentSentiment.Positive),
            stack: "C",
            // label: "Positive",
            color: "#4CAF50",
          },
          {
            data: sentimentAnalysis.map((a) => a.contentSentiment.Negative),
            stack: "C",
            // label: "Negative",
            color: "#F44336",
          },
          {
            data: sentimentAnalysis.map((a) => a.contentSentiment.Neutral),
            stack: "C",
            // label: "Neutral",
            color: "#8b8b8b",
          },
        ];

        setBarData(newBarData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [cmuAccount, courseNo]);

  const sample = fetchedData.map((course) => {
    return `${course.academicYear} ${course.semester}`;
  });

  return (
    <section
      style={{
        backgroundColor: isDarkMode === true ? "#efefef" : " #404040",
        color: "#9d9d9d",
        width: "100%",
        height: "54.5%",
        boxSizing: "border-box",
      }}
      className="flex flex-col rounded overflow-auto "
    >
      <h1
        className=" mx-auto mt-2 font-semibold text-gray-300"
        style={{ color: isDarkMode ? "#414141" : "" }}
      >
        Course Overall Summary
      </h1>

      <div className="flex flex-row grow overflow-x-hidden overflow-y-hidden ">
        {fetchedData.length > 0 ? (
          <BarChart
            // dataset={dataset}

            series={barData}
            height={330}
            width={1700}
            margin={
              {
                // left: 180,
                // // right: 80,
                // top: 80,
                // bottom: 80,
              }
            }
            // xAxis={[{ scaleType: "band", dataKey: "year" }]}
            xAxis={[
              {
                labelStyle: {
                  fontSize: 20,
                  fill: isDarkMode ? "black" : "rgb(209 213 219)",
                },
                tickLabelStyle: {
                  fill: isDarkMode ? "black" : "rgb(209 213 219)",
                  angle: 0,
                  textAnchor: "start",
                  fontSize: 15,
                },
                scaleType: "band",

                data: sample,
                // dataKey: "year",
                id: "semester",
                label: "semester",
              },
            ]}
            yAxis={[
              {
                tickLabelStyle: {
                  fill: "black",
                  angle: 0,
                  // textAnchor: "start",
                  fontSize: 15,
                },
                id: "linearAxis",
                scaleType: "linear",
                label: "#unit",

                labelStyle: {
                  fontSize: 18,

                  fill: isDarkMode ? "black" : "rgb(209 213 219)",
                },
              },
              // { id: "logAxis", scaleType: "log" },
            ]}
            // leftAxis="linearAxis"
            // legend
            slotProps={{
              legend: {
                direction: "row",
                position: { vertical: "top", horizontal: "right" },
                padding: 10,
              },
            }}
          />
        ) : (
          <div className="mx-auto my-auto">no data available</div>
        )}
      </div>
    </section>
  );
};

export default OverallSummary;
