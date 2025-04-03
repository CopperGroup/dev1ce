import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../globals.css";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import StickyCart from "@/components/shared/StickyCart";
import Provider from "../Provider";
import { AppWrapper } from "./context";
import { SpeedInsights } from "@vercel/speed-insights/next"
import { getSession } from "@/lib/getServerSession";
import { fetchUserByEmail } from "@/lib/actions/user.actions";
import FacebookPixel from "@/components/pixel/FacebookPixel";
import PageView from "@/components/pixel/PageView";


const inter = Inter({ subsets: ["latin", "cyrillic"] });

export const metadata: Metadata = {
  title: {
    default: "Sveamoda",
    template: "%s - Sveamoda"
  },
  description: "",
  twitter: {
    card: "summary_large_image"
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const email = await getSession();

  const user = await fetchUserByEmail({email});

  return (
      <html lang="uk">
        <body className={inter.className}>
          {/* <Analytics /> */}
          <FacebookPixel />
          <Provider>
              <Header email={email} user={JSON.stringify(user)}/>
              <AppWrapper>
                <PageView />
                <main className = "main-container">
                  <div className = "w-full max-w-[1680px] px-5 max-[420px]:px-0">
                    {children}
                 </div>
                </main>
                <StickyCart/>
            </AppWrapper>
          <Footer/>
          </Provider>
          <SpeedInsights/>
        </body>
      </html>
  );
}