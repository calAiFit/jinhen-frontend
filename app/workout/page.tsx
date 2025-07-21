"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

interface ActivityLevel {
  [key: string]: number;
}

interface METValues {
  [key: string]: ActivityLevel;
}

interface WorkoutCategory {
  name: string;
  icon: string;
  description: string;
  benefits: string[];
}

const CATEGORIES: WorkoutCategory[] = [
  {
    name: "Strength Training",
    icon: "💪",
    description: "Build muscle and increase strength",
    benefits: [
      "Build lean muscle mass",
      "Improve bone density",
      "Enhance metabolism",
    ],
  },
  {
    name: "Cardio",
    icon: "🏃",
    description: "Improve cardiovascular health",
    benefits: [
      "Boost heart health",
      "Increase endurance",
      "Burn calories efficiently",
    ],
  },
  {
    name: "Yoga",
    icon: "🧘",
    description: "Flexibility and mind-body connection",
    benefits: ["Improve flexibility", "Reduce stress", "Enhance balance"],
  },
  {
    name: "HIIT",
    icon: "⚡",
    description: "High Intensity Interval Training",
    benefits: [
      "Maximize calorie burn",
      "Improve cardiovascular fitness",
      "Time-efficient workouts",
    ],
  },
];

export default function WorkoutPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [weight, setWeight] = useState("");
  const [duration, setDuration] = useState("");
  const [activityLevel, setActivityLevel] = useState("Light");
  const [caloriesBurned, setCaloriesBurned] = useState("");
  const [loading, setLoading] = useState(false);
  console.log(selectedCategory);

  const MET_VALUES: METValues = {
    Light: {
      Walking: 3.0,
      Yoga: 2.5,
      Stretching: 2.0,
      LightGym: 3.5,
    },
    Moderate: {
      Jogging: 7.0,
      Cycling: 5.5,
      Swimming: 6.0,
      Strength: 6.0,
    },
    Heavy: {
      Running: 10.0,
      HIIT: 12.0,
      HeavyCycling: 14.0,
      HeavyStrength: 8.0,
    },
  };

  const calculateCalories = () => {
    if (!weight || !duration || !activityLevel) return;

    setLoading(true);

    const w = parseFloat(weight);
    const d = parseFloat(duration);

    // Get MET value based on activity level
    const activityLevels = MET_VALUES[activityLevel as keyof METValues];
    const met = Object.values(activityLevels)[0];

    if (typeof met !== "number") {
      setLoading(false);
      return;
    }

    const calories = (met * w * (d / 60)).toFixed(1);

    setCaloriesBurned(calories);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workout Planner</h1>
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
              Plan your perfect workout
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Workout Categories */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Workout Categories
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

              <div className="space-y-6">
                {CATEGORIES.map((category, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    <div className="flex items-center gap-4 mb-2">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-2xl text-purple-600">
                          {category.icon}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {category.name}
                        </h3>
                        <p className="text-gray-600">{category.description}</p>
                      </div>
                    </div>
                    <div className="mt-4 space-y-2">
                      {category.benefits.map((benefit, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-2 text-gray-600"
                        >
                          <svg
                            className="w-4 h-4 text-purple-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span>{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Workout Calculator */}
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">
                Workout Calculator
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Weight (kg)
                  </label>
                  <Input
                    type="text"
                    value={weight}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "" || /^\d{1,3}$/.test(val)) {
                        setWeight(val);
                      }
                    }}
                    placeholder="Enter weight"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    kg
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Duration (minutes)
                  </label>
                  <Input
                    type="number"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 pr-10"
                    placeholder="Enter workout duration"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                    min
                  </span>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="Light">Light</option>
                    <option value="Moderate">Moderate</option>
                    <option value="Heavy">Heavy</option>
                  </select>
                </div>

                <button
                  onClick={calculateCalories}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 px-6 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  )}
                  Calculate Calories Burned
                </button>

                {caloriesBurned && (
                  <div className="mt-6 p-4 rounded-xl bg-purple-50 text-purple-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-semibold">
                          Calories Burned
                        </h3>
                        <p className="text-sm text-purple-600">
                          Based on your weight and activity level
                        </p>
                      </div>
                      <div className="text-2xl font-bold">
                        {caloriesBurned} kcal
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
