// src/Comments.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Comments() {
  const [comments, setComments] = useState([]);
  const [replyText, setReplyText] = useState('');

  useEffect(() => {
    // Update the URL as needed; this should point to your Flask backend endpoint
    axios.get('http://localhost:5000/api/comments?post_url=https://example.com/post/12345')
      .then(response => setComments(response.data))
      .catch(err => console.error(err));
  }, []);

  const handleReply = (commentId) => {
    axios.post('http://localhost:5000/api/reply', {
      commentId: commentId,
      replyText: replyText
    })
    .then(response => {
      alert(response.data.status);
      setReplyText(''); // clear input after sending reply
    })
    .catch(err => console.error(err));
  };

  return (
    <div>
      <h2>Comments Queue</h2>
      {comments.map((comment, index) => (
        <div key={index} style={{borderBottom: '1px solid #eee', padding: '0.5rem 0'}}>
          <p><strong>{comment.author}:</strong> {comment.text}</p>
          <input 
            type="text" 
            placeholder="Type your reply" 
            value={replyText} 
            onChange={(e) => setReplyText(e.target.value)}
            style={{width: '70%', padding: '0.5rem'}}
          />
          <button onClick={() => handleReply(comment.commentId)} style={{marginLeft: '1rem'}}>Reply</button>
        </div>
      ))}
    </div>
  );
}

export default Comments;
