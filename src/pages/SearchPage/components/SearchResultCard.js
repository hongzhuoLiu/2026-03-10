// SearchResultCard.jsx — dark/light colors aligned with Home, no inline hard-coded colors
import React from "react";
import { useNavigate } from "react-router-dom";
import CommentText from "./CardText";
import LogoTile from "../../../components/Common/LogoTile";

// Shared CSS variables (kept minimal, matches Home / Tailwind palette)
// Light uses gray-100/200/900; Dark uses gray-700/600/200
// Brand stays Students Choice maroon
const Styles = () => (
  <style>{`
    :root {
      --bg: #ffffff;           /* bg-white */
      --fg: #111827;           /* gray-900 */
      --card-bg: #ffffff;      /* card background */
      --card-border: #e5e7eb;  /* gray-200 */
      --muted: #6b7280;        /* gray-500 */
      --chip-bg: #f3f4f6;      /* gray-100 */
      --chip-fg: #111827;      /* gray-900 */
      --track: #e5e7eb;        /* donut track */
      --brand: #7A0019;        /* Students Choice maroon */
    }
    :root.dark {
      --bg: #111827;           /* gray-900 */
      --fg: #e5e7eb;           /* gray-200 */
      --card-bg: #4b5563;      /* gray-600 */
      --card-border: #374151;  /* gray-700 */
      --muted: #9ca3af;        /* gray-400 */
      --chip-bg: #374151;      /* gray-700 */
      --chip-fg: #e5e7eb;      /* gray-200 */
      --track: #374151;        /* donut track */
    }

    .sr-card {
      padding: 20px;
      border: 1px solid var(--card-border);
      border-radius: 16px;
      background: var(--card-bg);
      box-shadow: none;
      cursor: pointer;
      transition: transform .2s ease, box-shadow .2s ease;
    }
    .sr-card:hover { box-shadow: 0 4px 10px rgba(0,0,0,.12); transform: translateY(-2px); }
    .sr-title { font-size: 22px; font-weight: 700; color: var(--fg); margin: 0; }
    .sr-subtle { font-size: 14px; color: var(--muted); }
    .sr-chip { padding: 6px 12px; border-radius: 999px; font-size: 13px; background: var(--chip-bg); color: var(--chip-fg); }
    .sr-tag { padding: 4px 8px; border-radius: 6px; font-size: 13px; background: var(--chip-bg); color: var(--chip-fg); }
    .sr-divider { border-bottom: 1px solid var(--card-border); }
    .sr-typepill { display:flex; align-items:center; gap:8px; background: var(--card-bg); border:1px solid var(--card-border); padding:4px 10px; border-radius:16px; font-weight:700; color: var(--fg); }
    .sr-rating-ring { position: relative; width: 60px; height: 60px; border-radius: 999px; background: conic-gradient(var(--brand) var(--pct), var(--track) 0%); }
    .sr-rating-center { position:absolute; inset: 7.5px; display:flex; align-items:center; justify-content:center; border-radius:999px; background: var(--card-bg); color: var(--fg); font-weight:700; font-size:14px; }
    .sr-rating-note { font-size:12px; color: var(--muted); text-align:center; margin: 6px 0 0 0; white-space:nowrap; }
    .sr-logo { width: 100px; height: 50px; object-fit: contain; background: var(--card-bg); border: 1px solid var(--card-border); border-radius: 8px; }
  `}</style>
);

