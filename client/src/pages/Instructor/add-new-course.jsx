import CourseCurriculum from "@/components/instructor-view/courses/add-new-course/course-curriculum";
import CourseLanding from "@/components/instructor-view/courses/add-new-course/course-landing";
import CourseSetting from "@/components/instructor-view/courses/add-new-course/course-setting";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { AuthContext } from "@/context/auth-context";
import InstructorContext from "@/context/indtructor-context";
import {
  addNewCourseService,
  fetchInstructorCourseDetailsService,
  updateCourseByIdservice,
} from "@/services";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import React, { useContext, useEffect } from "react";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";
import { useNavigate, useParams } from "react-router-dom";

const AddNewCoursePage = () => {
  const {
    courseLandingFormData,
    currentEditedCourseId,
    setCurrentEditedCourseId,
    setCourseLandingFormData,
    setCourseCurriculumFormData,
    courseCurriculumFormData,
  } = useContext(InstructorContext);
  const { auth } = useContext(AuthContext);
  const params = useParams();

  const navigate = useNavigate();
  
   const editPage = async () => {
    if(currentEditedCourseId){

      const editDetails = await fetchInstructorCourseDetailsService(currentEditedCourseId);
      const setCourseFormData = Object.keys(courseLandingInitialFormData).reduce((acc, key)=>{
        acc[key]= editDetails?.data.data[key] || courseLandingInitialFormData[key]
        
        return acc
      }, {})
      setCourseLandingFormData(setCourseFormData)
      setCourseCurriculumFormData(editDetails?.data.data.curriculum || courseCurriculumInitialFormData)
    }
  
  };

  useEffect(() => {
    if (params.courseId) setCurrentEditedCourseId(params.courseId);
  }, [params.courseId]);
  useEffect(() => {
    console.log(currentEditedCourseId);
    editPage();
  }, [currentEditedCourseId]);

  const handleCreateCourse = async () => {
    const courseFinalFormData = {
      instructorId: auth?.user?._id,
      instructorName: auth?.user?.userName,
      date: new Date(),
      ...courseLandingFormData,
      students: [],
      curriculum: courseCurriculumFormData,
      isPublished: true,
    };
    try {
      const res = currentEditedCourseId !== null ? await updateCourseByIdservice(currentEditedCourseId, courseFinalFormData) :
       await addNewCourseService(courseFinalFormData);
      if (res.data.success) {
        alert("course has been created");
        setCourseLandingFormData(courseLandingInitialFormData);
        setCourseCurriculumFormData(courseCurriculumInitialFormData);
        navigate(-1);
        setCurrentEditedCourseId(null)
      }

      console.log(courseFinalFormData );
    } catch (err) {
      console.log(err);
      throw new Error("error submiting course");
    }
  };
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <Button
          onClick={handleCreateCourse}
          className="text-sm tracking-wider font-bold px-8"
        >
          Submit
        </Button>
      </div>
      <CardContent className="border border-gray-300 shadow-md rounded-md">
        <div className="container mx-auto p-4">
          <Tabs defaultValue="curriculum" className="space-y-4">
            <TabsList className="flex border-b border-gray-200">
              <TabsTrigger
                value="curriculum"
                className="px-4 py-2 text-sm font-medium border-b-2 border-transparent focus:outline-none focus:border-black hover:border-black transition-colors"
              >
                Curriculum
              </TabsTrigger>
              <TabsTrigger
                value="Course Landing Page"
                className="px-4 py-2 text-sm font-medium border-b-2 border-transparent focus:outline-none focus:border-black hover:border-black transition-colors"
              >
                Course Landing Page
              </TabsTrigger>
              <TabsTrigger
                value="Settings"
                className="px-4 py-2 text-sm font-medium border-b-2 border-transparent focus:outline-none focus:border-black hover:border-black transition-colors"
              >
                Settings
              </TabsTrigger>
            </TabsList>
            <TabsContent value="curriculum">
              <CourseCurriculum />
            </TabsContent>
            <TabsContent value="Course Landing Page">
              <CourseLanding />
            </TabsContent>
            <TabsContent value="Settings">
              <CourseSetting />
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </div>
  );
};

export default AddNewCoursePage;
