import { BMICalculator } from "./components";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome to NutriAi
          </h1>
          <div className="flex items-center gap-2">
            <svg
              className="w-6 h-6 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="text-sm text-gray-600">
              Your fitness journey starts here
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm">
            <BMICalculator />
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                About NutriAi
              </h2>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
            </div>

            <p className="text-gray-700 mb-8">
              Your one-stop fitness solution for calculating BMI, planning
              workouts, tracking calories, and shopping for fitness gear.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: "📊",
                  title: "Accurate BMI calculations",
                  description:
                    "Get precise BMI analysis and personalized recommendations",
                },
                {
                  icon: "🏋️",
                  title: "Custom workout plans",
                  description:
                    "Tailored workout programs to reach your fitness goals",
                },
                {
                  icon: "🍎",
                  title: "Calorie tracking",
                  description:
                    "Monitor your daily calorie intake and nutrition",
                },
                {
                  icon: "🛍️",
                  title: "Fitness equipment shop",
                  description: "Quality gear for your fitness journey",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50"
                >
                  <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-2xl text-purple-600">
                      {feature.icon}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Home;