const SearchResultCard = ({ item }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    if (e.target.closest('.read-more-button')) return;
    const card = document.querySelector(`[data-id="${item.id}"]`);
    if (card) card.style.opacity = '0.85';

    switch (item.type) {
      case 'university': navigate(`/universities/${item.id}`); break;
      case 'program': navigate(`/universities/${item.universityId}/program/${item.id}`); break;
      case 'post':
        if (item.universityId) navigate(`/universities/${item.universityId}`);
        else {
          if (item.postType === 'review') navigate(`/review/${item.id}`);
          else if (item.postType === 'blog') navigate(`/blog/${item.id}`);
          else if (item.postType === 'qna') navigate(`/qna/${item.id}`);
        }

        break;
      case 'destination': navigate(`/destination/${item.id}`); break;
      case 'helpful-links': navigate(`/facility/${item.id}`); break;
      default: break;
    }
  };

  // Helper to render rating donut with CSS variables for colors
  const Rating = ({ value, note }) => (
    <div style={{ minWidth: 90, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <div className="sr-rating-ring" style={{ ['--pct']: `${Number(value) * 20}%` }}>
        <div className="sr-rating-center">{Number(value).toFixed(1)}</div>
      </div>
      {note && <p className="sr-rating-note">{note}</p>}
    </div>
  );

  // UNIVERSITY
  if (item.type === 'university') {
    return (
      <div className="sr-card" onClick={handleClick} data-id={item.id}>
        <Styles />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <img src={item.logo} alt="logo" className="sr-logo" />
              <h2 className="sr-title">{item.name}</h2>

            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap', marginBottom:10 }}>
              {item.tags?.map((tag,i) => <span key={i} className="sr-tag">{tag}</span>)}
            </div>
            <div className="sr-subtle">📍 {item.location}</div>
          </div>
          <Rating value={item.rating} note={"Based on 6 reviews"} />
        </div>
      </div>
    );
  }

  // PROGRAM
  if (item.type === 'program') {
    return (

      <div className="sr-card" onClick={handleClick} data-id={item.id}>
        <Styles />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:20 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'flex-start', gap:12, marginBottom:10 }}>
              <img src={item.logo} alt="logo" className="sr-logo" />
              <div>
                <h2 className="sr-title" style={{ fontSize:20 }}>{item.name}</h2>
                <p className="sr-subtle" style={{ margin:0 }}>{item.acronym}</p>
              </div>

            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10, color:'var(--fg)' }}>
              <img src="https://backend-dev.studentschoice.blog/uploads/graduation_Col_f90b7fb61f.png" alt="grad" style={{ width:16, height:16 }} />
              <span style={{ fontSize:14 }}>{item.duration}</span>
            </div>
            <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
              {item.tags?.map((tag,i) => <span key={i} className="sr-chip">{tag}</span>)}
            </div>
          </div>
          <Rating value={item.rating} note={"Based on 6 reviews"} />
        </div>
      </div>
    );
  }

  // DESTINATION
  if (item.type === 'destination') {
    return (
      <div className="sr-card" onClick={handleClick} data-id={item.id}>
        <Styles />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:10 }}>
              <img src={item.logo} alt="logo" className="sr-logo" />
              <h2 className="sr-title">{item.name}</h2>
            </div>
            <div className="sr-subtle" style={{ marginBottom:8 }}>{item.location}</div>
            {item.webpageName && <div className="sr-subtle" style={{ fontSize:13 }}>{item.webpageName}</div>}
          </div>
          <Rating value={item.rating} note={"Destination"} />
        </div>
      </div>
    );
  }

  // HELPFUL LINKS
  if (item.type === 'helpful-links') {
    return (

      <div className="sr-card" onClick={handleClick} data-id={item.id}>
        <Styles />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12 }}>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:10 }}>
              <img src={item.logo} alt="logo" className="sr-logo" />
              <div>
                <h2 className="sr-title" style={{ fontSize:20 }}>{item.name}</h2>
                {item.facilityType && <p className="sr-subtle" style={{ margin:0, fontSize:13 }}>{item.facilityType}</p>}
              </div>


            </div>
            {item.location && <div className="sr-subtle" style={{ marginBottom:6 }}>{item.location}</div>}
            {item.universityName && <div className="sr-subtle" style={{ fontSize:13 }}>{item.universityName}</div>}
            {item.link && <div style={{ fontSize:13, color:'var(--brand)', marginTop:6 }}>Official: {item.link}</div>}
          </div>
          <Rating value={item.rating || 0} note={"Helpful Link"} />
        </div>
      </div>
    );
  }

  // POST (review/blog/qna)
  if (item.type === 'post') {
    return (
      <div className="sr-card" onClick={handleClick} data-id={item.id}>
        <Styles />
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <img src={item.logo} alt="logo" className="sr-logo" />
            <div>
              <h2 className="sr-title" style={{ fontSize:18 }}>{item.programName || item.universityName || 'Unknown Program'}</h2>
              {item.acronym && <p className="sr-subtle" style={{ margin:0, fontSize:13 }}>{item.acronym}</p>}
            </div>
          </div>
          <div className="sr-typepill">
            {item.postType === 'review' && 'Review'}
            {item.postType === 'blog' && 'Blog'}
            {item.postType === 'qna' && 'QnA'}
            <img
              src={
                item.postType === 'review'
                  ? 'https://backend-dev.studentschoice.blog/uploads/Review_Light_97571c3921.png'
                  : item.postType === 'blog'
                  ? 'https://backend-dev.studentschoice.blog/uploads/thumbnail_Comment_Light_f189e3623a.png'
                  : 'https://backend-dev.studentschoice.blog/uploads/FAQ_Light_3c3a1649c1.png'
              }
              alt={`${item.postType} icon`}
              style={{ width: 20, height: 20 }}
            />
          </div>
        </div>


        <div className="sr-divider" style={{ display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, paddingBottom:5, marginTop:10 }}>
          <div style={{ display:'flex', alignItems:'center', gap:12 }}>
            <img src={item.avatar || 'https://backend-dev.studentschoice.blog/uploads/Default_Profile_Photo_3220d06254.jpg'} alt="avatar" style={{ width:40, height:40, borderRadius:'50%' }} />
            <p className="sr-subtle" style={{ margin:0, fontWeight:700, fontSize:15 }}>{item.author}</p>
          </div>
          <p className="sr-subtle" style={{ margin:0, fontSize:13 }}>{new Date(item.date).toLocaleDateString('en-GB')}</p>
        </div>

        <div style={{ marginTop:10 }} className="read-more-button">
          <CommentText text={item.preview} />

        </div>
      </div>
    );

  }


  return null;
};

export default SearchResultCard;