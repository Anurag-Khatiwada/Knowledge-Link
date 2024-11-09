import { GraduationCap, TvMinimalPlay } from "lucide-react";
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { AuthContext } from '@/context/auth-context';

const StudentViewCommonHeader = () => {
    const { resetCredentials } = useContext(AuthContext);

    const handleLogout = () => {
        resetCredentials();
        sessionStorage.clear();
    };

    return (
        <header className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center space-x-4">
                <Link to="/home" className="flex items-center hover:text-red-700">
                    <GraduationCap className="h-8 w-8 mr-4" />
                    <span className="font-extrabold md:text-xl text-[14px]">
                        KNOWLEDGE-LINK
                    </span>
                </Link>
            </div>
            <div className="flex mr-3 justify-between flex-grow mx-8 items-center">
                <Button variant="ghost" className="text-[14px] md:text-[16px]">
                    <Link to="/courses">
                    Explore Courses
                    </Link>
                </Button>
                <div className="flex items-center gap-3">
                    <span className="font-extrabold md:text-xl text-[14px]">My Courses</span>
                    <TvMinimalPlay className="w-8 h-8 cursor-pointer" />
                </div>
            </div>
            <Button onClick={handleLogout}>Sign Out</Button>
        </header>
    );
};

export default StudentViewCommonHeader;
