import React from "react";

interface Review {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
}

interface Props {
  reviews: Review[];
}

const RiderReviews = ({ reviews }: Props) => {
  return (
    <div className="bg-white rounded-3xl shadow-lg p-8 mt-10">
      <h2 className="text-3xl font-black mb-8">Rider Reviews</h2>
      {reviews.length > 0 ? (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review.id} className="border border-slate-200 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-yellow-500 text-2xl">⭐</span>
                <span className="font-bold text-xl">{review.rating}/5</span>
              </div>
              <p className="text-slate-600">{review.comment}</p>
              <p className="text-sm text-slate-400 mt-3">{new Date(review.created_at).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No reviews yet</p>
      )}
    </div>
  );
};

export default RiderReviews;
