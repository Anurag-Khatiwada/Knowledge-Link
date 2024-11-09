import axiosInstance from "@/api/axiosInstance"

export const registerService = async (formData) =>{
    const res = await axiosInstance.post("/auth/register",{
        ...formData,
        role: 'user'
    })
    return res.data;
}

export const loginService = async (formData) =>{
    const res = await axiosInstance.post("/auth/login", formData)
    console.log(res.data)
    return res.data;
}

export const checkAuth = async () =>{
    const res = await axiosInstance.get("/auth/check-auth")
    return res.data;
}

export const mediaUpload = async (file, onProgressCallback)=>{
    const res = await axiosInstance.post("/media/upload", file, {
        onUploadProgress: (ProgressEvent=>{
            const percentCompleted = Math.round((ProgressEvent.loaded * 100)/ProgressEvent.total)
            onProgressCallback(percentCompleted)
        })
    });
    return res
}

export const mediaDelete = async (id)=>{
    const res = await axiosInstance.delete(`/media/delete/${id}`);
    return res
}

export const fetchInstructorCourseListService = async()=>{
    const res = await axiosInstance.get(`/instructor/course/get`);
    return res
}
export const addNewCourseService = async(formData)=>{
    const res = await axiosInstance.post(`/instructor/course/add`,formData);
    return res
}
export const fetchInstructorCourseDetailsService = async(id)=>{
    const res = await axiosInstance.get(`/instructor/course/get/details/${id}`);
    return res
}
export const updateCourseByIdservice = async(id, formData)=>{
    const res = await axiosInstance.put(`/instructor/course/update/${id}`, formData);
    return res
}


export const mediaBulkUploadService = async (files, onProgressCallback)=>{
    const res = await axiosInstance.post("/media/bulk-upload", files, {
        onUploadProgress: (ProgressEvent=>{
            const percentCompleted = Math.round((ProgressEvent.loaded * 100)/ProgressEvent.total)
            onProgressCallback(percentCompleted)
        })
    });
    return res
}

export const fetchStudentViewCourseListService = async ()=>{
    const res = await axiosInstance.get("/student/course/get");
    return res
}
export const fetchStudentViewCourseDetailsService = async (courseId)=>{
    const res = await axiosInstance.get(`student/course/get/details/${courseId}`);
    return res
}