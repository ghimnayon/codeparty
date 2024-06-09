import localFont from 'next/font/local'
import "./globals.css";
import ClientSessionProvider from "@/components/ClientSessionProvider";
import { ScheduleProvider } from "@/components/schedule/ScheduleContext";

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
})

// const titan = localFont({ src: '../fonts/TitanOne.ttf' })

const titan = localFont({
  src: '../fonts/TitanOne.ttf',
  display: 'swap',
  variable: '--font-titan',
});

export const metadata = {
  title: "CodeTravel : AI와 함께 여행 일정 짜기",
  description: "Web Programming Project",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${pretendard.variable} ${titan.variable}`}>
      <body>
        <ClientSessionProvider>
          <ScheduleProvider>
            {children}
          </ScheduleProvider>
        </ClientSessionProvider>
      </body>
    </html>
  );
}