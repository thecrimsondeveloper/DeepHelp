// src/Analytics.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    // Update the URL as needed; this should point to your Flask backend endpoint
    axios.get('http://localhost:5000/api/analytics?target_url=https://example.com/analytics')
      .then(response => setData(response.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Analytics Data</h2>
      {data.map((post, index) => (
        <div key={index} style={{border: '1px solid #ccc', padding: '1rem', margin: '1rem 0'}}>
          <h3>{post.title}</h3>
          <p>Views: {post.views}</p>
          <p>Likes: {post.likes}</p>
          <p>Comments: {post.comments}</p>
        </div>
      ))}
    </div>
  );
}

export default Analytics;
