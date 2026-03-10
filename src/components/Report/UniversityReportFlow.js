import React from "react";
import EntityReportFlow from "./EntityReportFlow";

const UniversityReportFlow = ({ onClose, universityId, userId }) => {
  return (
    <EntityReportFlow
      onClose={onClose}
      userId={userId}
      entityId={universityId}
      entityKey="university"
      reasonsEndpoint="university-report-reasons"
      submitEndpoint="university-reports"
      titles={{
        step1: "What would you like to report about this university?",
        step2: "Select the specific issue:",
        thanks: "Thank you for your feedback",
      }}
    />
  );
};

export default UniversityReportFlow;
