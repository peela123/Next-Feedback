export interface FetchedCourse {
  courseName: string;
  courseNo: number;
  semester: string;
  academicYear: number;
  cmuAccount: string;
  teachingMethodComments: Comment[];
  assessmentComments: Comment[];
  contentComments: Comment[];
  responseCount: number;
}
export interface Comment {
  text: string;
  sentiment: "Positive" | "Negative" | "Neutral";
  label: string;
}
