import Modal from '../common/Modal'

/** Step 2 of the submission flow: the final, deliberate confirmation. */
export default function ConfirmSubmitDialog({ assignment, onCancel, onConfirm }) {
  return (
    <Modal
      title="Confirm your submission"
      description={`You're about to mark "${assignment.title}" as submitted. You can't undo this.`}
      onClose={onCancel}
      footer={
        <>
          <button className="btn-secondary" onClick={onCancel} data-autofocus>Go back</button>
          <button className="btn-primary" onClick={onConfirm}>Confirm submission</button>
        </>
      }
    >
      <p className="text-sm text-slate-700 dark:text-slate-300">
        Only confirm if you have uploaded your work to the Drive link for this assignment.
      </p>
    </Modal>
  )
}
