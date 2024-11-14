import { AuthContext } from '@/context/auth-context'
import StudentContext from '@/context/student-context'
import { fetchStudentBoughtCoursesService } from '@/services'
import React, { useContext, useEffect } from 'react'

const StudentCoursesPage = () => {
  const {auth} = useContext(AuthContext)
  const {studentBoughtCoursesList, setStudentBoughtCoursesList} = useContext(StudentContext);

  const fetchStudentBoughtCourses = async ()=>{
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id)
    console.log(response);
    if(response?.data?.success){
      setStudentBoughtCoursesList(response?.data?.data)
    }
  };

 
  useEffect(()=>{
    // fetch studentBoughtCourses from API
    fetchStudentBoughtCourses();

  },[])

  return (
    <div>
      student courses
    </div>
  )
}

export default StudentCoursesPage
