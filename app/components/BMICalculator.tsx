"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { motion } from "framer-motion";

export const BMICalculator = () => {
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [bmi, setBMI] = useState("");
  const [bmiCategory, setBMICategory] = useState("");
  const [showResults, setShowResults] = useState(false);
  const calculateBMI = () => {
    if (!weight || !height) return;
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    const bmiNumber = w / (h * h);
    const bmiValue = bmiNumber.toFixed(1);
    setBMI(bmiValue);
    setShowResults(true);

    if (bmiNumber < 18.5) setBMICategory("Underweight");
    else if (bmiNumber < 25) setBMICategory("Normal weight");
    else if (bmiNumber < 30) setBMICategory("Overweight");
    else setBMICategory("Obese");
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <Card className="p-8 rounded-2xl shadow-lg bg-white">
        <h1 className="text-4xl font-bold text-purple-700 mb-8 text-center">
          BMI Calculator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <label className="text-sm text-gray-600">Weight (kg)</label>
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
          </div>
          <div className="space-y-4">
            <label className="text-sm text-gray-600">Height (cm)</label>
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
          </div>
          <div className="space-y-4">
            <label className="text-sm text-gray-600">Age</label>
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
          </div>
          <div className="space-y-4">
            <label className="text-sm text-gray-600">Gender</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            onClick={calculateBMI}
            className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl px-8 py-3 font-semibold transition-all duration-300"
          >
            Calculate BMI
          </Button>
          {showResults && (
            <Button
              onClick={() => {
                setWeight("");
                setHeight("");
                setAge("");
                setGender("");
                setBMI("");
                setBMICategory("");
                setShowResults(false);
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl px-8 py-3 font-semibold transition-all duration-300"
            >
              Reset
            </Button>
          )}
        </div>

        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-10"
          >
            <Card className="p-6 rounded-xl bg-white border border-gray-200">
              <div className="flex flex-col items-center text-center">
                <h2 className="text-4xl font-bold text-purple-700 mb-4">
                  {bmi}
                </h2>
                <p className="text-xl text-gray-700 mb-6">{bmiCategory}</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <motion.div
                    className="bg-purple-600 h-2.5 rounded-full"
                    style={{
                      width: `${(parseFloat(bmi) / 40) * 100}%`,
                    }}
                    transition={{
                      duration: 1,
                      ease: "easeOut",
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>18.5</span>
                  <span>25</span>
                  <span>30</span>
                  <span>40</span>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl bg-white border border-gray-200 mt-6">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                BMI Categories
              </h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Underweight (18.5 or less)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Normal weight (18.5 - 24.9)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Overweight (25 - 29.9)
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                  <span className="text-sm text-gray-600">
                    Obese (30 or more)
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </Card>
    </div>
  );
};
