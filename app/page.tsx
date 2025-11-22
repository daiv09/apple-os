"use client";

import Navbar from "@/components/Navbar";
import NewDock from "@/components/New-Dock";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Fixed, responsive background */}
      <div
        className="fixed inset-0 bg-cover bg-center -z-10" // Add pointer-events-none
        style={{
          backgroundImage: "url('./background.jpg')",
        }}
        aria-hidden="true"
      ></div>

      {/* Navbar */}
      <div className="relative z-50">
        <Navbar />
      </div>

      {/* Main content */}
      <main className="relative z-10 flex flex-col items-center w-full pt-1 md:pt-4 lg:pt-8 snap-y snap-mandatory overflow-y-auto scroll-smooth flex-1 pb-20">
        {/* Show image inline (not as background) if desired */}
        {/* <img src="./Sequoia-Sunrise.heic" alt="" /> */}
        <NewDock />
      </main>
    </div>
  );
}
