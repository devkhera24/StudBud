import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { addDays, format } from 'date-fns';
import { toast } from 'react-toastify';

import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

const schema = yup.object({
  name: yup.string().required('Topic name is required').min(2, 'Topic name must be at least 2 characters'),
  difficulty: yup.string().oneOf(['Easy', 'Medium', 'Hard']).required('Difficulty is required'),
  status: yup
    .string()
    .oneOf(['Not Started', 'In Progress', 'Completed', 'Needs Revision'])
    .required('Status is required'),
  notes: yup.string().nullable(),
});

export default function TopicModal({ open, subjectId, initialValues, onClose, onSubmit, onAutoScheduleRevision }) {
  const defaults = useMemo(
    () => ({
      name: initialValues?.name ?? '',
      difficulty: initialValues?.difficulty ?? 'Medium',
      status: initialValues?.status ?? 'Not Started',
      notes: initialValues?.notes ?? '',
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset, open]);

  const handleSave = async (values) => {
    const prevStatus = initialValues?.status;
    const nextStatus = values.status;

    const saved = await onSubmit(values);

    if (nextStatus === 'Completed' && prevStatus !== 'Completed') {
      const scheduledFor = addDays(new Date(), 3).toISOString();
      onAutoScheduleRevision?.({
        topicId: saved?.id ?? initialValues?.id,
        subjectId: saved?.subjectId ?? subjectId ?? initialValues?.subjectId,
        scheduledFor,
      });
      toast.success(`Revision scheduled for ${format(new Date(scheduledFor), 'MMM d')}`);
    }
  };

  return (
    <Modal
      isOpen={open}
      title={initialValues?.id ? 'Edit Topic' : 'Add Topic'}
      size="md"
      onClose={onClose}
    >
      <form className="form" onSubmit={handleSubmit(handleSave)}>
        <div className="form-row">
          <label className="form-label" htmlFor="topic-name">
            Topic Name
          </label>
          <input id="topic-name" className="form-input" placeholder="e.g., Dynamic Programming" {...register('name')} />
          {errors.name ? <div className="form-error">{errors.name.message}</div> : null}
        </div>

        <div className="form-split">
          <div className="form-row">
            <label className="form-label" htmlFor="topic-diff">
              Difficulty
            </label>
            <select id="topic-diff" className="form-select" {...register('difficulty')}>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
            {errors.difficulty ? <div className="form-error">{errors.difficulty.message}</div> : null}
          </div>

          <div className="form-row">
            <label className="form-label" htmlFor="topic-status">
              Status
            </label>
            <select id="topic-status" className="form-select" {...register('status')}>
              <option value="Not Started">Not Started</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="Needs Revision">Needs Revision</option>
            </select>
            {errors.status ? <div className="form-error">{errors.status.message}</div> : null}
          </div>
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="topic-notes">
            Notes
          </label>
          <textarea id="topic-notes" className="form-textarea" rows={5} placeholder="Optional" {...register('notes')} />
          {errors.notes ? <div className="form-error">{errors.notes.message}</div> : null}
        </div>

        <div className="form-actions">
          <Button variant="ghost" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button loading={isSubmitting} type="submit">
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
