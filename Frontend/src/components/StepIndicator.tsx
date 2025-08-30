import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  title: string;
  isCompleted: boolean;
  isActive: boolean;
}

interface StepIndicatorProps {
  steps: Step[];
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps }) => {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200 z-0">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500 ease-in-out"
            style={{ 
              width: `${(steps.filter(s => s.isCompleted).length / (steps.length - 1)) * 100}%` 
            }}
          />
        </div>
        
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center relative z-10">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 transform ${
                step.isCompleted
                  ? 'bg-gradient-to-r from-green-500 to-green-600 text-white scale-110 shadow-lg'
                  : step.isActive
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white scale-110 shadow-lg'
                  : 'bg-white border-2 border-gray-300 text-gray-500'
              }`}
            >
              {step.isCompleted ? (
                <Check className="w-6 h-6" />
              ) : (
                <span className="font-bold">{step.id}</span>
              )}
            </div>
            <div className="mt-3 text-center">
              <p className={`text-sm font-medium ${
                step.isActive ? 'text-blue-600' : step.isCompleted ? 'text-green-600' : 'text-gray-500'
              }`}>
                {step.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;