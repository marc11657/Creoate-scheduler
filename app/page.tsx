import ExpiredScreen from "@/components/ExpiredScreen";
import Scheduler from "@/components/Scheduler";
import WhyBuildThis from "@/components/WhyBuildThis";
import Footer from "@/components/Footer";

export default function Home() {
  const ownerName = process.env.NEXT_PUBLIC_OWNER_NAME || "Marc";

  return (
    <>
      <ExpiredScreen />

      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="bg-primary text-white">
          <div className="max-w-2xl mx-auto px-6 py-12 sm:py-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-lg font-bold">C</span>
              </div>
              <span className="text-lg font-semibold tracking-tight opacity-90">
                creoate
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-4 leading-tight">
              Interview Scheduler
            </h1>
            <p className="text-white/80 leading-relaxed max-w-lg">
              It seems the Breezy interview link expired. Rather than create friction
              in the hiring funnel, I built a tiny workaround so the Creoate team can
              book a slot with me directly.
            </p>
            <p className="text-white/50 text-sm mt-4 italic">
              Consider this a small demo of how I approach product problems.
            </p>
          </div>
        </header>

        {/* Main content */}
        <main className="max-w-2xl mx-auto px-6 -mt-6">
          <div className="mb-6">
            <p className="text-sm text-gray-500 mb-1">
              Scheduling a conversation with <strong className="text-gray-700">{ownerName}</strong>
            </p>
            <p className="text-xs text-gray-400">
              30 minute meeting &middot; Select a date and time below
            </p>
          </div>

          <Scheduler />

          <WhyBuildThis />
          <Footer />
        </main>
      </div>
    </>
  );
}
