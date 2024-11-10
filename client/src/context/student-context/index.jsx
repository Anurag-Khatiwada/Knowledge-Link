import { createContext, useState } from "react";

const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);
  const [studentViewCourseDetails, setStudentViewCourseDetails] = useState(null);
  const [currentCourseDetailsId, setCurrentCourseDetailsId] = useState(null)
  const [loadingState, setLoadingState] = useState(false)
  return (
    <StudentContext.Provider value={{
       studentViewCoursesList, setStudentViewCoursesList,
       studentViewCourseDetails, setStudentViewCourseDetails,
       currentCourseDetailsId, setCurrentCourseDetailsId,
       loadingState, setLoadingState
       }}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContext;
