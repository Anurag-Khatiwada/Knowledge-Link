import { createContext, useState } from "react";

const StudentContext = createContext(null);

export const StudentProvider = ({ children }) => {
  const [studentViewCoursesList, setStudentViewCoursesList] = useState([]);

  return (
    <StudentContext.Provider value={{ studentViewCoursesList, setStudentViewCoursesList }}>
      {children}
    </StudentContext.Provider>
  );
};

export default StudentContext;
