import axiosInstance from "@/api/axiosInstance";

export const registerService = async (formData) => {
  const res = await axiosInstance.post("/auth/register", {
    ...formData,
    role: "user",
  });
  return res.data;
};

export const loginService = async (formData) => {
  const res = await axiosInstance.post("/auth/login", formData);
  console.log(res.data);
  return res.data;
};

export const checkAuth = async () => {
  const res = await axiosInstance.get("/auth/check-auth");
  return res.data;
};

export const mediaUpload = async (file, onProgressCallback) => {
  const res = await axiosInstance.post("/media/upload", file, {
    onUploadProgress: (ProgressEvent) => {
      const percentCompleted = Math.round(
        (ProgressEvent.loaded * 100) / ProgressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  return res;
};

export const mediaDelete = async (id) => {
  const res = await axiosInstance.delete(`/media/delete/${id}`);
  return res;
};

export const fetchInstructorCourseListService = async () => {
  const res = await axiosInstance.get(`/instructor/course/get`);
  return res;
};
export const addNewCourseService = async (formData) => {
  const res = await axiosInstance.post(`/instructor/course/add`, formData);
  return res;
};
export const fetchInstructorCourseDetailsService = async (id) => {
  const res = await axiosInstance.get(`/instructor/course/get/details/${id}`);
  return res;
};
export const updateCourseByIdservice = async (id, formData) => {
  const res = await axiosInstance.put(
    `/instructor/course/update/${id}`,
    formData
  );
  return res;
};

export const mediaBulkUploadService = async (files, onProgressCallback) => {
  const res = await axiosInstance.post("/media/bulk-upload", files, {
    onUploadProgress: (ProgressEvent) => {
      const percentCompleted = Math.round(
        (ProgressEvent.loaded * 100) / ProgressEvent.total
      );
      onProgressCallback(percentCompleted);
    },
  });
  return res;
};

export const fetchStudentViewCourseListService = async (query) => {
  const res = await axiosInstance.get(`/student/course/get?${query}`);
  return res;
};
export const fetchStudentViewCourseDetailsService = async (courseId) => {
  const res = await axiosInstance.get(`student/course/get/details/${courseId}`);
  return res;
};
export const checkCoursePurchaseInfoService = async (courseId, studentId) => {
  const res = await axiosInstance.get(
    `student/course/purchase-info/${courseId}/${studentId}`
  );
  return res;
};

export const createPaymentService = async (payload) => {
  const res = await axiosInstance.post(`/student/order/create`, payload);
  return res;
};

export const captureAndFinalizeService = async (
  paymentId,
  payerId,
  orderId
) => {
  const res = await axiosInstance.post(`/student/order/finalize`, {
    paymentId,
    payerId,
    orderId,
  });
  return res;
};
export const fetchStudentBoughtCoursesService = async (studentId) => {
  const res = await axiosInstance.get(
    `/student/courses-bought/get/${studentId}`
  );
  return res;
};

export const getCurrentCourseProgressService = async (userId, courseId) => {
  const res = await axiosInstance.get(
    `student/course-progress/get/${userId}/${courseId}`
  );
  return res;
};
export async function markLectureAsViewedService(userId, courseId, lectureId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/mark-lecture-viewed`,
    {
      userId,
      courseId,
      lectureId,
    }
  );

  return data;
}

export async function resetCourseProgressService(userId, courseId) {
  const { data } = await axiosInstance.post(
    `/student/course-progress/reset-progress`,
    {
      userId,
      courseId,
    }
  );

  return data;
}
