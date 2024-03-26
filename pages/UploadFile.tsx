import { useState, useEffect, FC } from "react";
import { useRouter } from "next/router";
import axios, { AxiosError, AxiosResponse } from "axios";
import { WhoAmIResponse } from "./api/whoAmI";

import readXlsxFile from "read-excel-file";

import Navbar from "./components/Navbar";
import { LuFileUp } from "react-icons/lu";
import { Select } from "@mantine/core";
import { TextInput } from "@mantine/core";
import { IMaskInput } from "react-imask";
import { Input } from "@mantine/core";
import { error } from "console";
import { Loader } from "@mantine/core";
import { FileInput } from "@mantine/core";
import { Stepper, Button, Group } from "@mantine/core";
import { Menu } from "@mantine/core";
import { redirect } from "next/navigation";

const UploadFile: FC = () => {
  const [semester, setSemester] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseNo, setCourseNo] = useState<string>("");

  const [file, setFile] = useState<File | null>(null); //current upload excel file
  const [fileName, setFileName] = useState<string>("No file chosen...."); //current file name
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [cmuAccount, setCmuAccount] = useState("");
  const [studentId, setStudentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("no error");
  const [responseMessage, setResponseMessage] = useState<string>("no error"); //message about upload file error

  const semesters = [
    { value: "1", label: "1" },
    { value: "2", label: "2" },
    { value: "summer", label: "summer" },
  ];

  function signOut() {
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

        setIsLoading(true);

        // read excel file
        const excelData = await readXlsxFile(file);

        // map excel row column[0] to array
        const comments = excelData
          .filter((row) => row[0] !== null)
          .map((row) => {
            return String(row[0]).trim();
          });

        console.log("comments:", comments);
        console.log("excel data length:", excelData.length);
        //prepare document to send to the backend
        const requestData = {
          comments: comments,
          responseCount: excelData.length,
          cmuAccount: cmuAccount,
        };

        //convert to JSON
        const jsonRequestData = JSON.stringify(requestData);

        // Set the Content-Type header to indicate JSON data
        const headers = {
          "Content-Type": "application/json",
        };

        if (cmuAccount === "") signOut();

        // make HTTP POST request to the backend with JSON data
        const response = await axios
          .post(
            `http://127.0.0.1:5000/api/user_upload?courseName=${courseName.trim()}&courseNo=${parseInt(
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

  // auto fill input fields
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
      // console.log("file name:", file?.name);
      // console.log("course number:", number);
      // console.log("course name:", course);
      // console.log("year:", year);
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
        className="grow flex flex-row justify-center items-center "
        style={{ color: "#e3e5e4", backgroundColor: "#363636" }}
        // style={{ backgroundColor: "#1f2123" }}
        // style={{ backgroundColor: "#FEF4F4" }}
        // style={{ backgroundColor: "#404040" }}
      >
        {/* box */}
        <div
          className="flex flex-col items-center w-11/12  border-1 border-black rounded-3xl"
          style={{
            width: "700px",
            height: "600px",
            backgroundColor: "#202427",
          }}
        >
          <section className="flex flex-col text-center mt-6 gap-y-2">
            <h1 className="text-2xl font-semibold">File Classifier</h1>
            <p className="text-xl">Make a quick summary!</p>
          </section>
          {/* file input section */}
          <section className="flex flex-row mt-12 items-center">
            <div>
              <label
                htmlFor="file-upload"
                className="uploadfile-btn-style flex flex-row justify-center gap-x-3 items-center "
                // style={{ backgroundColor: " EEEEEE" }}
                // style={{ background: "#727CF5" }}
                style={{
                  border: "solid black 1px",
                  backgroundColor: "#727cF5",
                }}
              >
                <LuFileUp size={23} />
                Choose File
              </label>
              <input
                type="file"
                id="file-upload"
                style={{
                  display: "none",
                }}
                onChange={handleFileChange}
              />
            </div>

            <p
              className="filelabel-container whitespace-nowrap"
              style={{ borderColor: "gray", borderWidth: "0.5px" }}
            >
              {fileName}
            </p>
          </section>
          {/* input fields */}
          <section className="flex flex-col gap-y-4 my-4">
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
              onChange={(event: any) => {
                const value = event.currentTarget.value;
                // Regular expression to match exactly 6 digits
                const regex = /^\d{0,6}$/;
                if (regex.test(value)) {
                  setCourseNo(value);
                }
              }}
            />

            <TextInput
              className="flex flex-col gap-x-4"
              // description="must be 4 digits"
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

          {/* upload/view button section */}
          <section className="flex flex-row justify-center items-center mt-8">
            {file === null ? (
              <button
                className="border-2 border-black px-12 py-2 rounded bg-blue-400 hover:bg-blue-500"
                onClick={handleUploadClick}
              >
                <p className="text-xl font-semibold">View Analyze</p>
              </button>
            ) : (
              <div className="flex items-center">
                {isLoading ? (
                  <Button loading loaderProps={{ type: "dots" }}>
                    Loading button
                  </Button>
                ) : (
                  <button
                    className="border-2 border-black px-6 py-2 rounded bg-lime-400 hover:bg-lime-500"
                    onClick={handleUploadClick}
                  >
                    <p className="font-semibold text-base">Upload File</p>
                  </button>
                )}

                {/* {isLoading ? (
                  <Loader color="blue" size={27} className="ml-6" />
                ) : (
                  <></>
                )} */}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default UploadFile;
