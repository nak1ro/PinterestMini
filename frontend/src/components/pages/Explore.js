import React from 'react';
import { motion } from 'framer-motion';
import { usePopularTags, usePinsByTag } from '../../hooks/useTags';
import PinGrid from '../pin/PinGrid';
import { Link } from 'react-router-dom';

const Explore = () => {
  const { tags, loading, error } = usePopularTags(5);

  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (error) return <div className="text-center mt-5 text-danger">Error loading tags</div>;

  return (
      <motion.div
          className="container py-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
      >
        <h1 className="text-center fw-bold mb-5" style={{ fontSize: '2rem' }}>Explore</h1>

        <div className="mt-4">
          {tags.map(tag => (
              <TagSection key={tag} tag={tag} />
          ))}
        </div>
      </motion.div>
  );
};

const TagSection = ({ tag }) => {
  const { pins, loading, error } = usePinsByTag(tag);

  if (loading || error || pins.length === 0) return null;

  return (
      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3 px-3">
          <h2 className="fw-semibold mb-0" style={{ fontSize: '1.5rem' }}>
            {tag.charAt(0).toUpperCase() + tag.slice(1)}
          </h2>
          <Link to={`/tag/${encodeURIComponent(tag)}`} className="btn btn-outline-primary btn-sm">
            View all
          </Link>
        </div>
        <PinGrid pins={pins.slice(0, 4)} />
      </div>
  );
};

export default Explore;
