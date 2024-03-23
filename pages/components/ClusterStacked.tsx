import { FC } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from "recharts";

interface Props {
  cmuAccount: string;
  courseNo: number | undefined;
}

const data = [
  {
    name: "Page TM",

    uv: 1000,
    pv: 2000,
    amt: 3000,
    uv2: 1000,
    pv2: 1500,
    amt2: 2000,
    uv3: 1800,
    pv3: 1500,
    amt3: 3000,
  },

  {
    name: "Page AM",
    uv: 3000,
    pv: 1398,
    amt: 2210,
    uv2: 1000,
    pv2: 1500,
    amt2: 2000,
    uv3: 1800,
    pv3: 1500,
    amt3: 3000,
  },
  {
    name: "Page CT",
    uv: 2000,
    pv: 800,
    amt: 2290,
    uv2: 1000,
    pv2: 1500,
    amt2: 2000,
    uv3: 1800,
    pv3: 1500,
    amt3: 3000,
  },
];

const renderCustomizedLabel = (props: any) => {
  const { x, y, width, value } = props;
  const radius = 15;

  return (
    <g>
      <circle cx={x + width / 2} cy={y - radius} r={radius} fill="#8884d8" />
      <text
        x={x + width / 2}
        y={y - radius}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {value.split(" ")[1]}
      </text>
    </g>
  );
};

const ClusterStacked: FC<Props> = ({ cmuAccount, courseNo }) => {
  const demoUrl = "https://codesandbox.io/s/bar-chart-with-min-height-3ilfq";
  return (
    <BarChart
      width={1200}
      height={600}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Legend />
      {/* teaching method bar */}
      <Bar dataKey="uv" fill="green" minPointSize={5} stackId="a">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
      <Bar dataKey="pv" fill="red" minPointSize={5} stackId="a">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
      <Bar dataKey="amt" fill="gray" minPointSize={5} stackId="a">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
      {/* assessment bar */}
      <Bar dataKey="uv2" fill="green" minPointSize={10} stackId="b">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
      <Bar dataKey="pv2" fill="red" minPointSize={10} stackId="b">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
      <Bar dataKey="amt2" fill="gray" minPointSize={10} stackId="b">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
      {/* content bar */}
      <Bar dataKey="uv3" fill="green" minPointSize={5} stackId="c">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
      <Bar dataKey="pv3" fill="red" minPointSize={5} stackId="c">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
      <Bar dataKey="amt3" fill="gray" minPointSize={5} stackId="c">
        <LabelList dataKey="name" content={renderCustomizedLabel} />
      </Bar>
    </BarChart>
  );
};

export default ClusterStacked;
