import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import InstructorContext from "@/context/indtructor-context";
import { Label } from "@radix-ui/react-label";
import { Switch } from "@/components/ui/switch";
import React, { useContext, useRef } from "react";
import {mediaBulkUploadService, mediaDelete, mediaUpload } from "@/services";
import MediaProgressBar from "@/components/common-form/media-progress-tracking";
import VideoPlayer from "@/components/video-player";
import { replace } from "react-router-dom";
import { Upload } from "lucide-react";

const CourseCurriculum = () => {
  const {
    courseCurriculumFormData,
    setCourseCurriculumFormData,
    mediaUploadProgress,
    setMediaUploadProgress,
    mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,
  } = useContext(InstructorContext);

  const bulkUploadInputRef = useRef(null)

  //Add new lecture
  const handleNewLecture = () => {
    const newLectureTemplate = {
      title: "",
      freePreview: false,
      videoUrl: "",
      public_id: "",
    };
    setCourseCurriculumFormData([
      ...courseCurriculumFormData,
      newLectureTemplate,
    ]);
  };

  //handle title change in courseCUrriculum
  const handleCourseTitleChange = (event, currentIndex) => {
    const updatedFormData = [...courseCurriculumFormData];
    updatedFormData[currentIndex] = {
      ...updatedFormData[currentIndex],
      title: event.target.value,
    };
    setCourseCurriculumFormData(updatedFormData);
    console.log("Updated FormData after title change:", updatedFormData);
  };


    //handel Free preview
  const handleSwitchChange = (currentValue, currentIndex) => {
    const updatedFormData = [...courseCurriculumFormData];
    updatedFormData[currentIndex] = {
      ...updatedFormData[currentIndex],
      freePreview: currentValue,
    };
    setCourseCurriculumFormData(updatedFormData);
    console.log("Updated FormData after switch change:", updatedFormData);
  };


  //handle uploading of single images or uploads
  const handleSingleFileUpload = async (event, currentIndex) => {
    const selected = event.target.files[0];
    const videoFormData = new FormData();
    videoFormData.append("file", selected);

    try {
      setMediaUploadProgress(true);
      const result = await mediaUpload(videoFormData, setMediaUploadProgressPercentage);
      console.log(result.data.data);

      if (result.data.success) {
        const { url, public_id } = result.data.data;
        const updatedFormData = [...courseCurriculumFormData];
        updatedFormData[currentIndex] = {
          ...updatedFormData[currentIndex],
          videoUrl: url,
          public_id: public_id,
        };
        setCourseCurriculumFormData(updatedFormData);
        setMediaUploadProgress(false);

        console.log("Updated FormData after video upload:", updatedFormData);
      }
    } catch (err) {
      console.warn("File upload failed:", err);
    } finally {
      setMediaUploadProgress(false);
    }
  };

  //handle replace of video
  const handleReplace = async (currentIndex) =>{
    const updatedFormData = [...courseCurriculumFormData];
    const id = updatedFormData[currentIndex].public_id;

    const replaceVideoRes = await mediaDelete(id);

    if(replaceVideoRes.data.success){
      updatedFormData[currentIndex]={
        ...updatedFormData[currentIndex],
        videoUrl: '',
        public_id: '',
      }
      setCourseCurriculumFormData(updatedFormData)
    }
    console.log(courseCurriculumFormData)
  }

  const areAllCourseCurriculumFormDataObjectsEmpty = (arr)=>{
    return arr.every((obj)=>{
      return Object.entries(obj).every(([key,value])=>{
        
        if(typeof value === 'boolean'){1
          return true
        }
        return value===''

      })
    })
  }

  //handle bulk media upload
  const handleBulkUploadDialogue = ()=>{
    bulkUploadInputRef.current?.click();
  }
  const handleMediaBulkUpload = async (event)=>{
    const selectedFiles = Array.from(event.target.files)
    console.log(selectedFiles)

      const bulkFormData = new FormData();
      selectedFiles.forEach(fileItem=>bulkFormData.append('file', fileItem))
    

      try{
        setMediaUploadProgress(true)
        const response = await mediaBulkUploadService(bulkFormData, setMediaUploadProgressPercentage);
        console.log(response.data.data)
        if(response.data.success){
          let cpyCourseCurriculumFormData = areAllCourseCurriculumFormDataObjectsEmpty(courseCurriculumFormData)? []:
          [...courseCurriculumFormData];

          cpyCourseCurriculumFormData =[
            ...cpyCourseCurriculumFormData,
            ...response?.data?.data.map((item, index)=>({
              videoUrl: item?.url,
              public_id: item?.public_id,
              title: `Lecture ${cpyCourseCurriculumFormData.length+index+1}`,
              freePreview: false
            }))

          ]
          setCourseCurriculumFormData(cpyCourseCurriculumFormData);
          setMediaUploadProgress(false)

        }
      }catch(err){
        console.log(err)
      }
  }

  const handleDeleteLecture = async (currentIndex)=>{
    let cpyCourseCurriculumFormData = [...courseCurriculumFormData];
    const getCurrentVideoId = cpyCourseCurriculumFormData[currentIndex]?.public_id;
    const response = await mediaDelete(getCurrentVideoId);

    if(response.data?.success){
      cpyCourseCurriculumFormData = cpyCourseCurriculumFormData.filter((_,index)=> index!==currentIndex)
      setCourseCurriculumFormData(cpyCourseCurriculumFormData);
    }
  }

  return (
    <Card>
      <CardHeader className='flex flex-row justify-between'>
        <CardTitle>Create Course Curriculum</CardTitle>
        <div>
          <Input
          type = 'file'
          ref={bulkUploadInputRef}
          accept = "video*/"
          multiple
          className='hidden'
          label='bulk-media-upload'
          onChange={handleMediaBulkUpload}
          />
          <Button
          as="label"
          htmlFor='bulk-media-upload'
          className='cursor-pointer'
          onClick={handleBulkUploadDialogue}
          >
            <Upload className="w-4 h-5 mr-2"/>
            Bulk Upload
          </Button>
        </div>
      </CardHeader> 
        <CardContent>
          <Button onClick={handleNewLecture}>Add Lecture</Button>
          {mediaUploadProgress && (
            <div className="w-full max-w-full mt-4">
              <MediaProgressBar
                isMediaUploading={mediaUploadProgress}
                progress={mediaUploadProgressPercentage}
              />
            </div>
          )}
          <div className="mt-4 space-y-4">
            {courseCurriculumFormData.map((curriculumItem, index) => (
              <div key={index} className="border p-5 rounded-md">
                <div className="flex gap-5 items-center">
                  <h3 className="font-semibold">Lecture {index + 1}</h3>
                  <Input
                    name={`title-${index + 1}`}
                    placeholder="Enter lecture title"
                    className="max-w-96"
                    onChange={(event) => handleCourseTitleChange(event, index)}
                    value={curriculumItem?.title || ""}
                  />
                  <div className="flex items-center space-x-2">
                    <Switch
                      id={`freePreview-${index + 1}`}
                      onCheckedChange={(value) =>
                        handleSwitchChange(value, index)
                      }
                      checked={curriculumItem?.freePreview || false}
                    />
                    <Label htmlFor={`freePreview-${index + 1}`}>
                      Free Preview
                    </Label>
                  </div>
                </div>
                <div className="mt-6">
                  {curriculumItem.videoUrl ? (
                    <div className="flex gap-3">
                      <VideoPlayer url={curriculumItem.videoUrl} d
                      width = "450px"
                      height= "450px"
                      
                      />
                      <Button onClick={()=>handleReplace(index)}>Replace video</Button>
                      <Button onClick={()=>handleDeleteLecture(index)} className="bg-red-900">Delete lecture</Button>
                    </div>
                  ) : (
                    <Input
                      type="file"
                      accept="video/*"
                      onChange={(event) => handleSingleFileUpload(event, index)}
                      className="mb-4"
                    />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      
    </Card>
  );
};

export default CourseCurriculum;
 