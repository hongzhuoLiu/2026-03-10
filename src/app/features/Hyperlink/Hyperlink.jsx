// Hyperlink.jsx
import React, { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useGetNotificationsQuery } from "../../service/notificationsAPI";

// Utility function: extract data returned by Strapi v4
function getAttr(obj, key) {
  if (!obj) return undefined;
  if (obj.attributes && key in obj.attributes) return obj.attributes[key];
  return obj[key];
}
function getId(entity) {
  if (!entity) return undefined;
  if (typeof entity === "number") return entity;
  if (typeof entity === "string") return entity;
  if ("id" in entity && typeof entity.id !== "undefined") return entity.id;
  if (entity.data && entity.data.id) return entity.data.id;
  return undefined;
}
function getEntity(entity) {
  return entity?.data ?? entity;
}
function linkFromUni(holder, opts) {
  const uni = getEntity(getAttr(holder, "university_page"));
  const uniId = getId(uni);
  if (!uniId) return null;
  let url = `/universities/${uniId}`;
  if (opts?.commentId) url += `#comment-${opts.commentId}`; 
  return url;
}

export function buildNotificationLink(attrs) {
  if (!attrs) return null;

 // If the backend has given a link, use it first
  const direct = getAttr(attrs, "link");
  if (typeof direct === "string" && direct.trim()) return direct.trim();
// comment: find parent entity (blog/qna/review) → its university_page
  const relatedComment = getEntity(getAttr(attrs, "relatedComment"));
  if (relatedComment) {
    const commentId = getId(relatedComment);
    const pBlog   = getEntity(getAttr(relatedComment, "blog"));
    const pQna    = getEntity(getAttr(relatedComment, "qna"));
    const pReview = getEntity(getAttr(relatedComment, "review"));
    return (
      (pBlog   && linkFromUni(pBlog,   { commentId })) ||
      (pQna    && linkFromUni(pQna,    { commentId })) ||
      (pReview && linkFromUni(pReview, { commentId })) ||
      null
    );
  }

// review/blog/qna: take their own university_page
  const relatedReview = getEntity(getAttr(attrs, "relatedReview"));
  if (relatedReview) return linkFromUni(relatedReview);

  const relatedBlog = getEntity(getAttr(attrs, "relatedBlog"));
  if (relatedBlog) return linkFromUni(relatedBlog);

  const relatedQna = getEntity(getAttr(attrs, "relatedQna"));
  if (relatedQna) return linkFromUni(relatedQna);

 // No association or no university_page → do not jump
  return null;
}

export default function Hyperlink() {
  // Automatically get the currently logged in user from Redux
  const { user } = useSelector((state) => state.auth);
  const userId = user?.id;

 // Only send a request if there is a userId
  const { data, isLoading, isError, refetch } = useGetNotificationsQuery(userId, {
    skip: !userId,
  });

  const navigate = useNavigate();

// Data unpacking
  const notifications = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.data)) {
      return data.data.map((row) => ({
        id: row.id,
        ...row.attributes,
      }));
    }
    return [];
  }, [data]);

 // Double click to jump
  const handleDoubleClick = useCallback(
    (n) => {
      const link = buildNotificationLink(n);
      navigate(link);
    },
    [navigate]
  );

  if (!userId) {
    return <div className="p-4 text-gray-500">请先登录以查看通知。</div>;
  }

  if (isLoading) return <div>Loading notifications…</div>;
  if (isError)
    return (
      <div>
        Failed to load. <button onClick={() => refetch()}>Retry</button>
      </div>
    );
  if (!notifications.length) return <div>No notifications.</div>;

  return (
    <div className="space-y-2">
      {notifications.map((n) => {
        const title = getAttr(n, "title") ?? "Notification";
        const body = getAttr(n, "body") ?? "";

        return (
          <div
            key={getId(n)}
            onDoubleClick={() => handleDoubleClick(n)}
            className="flex items-start gap-3 rounded-xl border p-3 cursor-pointer select-none transition hover:bg-gray-50"
          >
            <div className="flex-1">
              <div className="text-sm font-medium">{title}</div>
              {body && <div className="text-sm text-gray-600">{body}</div>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
