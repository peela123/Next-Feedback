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
  label?: string;
  color?: string;
}

const OverallSummary: FC<Props> = ({ cmuAccount, courseNo }) => {
  // const [fetchedData, setFetchedData] = useState<FetchedCourse[]>([]);

  const [fetchedBarData, setFetchedBarData] = useState<Data[]>([]);

  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:5000/api/user_bar_chart?cmuAccount=${cmuAccount}&courseNo=${courseNo}`
      )
      .then((res) => {
        //axios already parse JSON to javascript object
        // setFetchedBarData(res.data);

        const colors = ["#d42c15", "#08c446", "#808080"];
        const processedData = res.data.map(
          (item: FetchedCourse, index: number) => ({
            ...item,
            // Use the index to cycle through the colors array
            color: colors[index % colors.length],
          })
        );

        setFetchedBarData(processedData);

        console.log("fetchedBarData:", res.data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [cmuAccount, courseNo]);

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
        {/* <p>sds</p> */}
        {/* <p>sdsds</p> */}
        <BarChart
          // style={{ width: "100%", height: "100%" }}

          series={fetchedBarData}
          // width={200}
          // height={280}
        />
        {/* <BarChart
          series={[
            { data: [3, 4, 1], stack: "A", label: "Series A1" },
            { data: [4, 3, 1], stack: "A", label: "Series A2", color: "red" },
            { data: [5, 4, 1], stack: "B", label: "Series B1" },
            { data: [2, 8, 1], stack: "B", label: "Series B2" },
            { data: [10, 8, 9], label: "Series C1" },
          ]}
          width={600}
          height={350}
        /> */}
      </div>
    </section>
  );
};

export default OverallSummary;
