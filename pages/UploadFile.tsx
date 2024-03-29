import { useState, useEffect, FC } from "react";
import { useRouter } from "next/router";
import { redirect } from "next/navigation";
import axios, { AxiosError, AxiosResponse } from "axios";
import { WhoAmIResponse } from "./api/whoAmI";

import readXlsxFile from "read-excel-file";

import Navbar from "./components/Navbar";

import { FiFilePlus } from "react-icons/fi";
import { TiDeleteOutline } from "react-icons/ti";
import { MdOutlineFilePresent } from "react-icons/md";
import { LuFileUp } from "react-icons/lu";
import { IMaskInput } from "react-imask";
import { PiMicrosoftExcelLogoFill } from "react-icons/pi";
import { MdOutlineClose } from "react-icons/md";

import {
  Stepper,
  Button,
  Avatar,
  FileInput,
  Loader,
  Input,
  TextInput,
  Select,
  Menu,
} from "@mantine/core";

// for dropzone UI
import { Group, Text, rem } from "@mantine/core";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import {
  Dropzone,
  DropzoneProps,
  IMAGE_MIME_TYPE,
  MS_EXCEL_MIME_TYPE,
} from "@mantine/dropzone";

// import classes from "./Demo.module.css";
import classes from "../styles/Demo.module.css";

