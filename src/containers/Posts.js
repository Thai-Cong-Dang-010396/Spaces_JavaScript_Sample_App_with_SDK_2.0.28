import React, { useEffect } from 'react';
import { Button } from 'react-bootstrap';
import { connect } from 'react-redux';
import Post from '../components/Post';
import { toggleModalPostCreate } from '../redux/actions/spaceActions';

const mapStateToProps = (state) => ({
  spacePosts: state.data.spacePosts,
  me: state.data.me
});

function Posts(props) {
  useEffect(() => {}, [props.spacePosts, props.me]);

  return (
    <div className="posts-container">
      <Button onClick={() => props.toggleModalPostCreate(true)}>+ New Post</Button>
      <div className="log">
        {props.spacePosts &&
          props.spacePosts.map((post, idx) => (
            <Post post={post} key={idx} editable={post.sender._id === props.me._id} />
          ))}
      </div>
    </div>
  );
}

export default connect(mapStateToProps, { toggleModalPostCreate })(Posts);
