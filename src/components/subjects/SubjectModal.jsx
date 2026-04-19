import { useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import Modal from '../ui/Modal.jsx';
import Button from '../ui/Button.jsx';

const COLOR_SWATCHES = [
  '#F5A623',
  'rgba(245, 166, 35, 0.75)',
  '#6B8F71',
  'rgba(107, 143, 113, 0.8)',
  '#7B9CCC',
  'rgba(123, 156, 204, 0.85)',
  '#D4A017',
  '#E05C5C',
];

const schema = yup.object({
  name: yup.string().required('Subject name is required').min(2, 'Subject name must be at least 2 characters'),
  description: yup.string().nullable(),
  color: yup.string().required('Color is required'),
});

export default function SubjectModal({ open, initialValues, onClose, onSubmit }) {
  const defaults = useMemo(
    () => ({
      name: initialValues?.name ?? '',
      description: initialValues?.description ?? '',
      color: initialValues?.color ?? COLOR_SWATCHES[0],
    }),
    [initialValues]
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: defaults,
  });

  useEffect(() => {
    reset(defaults);
  }, [defaults, reset, open]);

  const selected = watch('color');

  return (
    <Modal
      isOpen={open}
      title={initialValues?.id ? 'Edit Subject' : 'Add Subject'}
      size="sm"
      onClose={onClose}
    >
      <form className="form" onSubmit={handleSubmit(onSubmit)}>
        <div className="form-row">
          <label className="form-label" htmlFor="subject-name">
            Subject Name
          </label>
          <input id="subject-name" className="form-input" placeholder="e.g., Algorithms" {...register('name')} />
          {errors.name ? <div className="form-error">{errors.name.message}</div> : null}
        </div>

        <div className="form-row">
          <label className="form-label" htmlFor="subject-desc">
            Description
          </label>
          <textarea
            id="subject-desc"
            className="form-textarea"
            rows={3}
            placeholder="Optional"
            {...register('description')}
          />
          {errors.description ? <div className="form-error">{errors.description.message}</div> : null}
        </div>

        <div className="form-row">
          <div className="form-label">Color</div>
          <input type="hidden" {...register('color')} />
          <div className="swatches" role="radiogroup" aria-label="Choose color">
            {COLOR_SWATCHES.map((c) => (
              <button
                key={c}
                type="button"
                className={['swatch', selected === c ? 'is-selected' : ''].join(' ')}
                style={{ background: c }}
                onClick={() => setValue('color', c, { shouldValidate: true, shouldDirty: true })}
                aria-label={`Select color ${c}`}
                aria-checked={selected === c}
                role="radio"
              />
            ))}
          </div>
          {errors.color ? <div className="form-error">{errors.color.message}</div> : null}
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
