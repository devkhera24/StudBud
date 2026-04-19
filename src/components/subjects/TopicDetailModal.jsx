import Modal from '../ui/Modal.jsx';
import Badge from '../ui/Badge.jsx';
import Button from '../ui/Button.jsx';

export default function TopicDetailModal({ open, topic, subject, onClose }) {
  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title={topic?.name ?? 'Topic'}
      size="md"
    >
      <div className="topic-detail">
        <div className="topic-detailMeta">
          {subject?.name ? <Badge label={subject.name} variant="status" /> : null}
          {topic?.difficulty ? <Badge label={topic.difficulty} variant="difficulty" /> : null}
          {topic?.status ? <Badge label={topic.status} variant="status" /> : null}
        </div>

        <div className="topic-detailBlock">
          <div className="topic-detailLabel">Notes</div>
          <div className="topic-detailNotes">{topic?.notes?.trim() ? topic.notes : 'No notes yet.'}</div>
        </div>

        <div className="form-actions">
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
}
