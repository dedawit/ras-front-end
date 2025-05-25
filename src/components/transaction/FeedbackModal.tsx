import React, { useState } from "react";
import { CreateFeedbackData } from "../../types/feedback";

interface FeedbackModalProps {
  transactionId: string;
  userId: string;
  onClose: () => void;
  onSubmit: (feedback: CreateFeedbackData) => Promise<void>;
}

const FeedbackModal: React.FC<FeedbackModalProps> = ({
  transactionId,
  userId,
  onClose,
  onSubmit,
}) => {
  const [comment, setComment] = useState("");
  const [star, setStar] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{
    rating?: string;
    comment?: string;
    submit?: string;
  }>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors

    // Validate inputs
    let newErrors: { rating?: string; comment?: string } = {};
    if (!comment.trim()) {
      newErrors.comment = "Please provide a valid comment.";
    }
    if (star < 1 || star > 5) {
      newErrors.rating = "Please select a star rating (1-5).";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({ transactionId, createdBy: userId, comment, star });
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to submit feedback. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = () => {
    return [1, 2, 3, 4, 5].map((value) => (
      <button
        key={value}
        type="button"
        onClick={() => setStar(value)}
        className={`text-2xl ${
          value <= star ? "text-yellow-400" : "text-gray-300"
        }`}
      >
        ★
      </button>
    ));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-primary-color mb-4">
          Add Feedback
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rating
            </label>
            <div className="flex space-x-2">{renderStars()}</div>
            {errors.rating && (
              <p className="text-red-500 text-sm mt-1">{errors.rating}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Comment
            </label>
            <textarea
              className="p-2 border rounded-md w-full h-24"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Enter your feedback..."
            />
            {errors.comment && (
              <p className="text-red-500 text-sm mt-1">{errors.comment}</p>
            )}
          </div>
          {errors.submit && (
            <p className="text-red-500 text-sm mb-4">{errors.submit}</p>
          )}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="p-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="p-2 bg-primary-color text-white rounded-md hover:bg-blue-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FeedbackModal;
