import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AuthContext } from '@/context/auth-context'
import StudentContext from '@/context/student-context'
import { fetchStudentBoughtCoursesService } from '@/services'
import { Watch } from 'lucide-react'
import React, { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const StudentCoursesPage = () => {
  const {auth} = useContext(AuthContext)
  const {studentBoughtCoursesList, setStudentBoughtCoursesList} = useContext(StudentContext);

  const fetchStudentBoughtCourses = async ()=>{
    const response = await fetchStudentBoughtCoursesService(auth?.user?._id)
    console.log(response.data.data.courses);
    if(response?.data?.success){
      setStudentBoughtCoursesList(response?.data?.data?.courses)
    }
  };

 
  useEffect(()=>{
    // fetch studentBoughtCourses from API
    fetchStudentBoughtCourses();

  },[])

  const navigate = useNavigate()

  return (
    <div className='p-4 '>
      <h1 className="text-3xl font-bold mb-8">My Courses</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {
          studentBoughtCoursesList && studentBoughtCoursesList.length>0 ? 
          studentBoughtCoursesList.map((course)=>(
            <Card key={course.courseId} className='flex flex-col'>
              <CardContent className='p-4 flex-grow'>
                <img
                src={course?.courseImage}
                alt={course?.title}
                className="w-full h-52 object-cover object-cente rounded-md mb-4"
                />
                <h3 className="font-bold mb-1">{course?.title}</h3>
                <p className="text-sm text-gray-700 b-2">By - {course?.instructorName}</p>
              </CardContent>
              <CardFooter>
                <Button onClick={()=>navigate(`/course-progress/${course.courseId}`)} className='flex-1'>
                  <Watch className='mr-2 h-4 w-4'/>
                  Start Watching
                </Button>
              </CardFooter>
            </Card>
          ))
          : <h1 className="text-3xl font-bold">No courses found</h1>
        }
      </div>
    </div>
  )
}

export default StudentCoursesPage
