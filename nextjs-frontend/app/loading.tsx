export default function Loading() {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-950/70 backdrop-blur-md">
      {/* Background ambient glowing light spots */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-green-500/10 blur-[80px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 h-60 w-60 rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" />

      <div className="relative flex flex-col items-center max-w-xs px-6 py-8 text-center">
        {/* Animated outer glass container */}
        <div className="relative mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-900/60 border border-white/10 shadow-2xl">
          {/* Custom Spinner Border */}
          <div className="absolute inset-0 rounded-2xl border border-transparent border-t-green-50 animate-[spin_1.2s_linear_infinite]" />
          
          {/* Pulsing Travel Compass Pin Icon */}
          <div className="text-green-50 animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.75}
              stroke="currentColor"
              className="h-9 w-9"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
              />
            </svg>
          </div>
        </div>

        {/* Brand name */}
        <h2 className="text-lg font-black tracking-[0.25em] text-white uppercase">
          VietTour
        </h2>
        
        {/* Subtext */}
        <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wider text-emerald-400/80 animate-pulse">
          Khám phá hành trình mới...
        </p>

        {/* Progress Bar */}
        <div className="relative mt-5 h-0.5 w-32 overflow-hidden rounded-full bg-white/10">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 to-green-50"
            style={{
              animation: "loading-progress 1.5s infinite linear",
            }}
          />
        </div>
      </div>

      {/* Inject custom keyframes for progress bar animation */}
      <style>{`
        @keyframes loading-progress {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  );
}
