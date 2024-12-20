import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import VideoPlayer from "@/components/video-player";
import StudentContext from "@/context/student-context";
import { checkCoursePurchaseInfoService, createPaymentService, fetchStudentViewCourseDetailsService } from "@/services";
import { Car, CheckCircle, Globe, Lock, PlayCircle } from "lucide-react";
import React, { useContext, useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { AuthContext } from "@/context/auth-context";
import { disableInstantTransitions } from "framer-motion";

const StudentViewCourseDetailPage = () => {
  const {
    studentViewCourseDetails,
    setStudentViewCourseDetails,
    currentCourseDetailsId,
    setCurrentCourseDetailsId,
    loadingState,
    setLoadingState,
  } = useContext(StudentContext);

  const{auth} = useContext(AuthContext);

  const [displayCurrentVideoFreePreview, setDisplayCurrentVideoFreePreview] =
    useState(null);
  const [showFreePreviewDialog, setShowFreePreviewDialogue] = useState(false);
  const [approvalUrl, setApprovalUrl] = useState('')
  const [coursePurchased, setCoursePurchased] = useState(false)

  const { id } = useParams();

  const location = useLocation();

  const fetchCurrentCourseDetails = async (courseId) => {
    try {
      setLoadingState(true);

      const checkCoursePurchasedInfo = await checkCoursePurchaseInfoService(courseId, auth?.user?._id);
      if(checkCoursePurchasedInfo.data.data===true){
        setCoursePurchased(true);

      }

      const courseDetails = await fetchStudentViewCourseDetailsService(
        courseId,
      );
      if (courseDetails.data.success) {
        
        setStudentViewCourseDetails(courseDetails.data.data);
        setLoadingState(false);
      } else {
        setStudentViewCourseDetails(null);
        setLoadingState(false);

      }
    } catch (err) {
      console.log(err);
    } 
       // Ensure loading state is turned off even in case of an error
 
  };

  useEffect(() => {
    if (id) {
      setCurrentCourseDetailsId(id);
    }
  }, [id]);

  // Wrap the async call inside an async function to correctly handle promises in useEffect
  useEffect(() => {
    if (currentCourseDetailsId) {
      fetchCurrentCourseDetails(currentCourseDetailsId);
    }
  }, [currentCourseDetailsId]);

  useEffect(() => {
    if (!location.pathname.includes("course/details")) {
      setStudentViewCourseDetails(null), setCurrentCourseDetailsId(null);
    }
  }, [location.pathname]);

  if (loadingState) return <Skeleton />;

  const getIndexOfFreePreview =
    studentViewCourseDetails !== null
      ? studentViewCourseDetails?.curriculum?.findIndex(
          (item) => item.freePreview
        )
      : -1;
  
  const handelSetFreePreview = (curriculumItem) => {
    setShowFreePreviewDialogue(true);
    setDisplayCurrentVideoFreePreview(curriculumItem.videoUrl)
  };
  
  const handleCreatePayment = async ()=>{
    const paymentPayload = {
      userId: auth?.user?._id,
      userName: auth?.user?.userName,
      userEmail:auth?.user?.userEmail,
      orderStauts: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'initiated',
      orderDate: new Date(),
      paymentId:'',
      payerId:'',
      instructorId: studentViewCourseDetails?.instructorId,
      instructorName: studentViewCourseDetails?.instructorName,
      courseImage: studentViewCourseDetails?.image,
      courseTitle: studentViewCourseDetails?.title,
      courseId: studentViewCourseDetails?._id,
      coursePricing: studentViewCourseDetails?.pricing,
    }

    const response = await createPaymentService(paymentPayload)
    console.log(response.data.success, response.data.data.orderId, response.data.data.approveUrl)
    if(response?.data?.success){
      sessionStorage.setItem("currentOrderId", JSON.stringify(response?.data?.data?.orderId));
      setApprovalUrl(response.data.data.approveUrl);
    }
  }

  if(approvalUrl!==''){
    window.location.href=approvalUrl
  }
  return (
    <div className="mx-auto p-4">
      <div className="bg-gray-900 text-white p-8 rounded-t-lg">
        <h1 className="text-3xl font-bold mb-4">
          {studentViewCourseDetails?.title}
        </h1>
        <p className="text-xl mb-4">{studentViewCourseDetails?.subtitle}</p>
        <div className="flex items-center space-x-4 mt-2 text-sm">
          <span>created BY: {studentViewCourseDetails?.instructorName}</span>
          <span>on: {studentViewCourseDetails?.date.split("T")[0]}</span>
          <span className="flex items-center">
            <Globe className="mr-1 h-4 w-4" />
            {studentViewCourseDetails?.primaryLanguage}
          </span>
          <span>
            {studentViewCourseDetails?.students.length}{" "}
            {studentViewCourseDetails?.students.length <= 1
              ? "student"
              : "students"}
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-8 mt-8">
        <main className="flex-grow">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="mb-3">What you'll learn</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {studentViewCourseDetails?.objectives
                  .split(",")
                  .map((objective, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="mr-2 h-5 w-5 text-green-500 flex-shrink-0" />
                      <span>{objective}</span>
                    </li>
                  ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Course Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xl mt-4">
                {studentViewCourseDetails?.description}
              </p>
            </CardContent>
          </Card>
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="mb-3">Course Curriculum</CardTitle>
            </CardHeader>
            <CardContent>
              {studentViewCourseDetails?.curriculum?.map(
                (curriculumItem, index) => (
                  <li
                    key={index}
                    className={`${
                      curriculumItem?.freePreview
                        ? "cursor-pointer"
                        : "cursor-not-allowed"
                    } flex items-center mb-4`}
                    onClick={curriculumItem?.freePreview ? () => handelSetFreePreview(curriculumItem) : undefined}
                    >
                    {curriculumItem?.freePreview ? (
                      <PlayCircle className="mr-2 h-4 w-4" />
                    ) : (
                      <Lock className="mr-2 h-4 w-4" />
                    )}
                    <span>{curriculumItem?.title}</span>
                  </li>
                )
              )}
            </CardContent>
          </Card>
        </main>
        <aside className="w-full md:w-[500px]">
          <Card className="sticky top-4">
            <CardContent className="p-6">
              <div className="aspect-video mb-4 rounded-lg flex items-center justify-center">
                <VideoPlayer
                  url={
                    getIndexOfFreePreview !== -1
                      ? studentViewCourseDetails?.curriculum[
                          getIndexOfFreePreview
                        ].videoUrl
                      : ""
                  }
                  width="450px"
                  height="200px"
                />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-green-500">
                  ${studentViewCourseDetails?.pricing}
                </span>
              </div>
              <Button disabled={coursePurchased} onClick={handleCreatePayment} className="w-full">{coursePurchased===true?"You have already purchased this course":"Buy Now"}</Button>
            </CardContent>
          </Card>
        </aside>
      </div>
      <Dialog 
        open={showFreePreviewDialog}
        onOpenChange={()=>{
          setShowFreePreviewDialogue(null)
          setDisplayCurrentVideoFreePreview(null)
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Course Preview</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <VideoPlayer className=''
            url={displayCurrentVideoFreePreview}
            width="400px"
            height="200px"
            />
          </div>
          <div className="flex flex-col gap-2">
            {
              studentViewCourseDetails?.curriculum.filter(item=>item.freePreview).map(filteredItem=><p onClick={()=>handelSetFreePreview(filteredItem)} className=" cursor-pointer font-bold text-[16px]">{filteredItem?.title}</p>)
            }
          </div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentViewCourseDetailPage;
