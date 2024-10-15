import React from 'react';
import './PageNotFound.css';
import { useLocation, Link } from 'react-router-dom';

const PageNotFound = () => {
  const location = useLocation();
  return (
    <div className="PageNotFoundWrapper">
      <h1>404 | Page Not Found</h1>
      <p>Oops ... something went wrong</p>
      <p className="code">
        The route <code>{location.pathname}</code> doesn't exist.
      </p>
      <Link to="/">Go Back Home</Link>
    </div>
  );
};

export default PageNotFound;
