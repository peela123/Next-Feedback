import { FC, useEffect, useState } from "react";
import { FetchedCourse, Comment } from "../../types/CommentType";

import axios from "axios";

import { BarChart } from "@mui/x-charts/BarChart";

interface Props {
  cmuAccount: string;
  courseNo: number | undefined;
}

interface Data {
  data: number[];
  stack: "A" | "B" | "C";
  label?: "Positive" | "Negative" | "Neutral";
  color?: string;
  dataKey?: string;
  // labelText?: string;
  // xAxisKey?: string;
}

const OverallSummary: FC<Props> = ({ cmuAccount, courseNo }) => {
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
            // label: "Positive",
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

  const sample = [1, 10, 30, 50, 70, 90, 100];
  const dataset = [
    {
      london: 59,
      paris: 57,
      newYork: 86,
      seoul: 21,
      month: "January",
    },
    {
      london: 50,
      paris: 52,
      newYork: 78,
      seoul: 28,
      month: "February",
    },
    {
      london: 47,
      paris: 53,
      newYork: 106,
      seoul: 41,
      month: "March",
    },
    {
      london: 54,
      paris: 56,
      newYork: 92,
      seoul: 73,
      month: "April",
    },
    {
      london: 57,
      paris: 69,
      newYork: 92,
      seoul: 99,
      month: "May",
    },
    {
      london: 60,
      paris: 63,
      newYork: 103,
      seoul: 144,
      month: "June",
    },
    {
      london: 59,
      paris: 60,
      newYork: 105,
      seoul: 319,
      month: "July",
    },
    {
      london: 65,
      paris: 60,
      newYork: 106,
      seoul: 249,
      month: "August",
    },
    {
      london: 51,
      paris: 51,
      newYork: 95,
      seoul: 131,
      month: "September",
    },
    {
      london: 60,
      paris: 65,
      newYork: 97,
      seoul: 55,
      month: "October",
    },
    {
      london: 67,
      paris: 64,
      newYork: 76,
      seoul: 48,
      month: "November",
    },
    {
      london: 61,
      paris: 70,
      newYork: 103,
      seoul: 25,
      month: "December",
    },
  ];

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
      <h1 className=" mx-auto font-semibold text-gray-300">
        Course Overall Summary
      </h1>
      <div className="flex flex-row grow">
        <BarChart
          dataset={dataset}
          series={barData}
          height={400}
          width={1200}
          xAxis={[{ scaleType: "band", dataKey: "month" }]}
          yAxis={[
            { id: "linearAxis", scaleType: "linear" },
            { id: "logAxis", scaleType: "log" },
          ]}
          leftAxis="linearAxis"
          // legend
          slotProps={{
            legend: {
              direction: "row",
              position: { vertical: "top", horizontal: "right" },
              padding: 13,
            },
          }}
        />
      </div>
    </section>
  );
};

export default OverallSummary;
