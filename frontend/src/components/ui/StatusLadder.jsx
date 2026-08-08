const STAGES = ['TODO', 'IN_PROGRESS', 'SUBMITTED', 'REVISION_REQUIRED', 'COMPLETED'];
const STAGE_LABELS = ['To Do', 'In Progress', 'Submitted', 'Revision', 'Done'];

// Signature element: renders the five real task stages as a filled ladder,
// so the order itself communicates workflow progress at a glance.
export default function StatusLadder({ status }) {
  const activeIndex = STAGES.indexOf(status);
  const effectiveIndex = status === 'REVISION_REQUIRED' ? 3 : activeIndex;

  return (
    <div>
      <div className="status-ladder">
        {STAGES.map((stage, i) => {
          let filled = i <= effectiveIndex;
          let extra = '';
          if (status === 'REVISION_REQUIRED' && i === 3) extra = 'revision';
          if (status === 'COMPLETED' && i === 4) extra = 'done';
          return <div key={stage} className={`status-ladder-step ${filled ? 'filled' : ''} ${extra}`} />;
        })}
      </div>
      <div className="status-ladder-labels">
        {STAGE_LABELS.map((l) => <span key={l}>{l}</span>)}
      </div>
    </div>
  );
}
