"use client";

import * as React from "react";

export function VideoBackground() {
  const [mounted, setMounted] = React.useState(false);
  const [videoLoaded, setVideoLoaded] = React.useState(false);
  const [videoError, setVideoError] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="fixed inset-0 w-full h-full z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900" />
      </div>
    );
  }

  return (
    <>
      {/* Fixed Video Background */}
      <div className="fixed inset-0 w-full h-full z-0">
        {!videoError && (
          <video
            autoPlay
            muted
            loop
            playsInline
            className={`w-full h-full object-cover transition-opacity duration-1000 ${
              videoLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => setVideoError(true)}
          >
            <source src="/videos/Home.mp4" type="video/mp4" />
          </video>
        )}

        {/* Fallback Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 transition-opacity duration-1000 ${
            videoError || !videoLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />

        {/* Video Overlay */}
        <div className="absolute inset-0 bg-black/30 dark:bg-black/50" />
      </div>
    </>
  );
}
