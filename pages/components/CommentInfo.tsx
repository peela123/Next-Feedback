import { FC, useState, useEffect } from "react";
import axios from "axios";

import { FetchedCourse, Comment } from "../../types/CommentType";

interface Props {
  cmuAccount: string;
  courseNo: number;
}

const CommentInfo: FC<Props> = ({ cmuAccount, courseNo }) => {
  const [fetchedData, setFetchedData] = useState<FetchedCourse[]>([]);
  // fetch course by courseNo and cmuAccount
  useEffect(() => {
    axios
      .get(
        `http://127.0.0.1:5000/api/user_course?cmuAccount=${cmuAccount}&courseNo=${courseNo}`
      )
      .then((res) => {
        //axios already parse JSON to javascript object
        setFetchedData(res.data);
        console.log("fetchedData", fetchedData);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [cmuAccount, courseNo]);
  return (
    <div className="flex flex-col border-2 border-red rounded text=white">
      <p>All comment:</p>
      <p>Positive commetn:</p>
      <p>Negative comment:</p>
      <p>Neutral comment:</p>
      <p>No comment:</p>
    </div>
  );
};

export default CommentInfo;