const UploadFile: FC = (props: Partial<DropzoneProps>) => {
  const [semester, setSemester] = useState<string>("");
  const [academicYear, setAcademicYear] = useState<string>("");
  const [courseName, setCourseName] = useState<string>("");
  const [courseNo, setCourseNo] = useState<string>("");

  const [file, setFile] = useState<File | null>(null); //current upload excel file
  const [fileName, setFileName] = useState<string>("no file...."); //current file name
  const [fileSize, setFileSize] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [cmuAccount, setCmuAccount] = useState("");
  const [studentId, setStudentId] = useState("");
  const [errorMessage, setErrorMessage] = useState("no error"); // for whoAmI API message
  const [uploadMessage, setUploadMessage] = useState<string>("no error"); // upload API message

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
            setUploadMessage(res.data.message);
            console.log("upload status:", res.data.status);
          })
          .catch((error) => {
            // console.log("upload status:", res.data.status);
            // console.log("upload message:", res.data.message);
            if (error.response) {
              // Error response from server, access status code here
              console.log("Error status:", error.response.status);
            } else if (error.request) {
              // The request was made but no response was received
              console.log("No response received for the request");
            } else {
              // Something happened in setting up the request
              console.log("Error", error.message);
            }
          });
        // cloud deploy version
        // const res = await axios
        //   .post(`http://127.0.0.1:5000/api/ml_result`, jsonRequestData, {
        //     headers: headers,
        //   })
        //   .then((res) => {
        //     console.log("send from frontend to backend success");
        //   });
      }

      router.push("/Analyze");
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    console.log("file type:", typeof selectedFile);
    console.log(selectedFile);
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  function handleFileChangeDropZone(file: any) {
    //get array[0]'s object which is file we drop
    const selectedFile = file[0];
    if (selectedFile) {
      console.log(selectedFile);
      setFile(selectedFile);
      setFileName(selectedFile.name);
      setFileSize(selectedFile.size / 1000);
    }
    // console.log("file type:", typeof file);
    // console.log(file);
    // console.log(file[0].name);
  }

  function handleCancleFile() {
    setFile(null);
    setFileName("No file chosen....");
  }

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
        <section
          className="flex flex-col items-center w-11/12  border-1 border-black rounded-3xl"
          style={{
            width: "90%",
            height: "600px",
            backgroundColor: "#202427",
          }}
        >
          <section className="flex flex-col text-center mt-6 gap-y-2">
            <h1 className="text-2xl font-semibold">File Classifier</h1>
            <p className="text-xl">Make a quick summary!</p>
          </section>
          {/* file input and input fields box*/}
          <div className="flex flex-row justify-center items-center gap-x-12 w-full h-full">
            {/* file input box */}
            <section className="flex flex-col  items-center gap-y-4">
              {/* drag file box */}
              <Dropzone
                onDrop={(file: any) => {
                  handleFileChangeDropZone(file);
                }}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={5 * 1024 ** 2}
                accept={MS_EXCEL_MIME_TYPE}
                {...props}
                style={{
                  backgroundColor: "#363636",
                  borderRadius: "10px",
                  height: "290px",
                  // borderColor: "gray",
                  border: "dashed 2px #2F4F4F",
                }}
              >
                <Group
                  justify="center"
                  gap="xl"
                  mih={220}
                  style={{
                    pointerEvents: "none",
                    width: "350px",
                    height: "250px",
                  }}
                >
                  <Dropzone.Accept>
                    <IconUpload
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-blue-6)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "var(--mantine-color-red-6)",
                      }}
                      stroke={1.5}
                    />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <FiFilePlus
                      style={{
                        width: rem(52),
                        height: rem(52),
                        color: "#CDCCDC",
                        strokeWidth: "1px",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    />
                    <div className="flex flex-row items-center mx-auto">
                      <Text size="xl" c="gray" inline>
                        Drag your file here or
                      </Text>
                      <Text
                        size="xl"
                        c="#3CB371"
                        style={{ paddingLeft: "6px" }}
                      >
                        Browse
                      </Text>
                    </div>

                    <Text size="sm" c="dimmed" ta="center" inline mt={7}>
                      {/* (file should not exceed 1mb) */}
                      (Valid type are .csv, .xlsx)
                    </Text>
                  </Dropzone.Idle>
                </Group>
              </Dropzone>

              {/* file name box */}
              <div
                className="flex flex-row justify-between items-center py-4 px-2 border-2 rounded-xl"
                style={{
                  borderColor: "#2F4F4F",
                  width: "380px",
                  height: "65px",
                  backgroundColor: "#363636",
                }}
              >
                <div className="flex flex-row items-center gap-x-4 ">
                  <Avatar radius="sm" variant="filled" color="#1f2320">
                    {file ? (
                      <PiMicrosoftExcelLogoFill size={17} color="white" />
                    ) : (
                      <></>
                    )}
                  </Avatar>

                  <div className="flex flex-col justify-center truncate">
                    <p style={{ width: "260px" }}>{fileName}</p>

                    {file ? <p>{fileSize} kb</p> : <></>}
                  </div>
                </div>

                <MdOutlineClose
                  size={32}
                  color="red"
                  className="transition-all duration-50 ease-in-out hover:scale-125"
                  onClick={handleCancleFile}
                />
              </div>
            </section>
            {/* input fields box*/}
            <section
              className="flex flex-col gap-y-3 py-4 pl-5  rounded-xl"
              style={{
                backgroundColor: "#363636",
                // borderColor: "#2F4F4F",
                width: "300px",
                height: "390px",
              }}
            >
              <h1 className="text-white">Course Info</h1>
              <TextInput
                style={{
                  color: "#CDCCDC",
                  width: "250px",
                }}
                radius="md"
                label="Course Name"
                placeholder="ex.Biology"
                withAsterisk
                value={courseName}
                onChange={(event: any) =>
                  setCourseName(event.currentTarget.value)
                }
              />
              <TextInput
                style={{
                  color: "#CDCCDC",
                  width: "250px",
                }}
                radius="md"
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
                style={{
                  color: "#CDCCDC",
                  width: "250px",
                }}
                radius="md"
                label="Academic Year"
                placeholder="ex.2023"
                withAsterisk
                value={academicYear}
                onChange={(event: any) =>
                  setAcademicYear(event.currentTarget.value)
                }
              />

              <Select
                style={{
                  color: "#CDCCDC",
                  width: "250px",
                }}
                radius="md"
                label="Semester"
                withAsterisk
                data={semesters}
                onSearchChange={(value: string) => setSemester(value)}
              />
            </section>
          </div>

          {/* upload/view button */}
          <section className="mx-auto  mb-6">
            {file === null ? (
              <button
                className="w-48 h-12 py-2 px-8 border-2 border-black rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors duration-200"
                // onClick={handleUploadClick}
                onClick={() => router.push("/Analyze")}
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
                    className="w-48 h-12 py-2 px-8  border-2 border-black rounded-xl bg-lime-600 hover:bg-lime-700 transition-colors duration-200"
                    onClick={handleUploadClick}
                  >
                    <p className="text-xl font-semibold">Upload File</p>
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
        </section>
      </div>
    </main>
  );
};

export default UploadFile;
