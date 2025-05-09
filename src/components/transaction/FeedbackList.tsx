import React from "react";
import { Feedback } from "../../types/feedback";

interface FeedbackListProps {
  feedbacks: Feedback[];
}

const FeedbackList: React.FC<FeedbackListProps> = ({ feedbacks }) => {
  return (
    <div className="space-y-4">
      {feedbacks.length === 0 ? (
        <p className="text-gray-500 text-center">No feedback available.</p>
      ) : (
        feedbacks.map((feedback) => (
          <div
            key={feedback.id}
            className="flex items-start space-x-4 p-4 bg-gray-100 rounded-lg"
          >
            <div className="flex-shrink-0">
              <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-700 font-medium">
                  {feedback.createdBy.firstName[0]}
                  {feedback.createdBy.lastName[0]}
                </span>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-800">
                  {feedback.createdBy.firstName} {feedback.createdBy.lastName}
                </h3>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={`text-lg ${
                        i < feedback.star ? "text-yellow-400" : "text-gray-300"
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-1">{feedback.comment}</p>
              <p className="text-xs text-gray-500 mt-1">
                {new Date(feedback.createdAt).toLocaleString("en-US", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </p>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default FeedbackList;
