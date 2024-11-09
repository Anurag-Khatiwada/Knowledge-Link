import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { filterOptions, sortOptions } from '@/config'
import StudentContext from '@/context/student-context'
import { fetchInstructorCourseListService } from '@/services'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ArrowUpDown } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'

const StudentViewCoursePage = () => {
    const [sort, setSort] = useState('')
    const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);

    const fetchAllStudentViewCourses = async () => {
        try {
          const response = await fetchInstructorCourseListService();
          // Log the API response data directly
          console.log("API Response Data:", response.data);
          // Set the student view courses list with the data from the API
          setStudentViewCoursesList(response.data.data); // Note: assuming response.data.data is the correct path
        } catch (err) {
          console.error("Error fetching student view courses:", err);
          throw new Error("Error getting student view courses");
        }
      };
    
      useEffect(() => {
        fetchAllStudentViewCourses();
      }, []);

  return (
    <div className='container mx-auto p-4'>
        <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
        <div className="flex flex-col md:flex-row gap-4">
            <aside className='w-full md:w-64 space-y-4'>
                <div className="space-y-4">
                   {
                    Object.keys(filterOptions).map(keyItem=>(
                        <div className="p-4 space-y-4">
                            <h3 className='font-bold mb-3'>{keyItem.toUpperCase()}</h3>
                            <div className='grid gap-2 mt-2'>
                                {
                                    filterOptions[keyItem].map(option=>(
                                        <label className='flex font-medium items-center gap-3'>
                                            <Checkbox
                                            checked={false}
                                            onCheckedChange={()=>handleFilterOnChange(keyItem, option.id)}
                                            />
                                            {option.label}

                                        </label>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                   }
                </div>
            </aside>
            <main className="flex-1">
                <div className="flex justify-end items-center mb-4 gap-5">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant='outline' size='sm' className='flex items-center gap-2 p-4'>
                                <ArrowUpDown className='h-4 w-4'/>
                                <span className='text-[16px] font-medium'>Sort By</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='end' className='w-[180px]'>
                        <DropdownMenuRadioGroup value={sort} onValueChange={(value)=>setSort(value)}>
                            {
                                sortOptions.map(sortItem=> <DropdownMenuRadioItem className='cursor-pointer' value={sortItem.id} key={sortItem.id}>
                                    {sortItem.label}
                                </DropdownMenuRadioItem>)
                            }

                        </DropdownMenuRadioGroup>

                    </DropdownMenuContent>
                    </DropdownMenu>
                    <span className='text-sm text-black font-bold'>10 results</span>
                </div>
                <div className="space-y-4">
                    {
                        studentViewCoursesList && studentViewCoursesList.length>0?
                        studentViewCoursesList.map(courseItem=>(
                            <Card key={courseItem?._id}>
                                <CardContent className='flex gap-4 p-4'>
                                    <div className="w-48 h-32 flex-shrink-0">
                                        <img src={courseItem?.image} alt={courseItem?.title} className='w-full h-full object-cover'/>
                                    </div>
                                    <div className="flex-1">
                                        <CardTitle className='text-xl mb-2'>{courseItem?.title}</CardTitle>
                                        <p className='text-sm text-gray-600 mb-1'>created by: <span className="font-bold">{courseItem?.instructorName}</span></p>
                                        <p className='mt-3 text-[18px] text-black mb-2'>
                                            {
                                                `${courseItem?.curriculum?.length} ${courseItem?.curriculum?.length<=1 ? 'Lecture':'Lectures'} - ${courseItem?.level.toUpperCase()} Level`
                                            }
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )) : <h1>No Courses Found</h1>
                    }
                </div>
            </main>
        </div>
    </div>
  )
}

export default StudentViewCoursePage
