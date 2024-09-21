// Calculate Month Stats and Rating Breakdown
export const calculateMonthStats = (feedbackData) => {
  const totalFeedbacks = feedbackData.length;
  const totalRatings = feedbackData.reduce(
    (sum, feedback) => sum + feedback.rating,
    0
  );
  const overall = (totalRatings / totalFeedbacks).toFixed(2);
  const responses = totalFeedbacks; // Total number of responses

  const breakdown = [1, 2, 3, 4, 5].map((star) => {
    const starCount = feedbackData.filter(
      (fb) => Math.floor(fb.rating) === star
    ).length;
    return {
      stars: star,
      percentage: parseFloat(((starCount / totalFeedbacks) * 100).toFixed(2)),
      color:
        star === 5
          ? "green"
          : star === 4
          ? "light-green"
          : star === 3
          ? "yellow"
          : star === 2
          ? "orange"
          : "red",
    };
  });

  return {
    month: totalFeedbacks,
    overall: parseFloat(overall),
    responses,
    ratingBreakdown: {
      average: 20.2,
      breakdown,
    },
  };
};

// Aggregate feedback data by month
export const aggregateByMonth = (feedbackData) => {
  const months = feedbackData.reduce((acc, feedback) => {
    const month = new Date(feedback.feedback_date).toLocaleString("default", {
      month: "long",
    });
    if (!acc[month])
      acc[month] = {
        "5 stars": 0,
        "4 stars": 0,
        "3 stars": 0,
        "2 stars": 0,
        "1 star": 0,
      };
    const star = Math.floor(feedback.rating);
    acc[month][`${star} star${star > 1 ? "s" : ""}`]++;
    return acc;
  }, {});

  return Object.entries(months).map(([month, stars]) => ({ month, ...stars }));
};

// Extract comments from feedback data
export const extractComments = (feedbackData) => {
  return feedbackData.map((fb) => ({
    rating: Math.floor(fb.rating),
    text: fb.comment,
  }));
};

// Group feedback data by window number
export const groupByWindow = (feedbackData) => {
  const windows = feedbackData.reduce((acc, feedback) => {
    const window = feedback.window_no;
    if (!acc[window]) acc[window] = [];
    acc[window].push(feedback);
    return acc;
  }, {});

  return Object.entries(windows).map(([windowName, data]) => ({
    windowName,
    data: aggregateByMonth(data),
  }));
};
export const getTopReviews = (feedbackData) => {
  const reviewCounts = feedbackData.reduce((acc, feedback) => {
    const review = feedback.reviews;
    if (review && review.trim()) {
      acc[review] = (acc[review] || 0) + 1;
    }

    return acc;
  }, {});

  const totalReviews = Object.values(reviewCounts).reduce(
    (sum, count) => sum + count,
    0
  );

  const reviewPercentages = Object.entries(reviewCounts).map(
    ([review, count]) => ({
      review,
      count,
      percentage: ((count / totalReviews) * 100).toFixed(2),
    })
  );

  return reviewPercentages
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);
};
