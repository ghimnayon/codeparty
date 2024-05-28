"use client";

import { signIn } from "next-auth/react";

export default function Login() {
  return (
    <div className="flex justify-center h-screen">
      <div className="grid m-auto text-center">
        <button
          className={`w-40
                    justify-self-center
                    p-1 mb-4
                  bg-yellow-500 text-black
                    border border-yellow-500 rounded
                  hover:bg-white hover:text-yellow-500`}
          onClick={() => signIn("kakao")}
        >
          Sign in with Kakao
        </button>
      </div>
    </div>
  );
}