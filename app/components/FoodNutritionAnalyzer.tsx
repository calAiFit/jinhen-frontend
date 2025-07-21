"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";

interface NutritionData {
  food_name: string;
  nf_calories: number;
  nf_protein: number;
  nf_total_fat: number;
  nf_total_carbohydrate: number;
  serving_qty: number;
  serving_unit: string;
  serving_weight_grams: number;
}

export const FoodNutritionAnalyzer = () => {
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [detectedFood, setDetectedFood] = useState<string>("");
  console.log(detectedFood);

  const [foodSearch, setFoodSearch] = useState<string>("");
  const [nutrition, setNutrition] = useState<NutritionData | null>(null);
  const [grams, setGrams] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") resolve(reader.result);
        else reject(new Error("Failed to read file"));
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }

  async function classifyImage(imageBase64: string): Promise<string> {
    const response = await fetch("/api/classify-image", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageBase64 }),
    });

    if (!response.ok) throw new Error("Classification failed");
    const data = await response.json();
    return data.label;
  }

  async function fetchNutrition(foodName: string): Promise<NutritionData> {
    const response = await fetch("/api/nutrition", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ foodName, grams }),
    });

    if (!response.ok) throw new Error("Nutrition fetch failed");
    const data = await response.json();
    return data.nutrition;
  }

  const handleImageAnalyze = async () => {
    if (!imageBase64) return;
    try {
      const label = await classifyImage(imageBase64);
      setDetectedFood(label);
      const nutri = await fetchNutrition(label);
      setNutrition(nutri);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Unexpected error");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setImageBase64(base64);
  };

  const handleFoodSearch = async () => {
    try {
      const nutri = await fetchNutrition(foodSearch);
      setNutrition(nutri);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Food not found");
      }
    } finally {
      setSearchLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm">
      <div className="flex flex-col items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">
          Food Nutrition Analyzer
        </h2>
        <p className="text-sm text-gray-500 text-center">
          Analyze food nutrition using image upload or search
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="flex flex-col items-center justify-center w-full h-24 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center pt-3 pb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-1 text-sm text-gray-500">
                <span className="font-medium text-gray-700">
                  Click to upload
                </span>{" "}
                or drag and drop
              </p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>

          {imageBase64 && (
            <div className="relative w-full h-48 mt-4">
              <img
                src={imageBase64}
                alt="Selected"
                className="object-contain w-full h-full rounded-xl"
              />
              <button
                onClick={() => setImageBase64(null)}
                className="absolute -top-2 -right-2 bg-gray-50 text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          )}

          <div className="mt-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Grams:
            </label>
            <Input
              type="number"
              min={1}
              value={grams}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || (/^\d{1,3}$/.test(val) && Number(val) >= 1)) {
                  setGrams(Number(val));
                }
              }}
              className="w-24 px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          <button
            disabled={loading || !imageBase64}
            onClick={handleImageAnalyze}
            className="w-full mt-4 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        <div>
          <div className="relative">
            <input
              type="text"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="Search food..."
              className="w-full px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button
                disabled={searchLoading}
                onClick={handleFoodSearch}
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-2 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {searchLoading && (
            <div className="mt-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 p-2 rounded-lg bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}

      {nutrition && (
        <div className="mt-3 bg-purple-50 p-3 rounded-xl">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-600">Calories:</p>
              <p className="text-gray-900 font-medium">
                {nutrition?.nf_calories || 0} kcal
              </p>
            </div>
            <div>
              <p className="text-gray-600">Protein:</p>
              <p className="text-gray-900 font-medium">
                {nutrition?.nf_protein || 0} g
              </p>
            </div>
            <div>
              <p className="text-gray-600">Fat:</p>
              <p className="text-gray-900 font-medium">
                {nutrition?.nf_total_fat || 0} g
              </p>
            </div>
            <div>
              <p className="text-gray-600">Carbs:</p>
              <p className="text-gray-900 font-medium">
                {nutrition?.nf_total_carbohydrate || 0} g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
