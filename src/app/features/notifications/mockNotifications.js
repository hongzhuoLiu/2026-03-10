let nextId = Date.now();

const TYPES = ["comment", "like", "system", "message", "follow"];
const TITLES = {
  comment: ["New comment on your post", "Someone replied to your review"],
  like: ["Someone liked your post", "Your comment got a like"],
  system: ["System maintenance notice", "Policy update"],
  message: ["New direct message", "New group message"],
  follow: ["New follower", "Someone started following you"],
};

export function typeEmoji(type) {
  switch (type) {
    case "comment": return "💬";
    case "like": return "♥️";
    case "message": return "📩";
    case "follow": return "👋";
    default: return "🔔";
  }
}
function pick(a){ return a[Math.floor(Math.random()*a.length)]; }

export function makeRandomNotification() {
  const type = pick(TYPES);
  const title = pick(TITLES[type]);
  const body = {
    comment:"“Nice work! Learned a lot from your post.”",
    like:"Your content is getting attention.",
    system:"Tonight 02:00–03:00 UTC some services may be unavailable.",
    message:"Open the inbox to read the full message.",
    follow:"Check their profile and say hi!",
  }[type];

  return { id: ++nextId, type, title, body, link:"#", createdAt:new Date().toISOString(), isRead:false };
}

export function seedNotifications(n=8){
  const now = Date.now();
  return Array.from({length:n}).map((_,i)=>{
    const it = makeRandomNotification();
    it.id = ++nextId;
    it.createdAt = new Date(now - (i+1)*60_000).toISOString();
    it.isRead = i > 2; // first three message are unread
    return it;
  });
}
