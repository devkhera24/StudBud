import { useMemo, useState } from 'react';

import SubjectCard from '../components/subjects/SubjectCard.jsx';
import SubjectModal from '../components/subjects/SubjectModal.jsx';
import TopicModal from '../components/subjects/TopicModal.jsx';
import TopicDetailModal from '../components/subjects/TopicDetailModal.jsx';
import Button from '../components/ui/Button.jsx';
import EmptyState from '../components/ui/EmptyState.jsx';
import { useStudyContext } from '../context/StudyContext.jsx';

export default function Subjects() {
  const {
    subjects,
    topics,
    addSubject,
    updateSubject,
    deleteSubject,
    addTopic,
    updateTopic,
    deleteTopic,
    addRevision,
  } = useStudyContext();

  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [subjectEditing, setSubjectEditing] = useState(null);

  const [topicModalOpen, setTopicModalOpen] = useState(false);
  const [topicEditing, setTopicEditing] = useState(null);
  const [topicSubjectId, setTopicSubjectId] = useState(null);

  const [topicDetailOpen, setTopicDetailOpen] = useState(false);
  const [topicDetailTopic, setTopicDetailTopic] = useState(null);

  const topicsBySubject = useMemo(() => {
    const map = new Map();
    topics.forEach((t) => {
      const list = map.get(t.subjectId) ?? [];
      list.push(t);
      map.set(t.subjectId, list);
    });
    return map;
  }, [topics]);

  const openAddSubject = () => {
    setSubjectEditing(null);
    setSubjectModalOpen(true);
  };

  const openEditSubject = (subject) => {
    setSubjectEditing(subject);
    setSubjectModalOpen(true);
  };

  const handleSaveSubject = async (values) => {
    if (subjectEditing?.id) {
      updateSubject(subjectEditing.id, values);
      return { ...subjectEditing, ...values };
    }
    return addSubject(values);
  };

  const handleDeleteSubject = (subject) => {
    deleteSubject(subject.id);
  };

  const openAddTopic = (subject) => {
    setTopicEditing(null);
    setTopicSubjectId(subject.id);
    setTopicModalOpen(true);
  };

  const openEditTopic = (topic) => {
    setTopicEditing(topic);
    setTopicSubjectId(topic.subjectId);
    setTopicModalOpen(true);
  };

  const handleSaveTopic = async (values) => {
    if (topicEditing?.id) {
      updateTopic(topicEditing.id, values);
      return { ...topicEditing, ...values };
    }
    return addTopic({ ...values, subjectId: topicSubjectId });
  };

  const handleDeleteTopic = (topic) => {
    deleteTopic(topic.id);
  };

  const openTopicDetail = (topic) => {
    setTopicDetailTopic(topic);
    setTopicDetailOpen(true);
  };

  const detailSubject = useMemo(() => {
    if (!topicDetailTopic) return null;
    return subjects.find((s) => s.id === topicDetailTopic.subjectId) ?? null;
  }, [subjects, topicDetailTopic]);

  return (
    <div className="subjects-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">Subjects</h1>
        </div>
        <Button onClick={openAddSubject}>Add Subject</Button>
      </div>

      {subjects.length ? (
        <div className="subjects-grid">
          {subjects.map((s) => (
            <SubjectCard
              key={s.id}
              subject={s}
              topics={topicsBySubject.get(s.id) ?? []}
              onEditSubject={openEditSubject}
              onDeleteSubject={handleDeleteSubject}
              onAddTopic={openAddTopic}
              onEditTopic={openEditTopic}
              onDeleteTopic={handleDeleteTopic}
              onOpenTopic={openTopicDetail}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No subjects yet"
          description="Create your first subject to start organizing topics and tracking progress."
          actionLabel="Add Subject"
          onAction={openAddSubject}
        />
      )}

      <SubjectModal
        open={subjectModalOpen}
        initialValues={subjectEditing}
        onClose={() => setSubjectModalOpen(false)}
        onSubmit={async (values) => {
          await handleSaveSubject(values);
          setSubjectModalOpen(false);
        }}
      />

      <TopicModal
        open={topicModalOpen}
        subjectId={topicSubjectId}
        initialValues={topicEditing}
        onClose={() => setTopicModalOpen(false)}
        onSubmit={async (values) => {
          const saved = await handleSaveTopic(values);
          setTopicModalOpen(false);
          return saved;
        }}
        onAutoScheduleRevision={({ topicId, subjectId, scheduledFor }) => {
          if (!topicId) return;
          addRevision({ topicId, subjectId, scheduledFor, status: 'Pending' });
        }}
      />

      <TopicDetailModal
        open={topicDetailOpen}
        topic={topicDetailTopic}
        subject={detailSubject}
        onClose={() => setTopicDetailOpen(false)}
      />
    </div>
  );
}
