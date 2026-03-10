import React from "react";
import EntityReportFlow from "./EntityReportFlow";

const FacilityReportFlow = ({ onClose, facilityId, userId, facilityCategory, titles, entityTitle }) => {
  const computedTitles = titles || {
    step1: entityTitle ? `What would you like to report about this ${entityTitle}?` : "What would you like to report about this facility?",
    step2: "Select the specific issue:",
    thanks: "Thank you for your feedback",
  };

  // Build a server-side query to fetch only reasons for this facility type (case-insensitive)
  const norm = (s) => encodeURIComponent((s || '').toString().trim());
  const t = norm(facilityCategory);
  // Keep server-side filter simple to avoid 400: focus on 'Type' field
  const reasonsQuery = t
    ? `filters[Type][$eq]=${t}&pagination[pageSize]=200`
    : 'pagination[pageSize]=200';
  return (
    <EntityReportFlow
      onClose={onClose}
      userId={userId}
      entityId={facilityId}
      entityKey="facility"
      reasonsEndpoint="facility-report-reasons"
      submitEndpoint="facility-reports"
      facilityCategory={facilityCategory}
      reasonsQuery={reasonsQuery}
      titles={computedTitles}
    />
  );
};

export default FacilityReportFlow;
