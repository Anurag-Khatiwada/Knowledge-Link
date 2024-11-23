import { Button } from '@/components/ui/button'
import { Card, CardContent, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { filterOptions, sortOptions } from '@/config'
import { AuthContext } from '@/context/auth-context'
import StudentContext from '@/context/student-context'
import { checkCoursePurchaseInfoService, fetchInstructorCourseDetailsService, fetchInstructorCourseListService } from '@/services'
import { DropdownMenu, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu'
import { ArrowUpDown } from 'lucide-react'
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

const StudentViewCoursePage = () => {
    const [sort, setSort] = useState('price-lowtohigh')
    const [filter, setFilters] = useState({});
    const [searchParams, setSearchParams] = useSearchParams()
    const { studentViewCoursesList, setStudentViewCoursesList } = useContext(StudentContext);
    const {auth} = useContext(AuthContext)
    const navigate = useNavigate()

    const createFilterParams = (filterParams) => {
        let queryParams = [];

        for (const [key, value] of Object.entries(filterParams)) {
            if (Array.isArray(value) && value.length > 0) {
                const paramValue = value.join(',');
                queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);
            }
        }
        return queryParams.join('&');
    };

    const handleFilterOnChange = (getSectionId, getCurrentOption) => {
        let newFilter = { ...filter };
        if (!newFilter[getSectionId]) {
            newFilter[getSectionId] = [];
        }
        const indexOfCurrentOption = newFilter[getSectionId].indexOf(getCurrentOption.id);
        if (indexOfCurrentOption === -1) {
            newFilter[getSectionId].push(getCurrentOption.id);
        } else {
            newFilter[getSectionId].splice(indexOfCurrentOption, 1);
        }

        setFilters(newFilter);
        sessionStorage.setItem('filter', JSON.stringify(newFilter));
    };

    const fetchAllStudentViewCourses = async (filter, sort) => {
        try {
            const queryParams = new URLSearchParams();
    
            // Manually add filter parameters
            for (const [key, value] of Object.entries(filter)) {
                if (Array.isArray(value) && value.length > 0) {
                    // Join array values into a string, using commas
                    queryParams.set(key, value.join(','));
                } else if (value) {
                    queryParams.set(key, value); // Handle single values
                }
            }
    
            // Add sort parameter
            if (sort) {
                queryParams.set('sortBy', sort);
            }
    
            console.log('Query Parameters:', queryParams.toString());
    
            // Fetch the courses using the constructed query string
            const response = await fetchInstructorCourseListService(queryParams);
            console.log("API Response Data:", response.data);
            setStudentViewCoursesList(response.data.data);
        } catch (err) {
            console.error("Error fetching student view courses:", err);
            throw new Error("Error getting student view courses");
        }
    };

    useEffect(() => {
        const buildQueryStringForFilter = createFilterParams(filter);
        setSearchParams(new URLSearchParams(buildQueryStringForFilter));
    }, [filter]);

    useEffect(()=>{
        setSort("price-lowtohigh");
        setFilters(JSON.parse(sessionStorage.getItem("filter"))||{})   
    },[])

    useEffect(()=>{
        return ()=>{
            sessionStorage.removeItem("filter");
        }
    },[])

    useEffect(() => {
        if(filter!==null && sort!==null){

            fetchAllStudentViewCourses(filter, sort);
        }
    }, [filter, sort]);

    const handelCourseNavigate = async(courseId)=>{
        const response = await checkCoursePurchaseInfoService(courseId, auth?.user?._id);
        
        if(response?.data?.data===true){
            navigate(`/course-progress/${courseId}`)
        }else{
            navigate(`/course/details/${courseId}`)
        }
    }


    return (
        <div className='container mx-auto p-4'>
            <h1 className='text-3xl font-bold mb-4'>All Courses</h1>
            <div className="flex flex-col md:flex-row gap-4">
                <aside className='w-full md:w-64 space-y-4'>
                    <div className="space-y-4">
                        {Object.keys(filterOptions).map((keyItem) => (
                            <div className="p-4 space-y-4" key={keyItem}>
                                <h3 className='font-bold mb-3'>{keyItem.toUpperCase()}</h3>
                                <div className='grid gap-2 mt-2'>
                                    {filterOptions[keyItem].map((option) => (
                                        <label className='flex font-medium items-center gap-3' key={option.id}>
                                            <Checkbox
                                                checked={
                                                    filter &&
                                                    filter[keyItem] &&
                                                    filter[keyItem].indexOf(option.id) > -1
                                                }
                                                onCheckedChange={() => handleFilterOnChange(keyItem, option)}
                                            />
                                            {option.label}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>
                <main className="flex-1">
                    <div className="flex justify-end items-center mb-4 gap-5">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant='outline' size='sm' className='flex items-center gap-2 p-4'>
                                    <ArrowUpDown className='h-4 w-4' />
                                    <span className='text-[16px] font-medium'>Sort By</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align='end' className='p-4 w-[180px] bg-white'>
                                <DropdownMenuRadioGroup value={sort} onValueChange={(value) => setSort(value)}>
                                    {sortOptions.map((sortItem) => (
                                        <DropdownMenuRadioItem
                                            className='cursor-pointer'
                                            value={sortItem.id}
                                            key={sortItem.id}
                                        >
                                            {sortItem.label}
                                        </DropdownMenuRadioItem>
                                    ))}
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <span className='text-sm text-black font-bold'>{studentViewCoursesList.length} results</span>
                    </div>
                    <div className="space-y-4">
                        {studentViewCoursesList && studentViewCoursesList.length > 0 ? (
                            studentViewCoursesList.map((courseItem) => (
                                <Card onClick={()=>handelCourseNavigate(courseItem?._id)} className='cursor-pointer' key={courseItem?._id}>
                                    <CardContent className='flex gap-4 p-4'>
                                        <div className="w-48 h-32 flex-shrink-0">
                                            <img
                                                src={courseItem?.image}
                                                alt={courseItem?.title}
                                                className='w-full h-full object-cover'
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <CardTitle className='text-xl mb-2'>{courseItem?.title}</CardTitle>
                                            <p className='text-sm text-gray-600 mb-1'>
                                                created by: <span className="font-bold">{courseItem?.instructorName}</span>
                                            </p>
                                            <p className='mt-3 text-[18px] text-black mb-2'>
                                                {`${courseItem?.curriculum?.length} ${
                                                    courseItem?.curriculum?.length <= 1 ? 'Lecture' : 'Lectures'
                                                } - ${courseItem?.level.toUpperCase()} Level`}
                                            </p>
                                            <p className='text-green-500 font-bold mt-2'>${courseItem?.pricing}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <h1>No Courses Found</h1>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default StudentViewCoursePage;
