import React from "react";
import EntityReportFlow from "./EntityReportFlow";

const SubjectReportFlow = ({ onClose, subjectId, userId }) => {
  return (
    <EntityReportFlow
      onClose={onClose}
      userId={userId}
      entityId={subjectId}
      entityKey="subject"
      reasonsEndpoint="subject-report-reasons"
      submitEndpoint="subject-reports"
      titles={{
        step1: "What would you like to report about this subject?",
        step2: "Select the specific issue:",
        thanks: "Thank you for your feedback",
      }}
    />
  );
};

export default SubjectReportFlow;


