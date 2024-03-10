import { Progress } from "@mantine/core";
import { FC } from "react";
const ProgressBar: FC = () => {
  // can be 0-100%
  const value = 10;

  return (
    <Progress.Root size="xl">
      <Progress.Section value={value} color="blue">
        <Progress.Label>{value}%</Progress.Label>
      </Progress.Section>
    </Progress.Root>
  );
  // return <Progress value={value} size="md" transitionDuration={200} animated />;
};

export default ProgressBar;
