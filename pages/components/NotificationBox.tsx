import { FC } from "react";

interface Props {
  text: string;
}

const NotificationBox: FC<Props> = ({ text }) => {
  return (
    <div className="px-4 py-2 border-2 border-black bg-red-400">{text}</div>
  );
};

export default NotificationBox;
