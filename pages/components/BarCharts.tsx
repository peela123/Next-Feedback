import { FC, useState, useEffect } from "react";

import { BarChart } from "@mantine/charts";

interface Comment {
  text: string;
  sentiment: string;
  label: string;
}
interface Props {
  amComments: Comment[] | null;
  cComments: Comment[] | null;
  tmComments: Comment[] | null;
}
interface DataPlot {
  class: string;
  positive: number;
  negative: number;
  neutral: number;
}

const BarCharts: FC<Props> = ({ tmComments, amComments, cComments }) => {
  const [data, setData] = useState<DataPlot[]>([
    { class: "Content", positive: 0, negative: 0, neutral: 0 },
    { class: "Assessment", positive: 0, negative: 0, neutral: 0 },
    { class: "Teaching Method", positive: 0, negative: 0, neutral: 0 },
  ]);

  useEffect(() => {
    // Function to count sentiments for a given set of comments
    const countSentiments = (comments: Comment[] | null) => {
      let pos = 0,
        neg = 0,
        neu = 0;
      comments?.forEach((comment) => {
        switch (comment.sentiment.toLocaleLowerCase()) {
          case "positive":
            pos++;
            break;
          case "negative":
            neg++;
            break;
          case "neutral":
            neu++;
            break;
          default:
            break;
        }
      });
      return { pos, neg, neu };
    };

    // Updating counts for Teaching Method comments
    const tmCounts = countSentiments(tmComments);
    // Updating counts for Assessment comments
    const amCounts = countSentiments(amComments);
    // Updating counts for Content comments
    const cCounts = countSentiments(cComments);

    // Set the updated data state
    setData([
      {
        class: "Content",
        positive: cCounts.pos,
        negative: cCounts.neg,
        neutral: cCounts.neu,
      },
      {
        class: "Assessment",
        positive: amCounts.pos,
        negative: amCounts.neg,
        neutral: amCounts.neu,
      },
      {
        class: "Teaching Method",
        positive: tmCounts.pos,
        negative: tmCounts.neg,
        neutral: tmCounts.neu,
      },
    ]);
  }, [amComments, cComments, tmComments]); // Dependency array to re-run effect when any of the comments arrays changes

  return (
    <BarChart
      h={220}
      data={data}
      dataKey="class"
      // type="percent"
      tooltipAnimationDuration={200}
      withLegend
      series={[
        { name: "positive", label: "Positive", color: "green" },
        { name: "negative", label: "Negative", color: "red" },
        { name: "neutral", label: "Neutral", color: "gray.6" },
      ]}
      gridAxis="xy"
    />
  );
};

export default BarCharts;
