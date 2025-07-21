"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

import { FoodNutritionAnalyzer } from "../components";

export default function CaloriePage() {
  const [age, setAge] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [activityLevel, setActivityLevel] = useState("sedentary");
  const [calories, setCalories] = useState("");
  const [loading, setLoading] = useState(false);

  const calculateCalories = () => {
    if (!age || !weight || !height || !activityLevel) return;

    setLoading(true);

    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const heightNum = parseFloat(height);

    const bmr = 66 + 13.7 * weightNum + 5 * heightNum - 6.8 * ageNum;

    let multiplier = 1.2; // Sedentary
    switch (activityLevel) {
      case "light":
        multiplier = 1.375;
        break;
      case "moderate":
        multiplier = 1.55;
        break;
      case "active":
        multiplier = 1.725;
        break;
      case "very-active":
        multiplier = 1.9;
        break;
    }

    const totalCalories = Math.round(bmr * multiplier);
    setCalories(totalCalories.toString());
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 text-center">
          <div className="animate-spin h-12 w-12 border-4 border-purple-500 border-t-transparent rounded-full"></div>
          <p className="text-gray-600">Calculating your daily needs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Daily Calorie Calculator
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
              Calculate your daily needs
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-sm">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Daily Calculator
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

              <p className="text-gray-600 mb-8">
                Calculate your daily calorie needs based on your activity level
                and goals.
              </p>

              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Age
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={age}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d{1,3}$/.test(val)) {
                          setAge(val);
                        }
                      }}
                      placeholder="Enter age"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      years
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Weight
                  </label>
                  <div className="relative">
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
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Height
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={height}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "" || /^\d{1,3}$/.test(val)) {
                          setHeight(val);
                        }
                      }}
                      placeholder="Enter height"
                      className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                      cm
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Activity Level
                  </label>
                  <select
                    value={activityLevel}
                    onChange={(e) => setActivityLevel(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="sedentary">
                      Sedentary (little or no exercise)
                    </option>
                    <option value="light">
                      Light exercise (1-3 days/week)
                    </option>
                    <option value="moderate">
                      Moderate exercise (3-5 days/week)
                    </option>
                    <option value="active">
                      Heavy exercise (6-7 days/week)
                    </option>
                    <option value="very-active">
                      Very heavy exercise (twice/day)
                    </option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={calculateCalories}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? "Calculating..." : "Calculate Calories"}
                </button>

                {calories && (
                  <div className="mt-6 p-4 bg-purple-50 rounded-xl">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Your Daily Calorie Needs
                    </h3>
                    <div className="text-2xl font-bold text-purple-600">
                      {calories} kcal/day
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          <FoodNutritionAnalyzer />
        </div>
      </div>
    </div>
  );
}
