import React, { FC, useState, useEffect } from "react";
import { PieChart } from "@mantine/charts";

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

const PieCharts: FC<Props> = ({ tmComments, amComments, cComments }) => {
  const [posVal, setPosVal] = useState<number>(0);
  const [negVal, setNegVal] = useState<number>(0);
  const [neuVal, setNeuVal] = useState<number>(0);
  const data = [
    { name: "Positive", value: posVal, color: "teal" },
    { name: "Negative", value: negVal, color: "red" },
    { name: "Neutral", value: neuVal, color: "gray" },
  ];

  useEffect(() => {
    const combinedComments = [
      ...(tmComments || []),
      ...(amComments || []),
      ...(cComments || []),
    ];

    let totalPos = 0;
    let totalNeg = 0;
    let totalNeu = 0;

    combinedComments.forEach((comment) => {
      if (comment.sentiment.toLowerCase() === "positive") totalPos += 1;
      if (comment.sentiment.toLowerCase() === "negative") totalNeg += 1;
      if (comment.sentiment.toLowerCase() === "neutral") totalNeu += 1;
    });

    // Update all at once
    setPosVal(totalPos);
    setNegVal(totalNeg);
    setNeuVal(totalNeu);

    // console.log("total pos", totalPos);
    // console.log("pos val", posVal);

    // Debug: Log statements here won't reflect the updated state immediately
  }, [tmComments, amComments, cComments]); // Assuming your dependency array is correctly set up for your use case

  return (
    <PieChart
      size={180}
      withLabelsLine={false}
      labelsPosition="inside"
      withLabels
      withTooltip
      data={data}
      strokeWidth={2}
    />
  );
};

export default PieCharts;
