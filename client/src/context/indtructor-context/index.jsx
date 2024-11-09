import { createContext, useState } from "react";
import { courseCurriculumInitialFormData, courseLandingInitialFormData } from "@/config";

const InstructorContext = createContext();

export const InstructorProvider = ({ children }) => {
  const [courseLandingFormData, setCourseLandingFormData] = useState(courseLandingInitialFormData);
  const [courseCurriculumFormData, setCourseCurriculumFormData]=useState(courseCurriculumInitialFormData)
  const [instructorCourseList, setInstructorCourseList]=useState([])
  const[currentEditedCourseId, setCurrentEditedCourseId] = useState(null)

  const [mediaUploadProgress, setMediaUploadProgress] = useState(false)
  
  const [mediaUploadProgressPercentage, setMediaUploadProgressPercentage] = useState(0)

  return (
    <InstructorContext.Provider
      value={{
        courseLandingFormData,
        setCourseLandingFormData,
        courseCurriculumFormData, setCourseCurriculumFormData,
        mediaUploadProgress, setMediaUploadProgress,
        mediaUploadProgressPercentage, setMediaUploadProgressPercentage,
        instructorCourseList, setInstructorCourseList,
        currentEditedCourseId, setCurrentEditedCourseId
      }}
    >
      {children}
    </InstructorContext.Provider>
  );
};

export default InstructorContext;
