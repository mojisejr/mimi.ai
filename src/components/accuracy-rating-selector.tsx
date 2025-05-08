"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { FaPercent } from "react-icons/fa";

interface AccuracyRatingSelectorProps {
  value: number; // 1-5
  onChange: (value: number) => void;
  id?: string;
  label?: string;
}

/**
 * AccuracyRatingSelector - A sliding component for rating tarot prediction accuracy
 *
 * @param value - Current rating value (1-5)
 * @param onChange - Callback function when rating changes
 * @param id - Optional ID for the range element
 * @param label - Optional label text
 */
export default function AccuracyRatingSelector({
  value,
  onChange,
  id = "accuracy-rating",
  label = "ความแม่นยำในการทำนาย",
}: AccuracyRatingSelectorProps) {
  // Map numeric values (1-5) to percentage strings
  const percentageMap = {
    1: "0 %",
    2: "20 %",
    3: "50 %",
    4: "80 %",
    5: "100 %",
  };

  // State to track if the component has mounted (for SSR compatibility)
  const [mounted, setMounted] = useState(false);

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle slider change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number.parseInt(e.target.value, 10);
    onChange(newValue);
  };

  // Get color based on value
  const getColor = (value: number) => {
    switch (value) {
      case 1:
        return "from-red-500 to-red-400";
      case 2:
        return "from-orange-500 to-orange-400";
      case 3:
        return "from-yellow-500 to-yellow-400";
      case 4:
        return "from-green-500 to-green-400";
      case 5:
        return "from-emerald-500 to-emerald-400";
      default:
        return "from-gray-500 to-gray-400";
    }
  };

  // Don't render anything until mounted (prevents hydration mismatch)
  if (!mounted) return null;

  return (
    <div className="form-control w-full max-w-xs">
      {/* Accessible label */}
      {label && (
        <label htmlFor={id} className="label">
          <span className="label-text">{label}</span>
        </label>
      )}

      {/* Current percentage display */}
      <div className="flex items-center justify-center mb-2 text-lg font-medium text-primary">
        <span className="text-2xl">
          {percentageMap[value as keyof typeof percentageMap]}
        </span>
      </div>

      {/* Slider container */}
      <div className="w-full px-1">
        {/* Range input slider */}
        <input
          type="range"
          id={id}
          min="1"
          max="5"
          step="1"
          value={value}
          onChange={handleChange}
          className={`range w-full bg-gradient-to-r ${getColor(value)}`}
          style={{
            backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
            height: "1.5rem",
            borderRadius: "0.5rem",
            WebkitAppearance: "none",
            appearance: "none",
          }}
          aria-valuemin={1}
          aria-valuemax={5}
          aria-valuenow={value}
          aria-valuetext={percentageMap[value as keyof typeof percentageMap]}
        />

        {/* Step markers with percentages */}
        <div className="w-full flex justify-between text-xs px-1 mt-1">
          {Object.values(percentageMap).map((percentage, index) => (
            <span
              key={index}
              className={`${
                value === index + 1
                  ? "text-primary font-medium"
                  : "text-base-content/70"
              }`}
            >
              {percentage}
            </span>
          ))}
        </div>
      </div>

      {/* Visually hidden text for screen readers */}
      <span className="sr-only">
        การเลือกปัจจุบัน: {percentageMap[value as keyof typeof percentageMap]}
      </span>
    </div>
  );
}
