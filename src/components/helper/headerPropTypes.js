import PropTypes from "prop-types";

export default {
  month: PropTypes.string.isRequired,
  overall: PropTypes.number.isRequired,
  responses: PropTypes.number.isRequired,
  ratingBreakdown: PropTypes.shape({
    average: PropTypes.number.isRequired,
    breakdown: PropTypes.arrayOf(
      PropTypes.shape({
        stars: PropTypes.number.isRequired,
        percentage: PropTypes.number.isRequired,
        count: PropTypes.number.isRequired,
      })
    ).isRequired,
  }).isRequired,
  comments: PropTypes.arrayOf(
    PropTypes.shape({
      rating: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
    })
  ),
  reviews: PropTypes.objectOf(PropTypes.number),
  ratingsOverTime: PropTypes.arrayOf(
    PropTypes.shape({
      date: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
    })
  ),
  ratingsPerWindow: PropTypes.objectOf(PropTypes.number),
};
