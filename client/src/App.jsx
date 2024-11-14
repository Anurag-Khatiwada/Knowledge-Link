import { Route, Routes } from "react-router-dom";
import { Button } from "./components/ui/button";
import Auth from "./pages/auth/index";
import { useContext } from "react";
import { AuthContext } from "./context/auth-context";
import StudentHomePage from "./pages/student/home";
import StudentViewCommonLayout from "./components/student-view/common-layout";
import RouteGaurd from "./components/route-gaurd/index";
import InstructorDashbordPage from "./pages/Instructor";
import NotFound from "./pages/notFound";
import AddNewCoursePage from "./pages/Instructor/add-new-course";
import StudentViewCoursePage from "./pages/student/courses";
import StudentViewCourseDetailPage from "./pages/student/course-details";
import PaypalPaymentReturnPage from "./pages/student/payment-return";
import StudentCoursesPage from "./pages/student/student-courses";
function App() {
  const { auth } = useContext(AuthContext);
  return (
    <>
      <Routes>
        <Route
          path="/auth"
          element={
            <RouteGaurd
              authenticated={auth.authenticate}
              user={auth.user}
              element={<Auth />}
            />
          }
        />

        <Route
          path="/instructor"
          element={
            <RouteGaurd
              element={<InstructorDashbordPage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/create-new-course"
          element={
            <RouteGaurd
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />
        <Route
          path="/instructor/edit-course/:courseId"
          element={
            <RouteGaurd
              element={<AddNewCoursePage />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        />

        <Route
          path="/"
          element={
            <RouteGaurd
              element={<StudentViewCommonLayout />}
              authenticated={auth?.authenticate}
              user={auth?.user}
            />
          }
        >
          
          <Route path="/home" element={<StudentHomePage />} />
          <Route path="/courses" element={<StudentViewCoursePage />} />
          <Route path="/course/details/:id" element={<StudentViewCourseDetailPage />} />
          <Route path="payment-return" element={<PaypalPaymentReturnPage />} />
          <Route path="/student-courses" element={<StudentCoursesPage />} />

        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
