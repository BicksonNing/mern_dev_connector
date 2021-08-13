import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { removeComment } from '../../actions/postAction';
import Moment from 'react-moment';

const CommentItem = ({
  removeComment,
  postId,
  auth,
  comment: { _id, text, name, avatar, user, date },
}) => {
  return (
    <div className='post bg-white p-1 my-1'>
      <div>
        <Link to={`/profile/${user}`}>
          <img className='round-img' src={avatar} alt='' />
          <h4>{name}</h4>
        </Link>
      </div>
      <div>
        <p className='my-1'>{text}</p>
        <p className='post-date'>
          Posted on <Moment format='d MMM yyyy'>{date}</Moment>
        </p>
        {!auth.isLoading && user === auth.user._id && (
          <button
            type='button'
            class='btn btn-danger'
            onClick={(e) => removeComment(postId, _id)}
          >
            <i class='fas fa-times'></i>
          </button>
        )}
      </div>
    </div>
  );
};

CommentItem.propTypes = {
  postId: PropTypes.number.isRequired,
  comment: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  removeComment: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.authReducer,
});

export default connect(mapStateToProps, { removeComment })(CommentItem);
