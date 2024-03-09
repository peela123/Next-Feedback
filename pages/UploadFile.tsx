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
import { TextInput } from "@mantine/core";
import { IMaskInput } from "react-imask";
import { Input } from "@mantine/core";
import { error } from "console";
import { Loader } from "@mantine/core";
import { FileInput } from "@mantine/core";

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
  const [fileName, setFileName] = useState<string>("nofile"); //current file name

  const [responseMessage, setResponseMessage] = useState<string>("no error");

  const [fullName, setFullName] = useState("");
  const [cmuAccount, setCmuAccount] = useState("");
  const [studentId, setStudentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("no error");

  const semesters: Field[] = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "summer", label: "summer" },
  ];

  function signOut() {
    //Call sign out api without caring what is the result
    //It will fail only in case of client cannot connect to server
    //This is left as an exercise for you. Good luck.
    axios.post("/api/signOut").finally(() => {
      router.push("/");
    });
  }

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

        if (cmuAccount === "") signOut();

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

  //   auto fill selected file name
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

  //   auto fill fields
  useEffect(() => {
    let course = "";
    let number = "";
    let year = "";

    if (file) {
      const fileNameWithoutExtension = file.name.replace(/\.[^/.]+$/, ""); // Removes file extension

      // First, extract courseNo and academicYear based on updated criteria
      const numberMatch = fileNameWithoutExtension.match(/\d{6}/); // Matches exactly 6 digits for courseNo
      number = numberMatch ? numberMatch[0] : "";

      // Use a different approach to extract the year to ensure it doesn't conflict with courseNo
      const yearAndCourseNameMatch = fileNameWithoutExtension
        .replace(new RegExp(number), "")
        .trim();
      const yearMatch = yearAndCourseNameMatch.match(/(?<!\d)\d{4}(?!\d)/); // Matches 4 digits not preceded or followed by another digit, ensuring it's likely a year
      year = yearMatch ? yearMatch[0] : "";

      // Extract courseName considering it may be attached to numbers
      // Remove the identified number and year from the string
      let tempFileName = fileNameWithoutExtension
        .replace(new RegExp(number, "g"), "")
        .replace(new RegExp(year, "g"), "")
        .trim();

      // Assume the rest is courseName, which may include digits
      course = tempFileName;

      // Debugging logs
      console.log("file name:", file?.name);
      console.log("number:", number);
      console.log("course:", course);
      console.log("year:", year);
    }

    // Update state
    setCourseName(course);
    setCourseNo(number);
    setAcademicYear(year); // Assuming you have a state setter for academicYear
  }, [file]);

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
          <section className="flex flex-row gap-x-10 items-center bg-red-400">
            <div
              className="flex flex-col gap-y-2 w-full"
              style={{ width: "300px" }}
            >
              <FileInput
                //   label="Upload files"
                description="Input description"
                placeholder="Upload files"
                value={file}
                clearable
                onChange={setFile}

                // error="Invalid name"
              />
              <ProgressBar />
            </div>
          </section>

          <section className="flex flex-col gap-y-2">
            <TextInput
              className="flex flex-col gap-x-4"
              //   description="enters here"
              label="Course Name"
              placeholder="ex.Biology"
              withAsterisk
              value={courseName}
              onChange={(event: any) =>
                setCourseName(event.currentTarget.value)
              }
            />
            <TextInput
              className="flex flex-col gap-x-4"
              //   description="enters here"
              label="Course No"
              placeholder="ex.261xxx"
              withAsterisk
              value={courseNo}
              onChange={(event: any) => setCourseNo(event.currentTarget.value)}
            />

            <TextInput
              className="flex flex-col gap-x-4"
              //   description="enters here"
              label="Academic Year"
              placeholder="ex.2023"
              withAsterisk
              value={academicYear}
              onChange={(event: any) =>
                setAcademicYear(event.currentTarget.value)
              }
            />

            <Select
              className="flex flex-col gap-x-4"
              label="Semester"
              //   placeholder="....."
              withAsterisk
              data={semesters}
              onSearchChange={(value: string) => setSemester(value)}
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
            <Loader color="blue" size={27} />
          </section>
          {/* <NotificationBox text={errorMessage} /> */}
        </div>
      </div>
    </main>
  );
};

export default UploadFile;
