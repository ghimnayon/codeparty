import React, { useEffect, useState } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { signIn, signOut, useSession } from 'next-auth/react';
import { UserMenu } from "@/app/login/user_menu";

const UserPopover = () => {
  const { data: session } = useSession();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(prev => !prev);
  };

  useEffect(() => {
    // Session 상태가 변경될 때마다 콘솔에 출력
    // console.log('Session:', session);
  }, [session]);

  return (
    <div className="p-5 mt-2 flex mr-4 font-pretendard">
      <div className="flex justify-end w-4/5 mr-5 mt-4 p-1 text-l font-pretendard font-light text-black">
        {/* AI와 함께 여행 일정 짜기 */}
      </div>
      <Popover open={showUserMenu} onOpenChange={setShowUserMenu}>
        <PopoverTrigger asChild>
          <Button
            className="flex items-center bg-gray-200 border p-1 rounded-full" 
            style={{width:'110px', height:'60px'}}
            onClick={() => {
              if (session) {
                toggleUserMenu();
              } else {
                signIn("kakao");
              }
            }}
          >
            <div className="flex flex-col justify-center items-center mr-2 ml-5">
              <div className="w-4 h-0.5 bg-gray-500 mb-1"></div>
              <div className="w-4 h-0.5 bg-gray-500 mb-1"></div>
              <div className="w-4 h-0.5 bg-gray-500"></div>
            </div>
            <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center">
              {session?.user?.profileImage ? (
                <img src={session.user.profileImage} alt="User Profile" className="w-10 h-10 rounded-full" />
              ) : (
                <img src="/profileicon.png" alt="User Icon" className="w-13 h-13" />
              )}
            </div>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-60 bg-white p-6 shadow-lg">
          <div className="mt-0">
            <UserMenu />
          </div>
          <Button className="w-full bg-gray-500 text-white rounded-full mt-4" onClick={() => signOut()}>
            로그아웃
          </Button>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default UserPopover;
