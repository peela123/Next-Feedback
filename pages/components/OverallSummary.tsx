import { FC } from "react";

const OverallSummary: FC = () => {
  return (
    <section
      style={{ backgroundColor: "#FDFDFD", width: "1200px", height: "50%" }}
      className="border-2 border-black rounded"
    >
      <h1 className="summary-text-style ml-4 mt-4 bg-red-400 w-fit">
        Course Overall Summary
      </h1>
    </section>
  );
};

export default OverallSummary;
