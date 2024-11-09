import { Button } from "@/components/ui/button";
import { courseCategories } from "@/config";
import React, { useContext, useEffect } from "react";
import { fetchInstructorCourseListService } from "@/services";
import StudentContext from "@/context/student-context";
import { Section } from "lucide-react";

const StudentHomePage = () => {
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
    <div className="min-h-screen text-black bg-white">
      <section className="flex flex-col lg:flex-row items-center justify-between py-8 px-4 lg:px-8">
        <div className="lg:w-1/2 lg:pr-12">
          <h1 className="text-4xl font-bold mb-4">Empowering Knowledge, Enabling Success</h1>
          <p>
            "Empowering Knowledge, Enabling Success" defines our LMS's mission
            to make learning accessible and impactful. Through quality resources
            and interactive tools, our platform supports learners in building
            skills and achieving goals, transforming knowledge into real
            success.
          </p>
        </div>
        <div className="lg:w-1/2 mb-8 lg:mb-0">
          <img
            src="https://plus.unsplash.com/premium_vector-1698192041909-3a5a4a6ee089?q=80&w=1020&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            width={600}
            height={400}
            className="w-full h-auto rounded-lg shadow-lg"
            alt="Students learning together in an LMS environment"
          />
        </div>
      </section>
      <section className="py-8 px-4 lg:px-8 bg-gray-100">
        <h2 className="text-2xl font-bold mb-6">Course Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {courseCategories.map(categoryItem => (
            <Button className='justify-start' variant='outline' key={categoryItem.id}>
              {categoryItem.label}
            </Button>
          ))}
        </div>
      </section>
      <section className="py-12 px-4 lg:px-8">
        <h2 className="text-2xl font-bold mb-6">Featured Courses</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studentViewCoursesList.length > 0 ? (
            studentViewCoursesList.map(courseItem => (
              <div className="border rounded-lg overflow-hidden shadow cursor-pointer" key={courseItem._id}>
                <img 
                  src={courseItem.image} 
                  width={300} 
                  height={150} 
                  className="w-full h-40 object-cover" 
                  alt={courseItem.title} 
                />
                <div className="p-4">
                  <h3 className="font-semibold">{courseItem.title}</h3>
                  <p>{courseItem.subtitle}</p>
                  <p className="text-gray-600">{courseItem.description}</p>
                  <p className="text-gray-600 mt-2">By-{courseItem.instructorName}</p>
                  <p className="text-green-600 mt-1 font-bold text-[16px]">${courseItem.pricing}</p>

                </div>
              </div>
            ))
          ) : (
            <h1>No Courses Found</h1>
          )}
        </div>
      </section>
    </div>
  );
};

export default StudentHomePage;
