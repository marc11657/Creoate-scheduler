export default function WhyBuildThis() {
  const reasons = [
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Removing friction from user journeys",
      description: "The booking link was broken. Instead of waiting, I fixed the flow.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      title: "Rapid experimentation",
      description: "Built and shipped in hours, not days. Speed matters in product.",
    },
    {
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      title: "Shipping simple solutions fast",
      description: "No over-engineering. Just what's needed to solve the problem.",
    },
  ];

  return (
    <section className="mt-16 pt-12 border-t border-gray-100">
      <h2 className="text-lg font-semibold text-gray-800 mb-6 text-center">
        Why build this?
      </h2>
      <div className="grid gap-6 sm:grid-cols-3">
        {reasons.map((reason) => (
          <div
            key={reason.title}
            className="flex flex-col items-center text-center p-4"
          >
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-3">
              {reason.icon}
            </div>
            <h3 className="text-sm font-semibold text-gray-800 mb-1">
              {reason.title}
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              {reason.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
