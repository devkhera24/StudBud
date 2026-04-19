import { RiDeleteBinLine, RiPencilLine } from 'react-icons/ri';

import Badge from '../ui/Badge.jsx';

export default function TopicItem({ topic, onOpen, onEdit, onDelete }) {
  return (
    <div className="topic-row">
      <button type="button" className="topic-name" onClick={() => onOpen?.(topic)}>
        {topic.name}
      </button>

      <div className="topic-badges">
        <Badge label={topic.difficulty} variant="difficulty" />
        <Badge label={topic.status} variant="status" />
      </div>

      <div className="topic-actions" aria-label="Topic actions">
        <button type="button" className="icon-btn" onClick={() => onEdit?.(topic)} aria-label="Edit topic">
          <RiPencilLine />
        </button>
        <button type="button" className="icon-btn danger" onClick={() => onDelete?.(topic)} aria-label="Delete topic">
          <RiDeleteBinLine />
        </button>
      </div>
    </div>
  );
}
