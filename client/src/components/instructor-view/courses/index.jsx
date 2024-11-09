import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import InstructorContext from "@/context/indtructor-context";
import { Delete, Edit } from "lucide-react";

import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  courseCurriculumInitialFormData,
  courseLandingInitialFormData,
} from "@/config";

const InstructorCourses = ({ listOfCourses }) => {
  const navigate = useNavigate();
  const {currentEditedCourseId,
    setCurrentEditedCourseId, setCourseLandingFormData,
    setCourseCurriculumFormData,} = useContext(InstructorContext)

  return (
    <Card>
      <CardHeader className="flex flex-row justify-between items-center">
        <CardTitle className="font-bold text-3xl">All Courses</CardTitle>
        <Button
          onClick={() => {
            setCurrentEditedCourseId(null)
            setCourseCurriculumFormData(courseCurriculumInitialFormData);
            setCourseLandingFormData(courseLandingInitialFormData)
            navigate("/instructor/create-new-course")}}
          className="p-6"
        >
          Create New Course
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Course</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Revenue</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
                {listOfCourses.length>0 && listOfCourses.map((c) => (
                  <>
              <TableRow>
                    <TableCell className="font-medium">
                      {c.title}
                    </TableCell>
                    <TableCell>{c.students.length}</TableCell>
                    <TableCell>${c.pricing}</TableCell>
                    <TableCell className="text-right">
                      <Button onClick={()=>navigate(`/instructor/edit-course/${c?._id}`)} varient="ghost" size="sm" className="mr-3">
                        <Edit className="h-6 w-6"></Edit>
                      </Button>
                      <Button varient="ghost" size="sm">
                        <Delete className="h-6 w-6"></Delete>
                      </Button>
                    </TableCell>
              </TableRow>
                  </>
                ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstructorCourses;
