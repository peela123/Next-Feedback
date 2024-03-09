import { useState, useEffect, FC } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError, AxiosResponse } from "axios";
import { WhoAmIResponse } from "./api/whoAmI";

import readXlsxFile from "read-excel-file";

import ProgressBar from "./components/ProgressBar";
import NotificationBox from "./components/NotificationBox";
// import { Switch } from "@mantine/core";
import Navbar from "./components/Navbar";
import { LuFileUp } from "react-icons/lu";
import { Select } from "@mantine/core";
import { error } from "console";

interface Field {
  value: string;
  label: string;
}

const data = [
  { name: "USA", value: 400, color: "indigo.6" },
  { name: "India", value: 300, color: "yellow.6" },
  { name: "Japan", value: 100, color: "teal.6" },
  { name: "Other", value: 200, color: "gray.6" },
];

const UploadFile: FC = () => {
  const router = useRouter();

  const [semester, setSemester] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseNo, setCourseNo] = useState<string>("");

  const [file, setFile] = useState<File | null>(null); //current upload excel file
  const [fileName, setFileName] = useState<string>("No file chosen.."); //current file name

  const [responseMessage, setResponseMessage] = useState<string>("no error");

  const [fullName, setFullName] = useState("");
  const [cmuAccount, setCmuAccount] = useState("");
  const [studentId, setStudentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("no error");

  const years: Field[] = [
    { value: "2023", label: "2023" },
    { value: "2024", label: "2024" },
    { value: "2025", label: "2025" },
  ];

  const semesters: Field[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "summer", label: "summer" },
  ];

  const courseNos: Field[] = [
    { value: "261207", label: "261207" },
    { value: "515191", label: "515191" },
    { value: "261161", label: "261161" },
    { value: "261111", label: "261111" },
  ];

  const courseNames: Field[] = [
    { value: "Computer", label: "Computer" },
    { value: "Biology", label: "Biology" },
    { value: "Calculus", label: "Calculus" },
    {
      value: "Internet And Online Community",
      label: "Internet And Online Community",
    },
  ];

  const handleUploadClick = async () => {
    try {
      //if there is file to upload
      if (file !== null) {
        //force to fill all fields
        if (!semester || !academicYear || !courseName || !courseNo) {
          alert("Please fill all required fields");
          return;
        }
        // read excel file
        const excelData = await readXlsxFile(file);

        //map excel row data to array
        const comments = excelData.map((row) => row[0]);

        //prepare document to send to the backend
        const requestData = {
          comments: comments,
          cmuAccount: cmuAccount,
        };

        //convert  to JSON
        const jsonRequestData = JSON.stringify(requestData);

        // Set the Content-Type header to indicate JSON data
        const headers = {
          "Content-Type": "application/json",
        };

        //make HTTP POST request to the backend with JSON data
        const response = await axios
          .post(
            `http://127.0.0.1:5000/api/user_upload?courseName=${courseName}&courseNo=${parseInt(
              courseNo,
              10
            )}&semester=${semester}&academicYear=${parseInt(academicYear, 10)}`,
            jsonRequestData,
            { headers: headers }
          )
          .then((res) => {
            setResponseMessage(res.data.message);
          });
      }

      router.push("/Analyze");
    } catch (error) {
      console.error(error);
    }
  };

  //auto fill selected file name
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  // get auth info
  useEffect(() => {
    //All cookies that belong to the current url will be sent with the request automatically
    //so we don't have to attach token to the request
    //You can view token (stored in cookies storage) in browser devtools (F12). Open tab "Application" -> "Cookies"
    axios
      .get<{}, AxiosResponse<WhoAmIResponse>, {}>("/api/whoAmI")
      .then((response) => {
        const data = response.data;
        if (data.ok) {
          setCmuAccount(data.cmuAccount);
          setFullName(data.firstName + " " + data.lastName);
          setStudentId(data.studentId ?? "No Student Id");
        }
      })
      .catch((error: AxiosError<WhoAmIResponse>) => {
        if (!error.response) {
          setErrorMessage(
            "Cannot connect to the network. Please try again later."
          );
        } else if (error.response.status === 401) {
          setErrorMessage("Authentication failed");
        } else if (error.response.data && error.response.data.ok === false) {
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage("Unknown error occurred. Please try again later");
        }
      });
  }, []);

  //auto fill courseName and courseNo
  useEffect(() => {
    const fileNameWithoutExtension: string = fileName.replace(/\.[^/.]+$/, ""); // Removes file extension

    const number = fileNameWithoutExtension.match(/^\d+/)?.[0] || ""; // Matches the leading digits
    const restOfFile = fileNameWithoutExtension.replace(/^\d+\s*/, ""); // Removes the leading digits and any spaces
    setCourseName(restOfFile);
    setCourseNo(number);
  }, [fileName]);

  return (
    <main className="flex flex-col h-screen">
      <Navbar fullName={fullName} cmuAccount={cmuAccount} />
      <div
        className="flex justify-center items-center grow bg-white"
        style={{ backgroundColor: "#FEF4F4" }}
      >
        <div className="flex flex-col justify-between items-center w-5/6 h-5/6 mx-auto mt-8 bg-white">
          <section className="flex flex-col text-center mt-6 gap-y-6">
            <h1 className="text-3xl font-bold">File Classifier</h1>
            <p className="text-3xl">Make a quick summary!</p>
          </section>
          {/* file input section */}
          <section className="flex flex-row gap-x-10 items-center">
            <div className="gap-y-2 flex flex-col">
              <p className="filelabel-container whitespace-nowrap border-black border-2">
                {fileName}
              </p>
              <ProgressBar />
            </div>
            <input
              type="file"
              id="file-upload"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <label
              htmlFor="file-upload"
              className="uploadfile-btn-style hover:bg-blue-400"
            >
              <LuFileUp size={25} />
              Choose File
            </label>
          </section>
          {/* course no and course name */}
          <section className="flex flex-row gap-x-20 font-bold">
            <Select
              className="flex flex-col gap-x-4"
              label="Course No."
              description="6 digits of course no."
              placeholder="....."
              data={courseNos}
              value={courseNo}
              onSearchChange={(value: string) => setCourseNo(value)}
            />

            <Select
              className="flex flex-col gap-x-4"
              description="enters here"
              label="Course Name"
              placeholder="....."
              data={courseNames}
              value={courseName}
              onSearchChange={(value: string) => setCourseName(value)}
            />
          </section>
          {/* semester and year */}
          <section className="flex flex-row gap-x-20">
            <Select
              className="flex flex-col gap-x-4"
              label="Semester"
              placeholder="....."
              data={semesters}
              onSearchChange={(value: string) => setSemester(value)}
            />
            <Select
              className="flex flex-col gap-x-4"
              label="Academic Year"
              placeholder="....."
              data={years}
              onSearchChange={(value: string) => setAcademicYear(value)}
            />
          </section>
          {/* analyze button section */}
          <section className="mb-10 flex flex-row gap-x-24">
            {file === null ? (
              <button
                className="analyze-btn-style bg-blue-400 hover:bg-blue-500"
                onClick={handleUploadClick}
              >
                view analyze
              </button>
            ) : (
              <button
                className="analyze-btn-style bg-lime-400 hover:bg-lime-500"
                onClick={handleUploadClick}
              >
                Upload File
              </button>
            )}
          </section>
          <NotificationBox text={errorMessage} />
        </div>
      </div>
    </main>
  );
};

export default UploadFile;
