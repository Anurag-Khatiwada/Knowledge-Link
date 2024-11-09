import InstructorCourses from '@/components/instructor-view/courses';
import InstructorDashbord from '@/components/instructor-view/dashbord';
import { Button } from '@/components/ui/button';
import { AuthContext } from '@/context/auth-context';
import InstructorContext from '@/context/indtructor-context';
import { fetchInstructorCourseListService } from '@/services';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@radix-ui/react-tabs';
import { BarChart, Book, LogOut } from 'lucide-react';
import React, { useContext, useEffect, useState } from 'react';

const InstructorDashbordPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const {resetCredentials} = useContext(AuthContext)
  const {instructorCourseList, setInstructorCourseList}= useContext(InstructorContext)
  
  const fetchAllCourses = async ()=>{
    const response = await fetchInstructorCourseListService()
    setInstructorCourseList(response.data.data)
    console.log(instructorCourseList)
  }
  useEffect(()=>{
    fetchAllCourses()
  },[])
  const menuItems = [
    {
      icon: BarChart,
      label: 'Dashboard',
      value: 'dashboard', // Ensure this matches the activeTab state
      component: <InstructorDashbord />
    },
    {
      icon: Book,
      label: 'Courses',
      value: 'courses', // Ensure this matches the activeTab state
      component: <InstructorCourses listOfCourses={instructorCourseList}/>
    },
    {
      icon: LogOut,
      label: 'Logout',
      value: 'logout',
      component: null
    }
  ];

  const handleLogout = () => {
    resetCredentials();
    sessionStorage.clear();
  };

  return (
    <div className='flex h-full  min-h-screen bg-gray-100'>
      <aside className='w-64 bg-white shadow-md hidden md:block'>
        <div className='p-4'>
          <h2 className='text-2xl font-bold mb-4'>Instructor view</h2>
          <nav>
            {menuItems.map(menuItem => (
              <Button
                className="w-full justify-start mb-2"
                key={menuItem.value}
                varient = {activeTab === menuItem.value?"secondary":"ghost"}
                onClick={menuItem.value === 'logout' ? handleLogout : () => setActiveTab(menuItem.value)}
              >
                <menuItem.icon className='mr-2 h-4 w-4' />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>
      <main className='flex-1 p-8 overflow-y-auto'>
        <div className='max-w-7xl mx-auto'>
          <h1 className='text-3xl font-bold mb-8'>Dashboard</h1>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {menuItems.map(menuItem => (
              <TabsContent key={menuItem.value} value={menuItem.value}>
                {menuItem.component}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default InstructorDashbordPage;
