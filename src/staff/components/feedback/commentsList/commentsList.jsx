import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';
import './commentsList.scss';

const CommentsList = ({ comments }) => {
    const getStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) {
                stars.push(<FontAwesomeIcon icon={faStar} key={i} />);
            } else {
                stars.push(<FontAwesomeIcon icon={faStarOutline} key={i} />);
            }
        }
        return stars;
    };

    return (
        <div className="comments-list-card">
            <div className="comments-list-body">
                <h2 className="comments-title">User Feedback</h2>
                <div className="comments-grid">
                    {comments.map((comment, index) => (
                        <div className="comment-card" key={index}>
                            <div className="comment-stars">
                                {getStars(comment.rating)}
                            </div>
                            <div className="comment-text">{comment.text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

CommentsList.propTypes = {
    comments: PropTypes.arrayOf(
        PropTypes.shape({
            rating: PropTypes.number.isRequired,
            text: PropTypes.string.isRequired,
        })
    ).isRequired,
};

export default CommentsList;
