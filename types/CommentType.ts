export interface FetchedCourse {
  courseName: string;
  courseNo: number;
  semester: string;
  academicYear: number;
  cmuAccount: string;
  teachingMethodComments: Comment[];
  assessmentComments: Comment[];
  contentComments: Comment[];
}
export interface Comment {
  text: string;
  sentiment: string;
  label: string;
}
