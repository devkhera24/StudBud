import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RiDeleteBinLine, RiPencilLine } from 'react-icons/ri';

import Button from '../ui/Button.jsx';
import ProgressBar from '../ui/ProgressBar.jsx';
import TopicItem from './TopicItem.jsx';

function computeProgress(topics) {
  const total = topics.length;
  const completed = topics.filter((t) => t.status === 'Completed').length;
  const pct = total ? Math.round((completed / total) * 100) : 0;
  return { total, completed, pct };
}

export default function SubjectCard({
  subject,
  topics,
  onEditSubject,
  onDeleteSubject,
  onAddTopic,
  onEditTopic,
  onDeleteTopic,
  onOpenTopic,
}) {
  const [expanded, setExpanded] = useState(false);

  const { total, pct } = useMemo(() => computeProgress(topics), [topics]);

  return (
    <div className="subject-card">
      <div className="subject-border" style={{ background: subject.color }} aria-hidden="true" />

      <div
        className="subject-header"
        role="button"
        tabIndex={0}
        onClick={() => setExpanded((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setExpanded((v) => !v);
          }
        }}
        aria-expanded={expanded}
      >
        <div className="subject-main">
          <div className="subject-titleRow">
            <div className="subject-title">{subject.name}</div>
            <span className="subject-chip">{total} Topics</span>
          </div>
          {subject.description ? <div className="subject-desc">{subject.description}</div> : null}
        </div>

        <div className="subject-actions" aria-label="Subject actions" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="icon-btn" onClick={() => onEditSubject?.(subject)} aria-label="Edit subject">
            <RiPencilLine />
          </button>
          <button
            type="button"
            className="icon-btn danger"
            onClick={() => onDeleteSubject?.(subject)}
            aria-label="Delete subject"
          >
            <RiDeleteBinLine />
          </button>
        </div>
      </div>

      <div className="subject-progress" aria-label="Subject progress">
        <ProgressBar value={pct} color={subject.color} label="Topics completed" showPercent />
      </div>

      <AnimatePresence initial={false}>
        {expanded ? (
          <motion.div
            className="subject-expand"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="topic-list" onClick={(e) => e.stopPropagation()}>
              {topics.length ? (
                topics.map((t) => (
                  <TopicItem
                    key={t.id}
                    topic={t}
                    onOpen={onOpenTopic}
                    onEdit={onEditTopic}
                    onDelete={onDeleteTopic}
                  />
                ))
              ) : (
                <div className="topic-empty">No topics yet.</div>
              )}

              <div className="topic-addRow">
                <Button size="sm" variant="secondary" onClick={() => onAddTopic?.(subject)}>
                  Add Topic
                </Button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
