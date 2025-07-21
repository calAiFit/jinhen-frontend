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
    setLoading(true);
    setError(null);
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
    setSearchLoading(true);
    setError(null);
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
    <div className="bg-white rounded-2xl p-8 shadow-md max-w-3xl mx-auto mt-10">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">
          Food Nutrition Analyzer
        </h2>
        <p className="text-gray-500 mt-1">
          Analyze food nutrition using image upload or text search.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Upload Image Section */}
        <div>
          <label className="flex flex-col items-center justify-center w-full h-28 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:bg-gray-100 transition-colors">
            <div className="flex flex-col items-center justify-center py-3">
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
              <p className="text-sm text-gray-600">
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
            <div className="relative w-full h-64 mt-4">
              <img
                src={imageBase64}
                alt="Selected"
                className="object-contain w-full h-full rounded-xl"
              />
              <button
                onClick={() => setImageBase64(null)}
                className="absolute -top-2 -right-2 bg-white text-gray-700 rounded-full p-1 hover:bg-gray-100 transition-colors shadow"
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

          {/* Grams input */}
          <div className="mt-4 flex items-center gap-4">
            <label className="text-sm font-medium text-gray-700">Grams:</label>
            <Input
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={grams}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || (/^\d{1,3}$/.test(val) && Number(val) >= 1)) {
                  setGrams(Number(val));
                }
              }}
              className="w-28 px-3 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
          </div>

          {/* Analyze button */}
          <button
            disabled={loading || !imageBase64}
            onClick={handleImageAnalyze}
            className="w-full mt-4 py-2 px-4 bg-purple-600 hover:bg-purple-700 text-white text-sm font-medium rounded-xl disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Analyzing..." : "Analyze Image"}
          </button>
        </div>

        {/* Search Section */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-700">
            Search food manually:
          </label>
          <div className="relative">
            <input
              type="text"
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              placeholder="Search food..."
              className="w-full px-4 py-2 rounded-xl bg-white border border-gray-300 text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            />
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <button
                disabled={searchLoading}
                onClick={handleFoodSearch}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
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
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600 mx-auto"></div>
            </div>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mt-4 p-3 rounded-lg bg-red-100 text-red-700 text-sm text-center">
          {error}
        </div>
      )}

      {/* Nutrition Result */}
      {nutrition && (
        <div className="mt-6 bg-purple-50 p-4 rounded-xl">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            Nutrition Facts ({grams}g)
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
            <div>
              <p>Calories:</p>
              <p className="font-medium">{nutrition.nf_calories || 0} kcal</p>
            </div>
            <div>
              <p>Protein:</p>
              <p className="font-medium">{nutrition.nf_protein || 0} g</p>
            </div>
            <div>
              <p>Fat:</p>
              <p className="font-medium">{nutrition.nf_total_fat || 0} g</p>
            </div>
            <div>
              <p>Carbohydrates:</p>
              <p className="font-medium">
                {nutrition.nf_total_carbohydrate || 0} g
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
