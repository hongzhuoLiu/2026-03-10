import React from 'react';


function RefineResultsPanel({ isMobile = false, selectedFilters = [], toggleFilter, filterCounts = {} }) {
const filterTypes = [
{ key: 'university', label: 'Universities' },
{ key: 'program', label: 'Programs' },
{ key: 'subject', label: 'Subjects' },
{ key: 'review', label: 'Reviews' },
{ key: 'blog', label: 'Blogs' },
{ key: 'qna', label: 'Q&A' },
{ key: 'destination', label: 'Destinations' },
{ key: 'helpful-links', label: 'Helpful Links' },
];


const handleToggle = (key) => typeof toggleFilter === 'function' && toggleFilter(key);


return (
<div className={isMobile ? 'refine-results-mobile' : 'refine-results-desktop'}
style={{ padding: 20, background: 'var(--card-bg)', borderRadius: 12, border: '1px solid var(--card-border)', maxWidth: 260 }}>
<style>{`
.rf-title { font-size:20px; font-weight:700; color: var(--fg); margin:0 0 12px 0; }
.rf-item { display:flex; align-items:center; gap:10px; cursor:pointer; font-weight:700; color: var(--fg); user-select:none; }
.rf-count { color: var(--muted); font-weight:600; }
.rf-checkbox { width:18px; height:18px; accent-color: var(--brand); cursor:pointer; }
`}</style>


<h3 className="rf-title" style={{ borderLeft: '4px solid var(--brand)', paddingLeft: 8 }}>Refine Results</h3>


<div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
{filterTypes.map(({ key, label }) => {
const isChecked = selectedFilters.includes(key);
const count = filterCounts[key] || 0;
return (
<label key={key} className="rf-item">
<input className="rf-checkbox" type="checkbox" checked={isChecked} onChange={() => handleToggle(key)} />
<span>{label} <span className="rf-count">({count})</span></span>
</label>
);
})}
</div>
</div>
);

}


export default RefineResultsPanel;