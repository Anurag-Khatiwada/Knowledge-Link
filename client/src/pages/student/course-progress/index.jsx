import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import VideoPlayer from "@/components/video-player";
import { AuthContext } from '@/context/auth-context';
import StudentContext from '@/context/student-context';
import { getCurrentCourseProgressService, markLectureAsViewedService, resetCourseProgressService } from '@/services';
import { Check, ChevronLeft, ChevronRight, Play } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import { useNavigate, useParams } from 'react-router-dom';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const StudentViewCourseProgressPage = () => {
  const navigate = useNavigate();
  const { studentCurrentCourseProgress, setStudentCurrentCourseProgress } = useContext(StudentContext);
  const { auth } = useContext(AuthContext);

  const [lockCourse, setLockCourse] = useState(false);
  const [currentLecture, setCurrentLecture] = useState(null);
  const [showCourseCompleteDialogue, setShowCourseCompleteDialogue] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);  // Loading state to show a spinner when fetching data
  const { coursePurchsedId } = useParams();

  // Fetch current course progress
  const fetchCurrentCourseProgress = async () => {
    setIsLoading(true); // Start loading
    try {
      const response = await getCurrentCourseProgressService(auth?.user?._id, coursePurchsedId);
      if (response?.data?.success) {
        if (!response?.data?.data?.isPurchased) {
          setLockCourse(true);
        } else {
          setStudentCurrentCourseProgress({
            courseDetails: response?.data?.data?.courseDetails,
            progress: response?.data?.data?.progress,
          });

          if (response?.data?.completed) {
            setCurrentLecture(response?.data?.data?.courseDetails?.curriculum[0]);
            setShowCourseCompleteDialogue(true);
            setShowConfetti(true);
            return;
          }

          if (response?.data?.data?.progress?.length === 0) {
            setCurrentLecture(response?.data?.data?.courseDetails?.curriculum[0]);
          } else {
            const lastIndexOfViewedAsTrue = response?.data?.data?.progress.reduceRight(
              (acc, obj) => acc === -1 && obj.viewed ? obj._id : acc,
              -1
            );

            setCurrentLecture(
              response?.data?.data?.courseDetails?.curriculum[
                lastIndexOfViewedAsTrue + 1
              ]
            );
          }
        }
      }
    } catch (error) {
      console.error("Error fetching course progress:", error);
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const updateCourseProgress = async () => {
    if (currentLecture) {
      try {
        const response = await markLectureAsViewedService(
          auth?.user?._id,
          studentCurrentCourseProgress?.courseDetails?._id,
          currentLecture._id
        );
        if (response?.data?.success) {
          fetchCurrentCourseProgress();
        }
      } catch (error) {
        console.error("Error marking lecture as viewed:", error);
      }
    }
  };

  // Rewatch course from the beginning
  const handleRewatchCourse = async () => {
    try {
      const response = await resetCourseProgressService(
        auth?.user?._id,
        studentCurrentCourseProgress?.courseDetails?._id
      );
      if (response?.success) {
        setCurrentLecture(null);
        setShowConfetti(false);
        setShowCourseCompleteDialogue(false);
        fetchCurrentCourseProgress();
      }
    } catch (error) {
      console.error("Error resetting course progress:", error);
    }
  };

  useEffect(() => {
    fetchCurrentCourseProgress();
  }, [coursePurchsedId]);

  useEffect(() => {
    if (currentLecture?.progressValue === 1) {
      updateCourseProgress();
    }
  }, [currentLecture]);

  useEffect(() => {
    if (showConfetti) setTimeout(() => setShowConfetti(false), 5000);
  }, [showConfetti]);

  return (
    <div className="flex flex-col h-screen bg-[#1c1d1f] text-white">
      {showConfetti && <Confetti />}
      <div className="flex items-center justify-between p-4 bg-[#1c1d1f] border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <Button
            onClick={() => navigate("/student-courses")}
            className="text-black bg-blue-300"
            variant="ghost"
            size="sm"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to My Courses Page
          </Button>
          <h1 className="text-lg font-bold hidden md:block">
            {studentCurrentCourseProgress?.courseDetails?.title}
          </h1>
        </div>
        <Button onClick={() => setIsSideBarOpen(!isSideBarOpen)}>
          {isSideBarOpen ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className={`flex-1 ${isSideBarOpen ? "mr-[400px]" : ""} transition-all duration-300`}>
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              <div className="loader">Loading...</div> {/* Add a loading spinner here */}
            </div>
          ) : (
            <VideoPlayer
              width="100%"
              height="500px"
              url={currentLecture?.videoUrl}
              onProgressUpdate={setCurrentLecture}
              progressData={currentLecture}
            />
          )}
          <div className="p-6 bg-[#1c1d1f]">
            <h2 className="text-2xl font-bold mb-2">{currentLecture?.title}</h2>
          </div>
        </div>

        <div
          className={`fixed top-[64px] right-0 bottom-0 w-[400px] bg-[#1c1d1f] border-l border-gray-700 transition-all duration-300 ${
            isSideBarOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <Tabs defaultValue="content" className="h-full flex flex-col">
            <TabsList className="grid bg-[#676b72] w-full grid-cols-2 p-0 h-14">
              <TabsTrigger value="content" className=" text-black rounded-none h-full">
                Course Content
              </TabsTrigger>
              <TabsTrigger value="overview" className=" text-black rounded-none h-full">
                Overview
              </TabsTrigger>
            </TabsList>
            <TabsContent value="content">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-4">
                  {studentCurrentCourseProgress?.courseDetails?.curriculum.map((item) => (
                    <div
                      className="flex items-center space-x-2 text-sm text-white font-bold cursor-pointer"
                      key={item._id}
                    >
                      {studentCurrentCourseProgress?.progress?.find(
                        (progressItem) => progressItem.lectureId === item._id
                      )?.viewed ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                      <span>{item?.title}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="overview" className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-4">About this course</h2>
                  <p className="text-gray-400">
                    {studentCurrentCourseProgress?.courseDetails?.description}
                  </p>
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Course Complete Dialog */}
      <Dialog open={showCourseCompleteDialogue} onOpenChange={setShowCourseCompleteDialogue}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Congratulations, you've completed the course!</DialogTitle>
            <DialogDescription>Well done! You have completed all the lessons.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2">
            <Button onClick={handleRewatchCourse} className="bg-[#2d72d9]">
              Rewatch Course
            </Button>
            <Button
              onClick={() => setShowCourseCompleteDialogue(false)}
              className="bg-[#2d72d9]"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StudentViewCourseProgressPage;

