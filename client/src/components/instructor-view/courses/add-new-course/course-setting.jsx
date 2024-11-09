import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import InstructorContext from '@/context/indtructor-context'
import { mediaUpload } from '@/services'
import { Label } from '@radix-ui/react-label'
import React, { useContext } from 'react'

const CourseSetting = () => {

  const {courseLandingFormData, setCourseLandingFormData, mediaUploadProgress, setMediaUploadProgress, mediaUploadProgressPercentage,
    setMediaUploadProgressPercentage,} = useContext(InstructorContext);

  const handleCourseSettingUplod = async (event)=>{
    const selected = event.target.files[0];
    if(selected){
      let imageFormData = new FormData();
      imageFormData.append("file", selected);

    try{
      setMediaUploadProgress(true)
      const response = await mediaUpload(imageFormData, mediaUploadProgressPercentage);
      const imageUrl = response.data.data.url;

      
      if(response.data.success){
        
        setCourseLandingFormData((courseLandingFormData)=> ({
          ...courseLandingFormData,
          image: imageUrl
      }))
      setMediaUploadProgress(false)
        console.log(courseLandingFormData);
      }
    }catch(err){
      console.log(err);
    }
 
  }
  }

  return (
<Card>
  <CardHeader>
    <CardTitle>Course Setting</CardTitle>
  </CardHeader>
  <CardContent>
    {
      mediaUploadProgress? <p className='font-bold mb-2'>uploading Image...</p> : courseLandingFormData?.image ? <img className='w-20 h-20 object-cover' src={courseLandingFormData.image} alt="" /> : <p className='font-bold mb-2'>No any imgage</p>
    }
    <div className='flex flex-col gap-3'>
      <Label>
        Upload course image
      </Label>
      <Input
      type="file"
      accept="image/"
      className='mb-4'
      onChange={(event)=>handleCourseSettingUplod(event)}
      >
      </Input>
    </div>
  </CardContent>
</Card>
  )
}

export default CourseSetting
