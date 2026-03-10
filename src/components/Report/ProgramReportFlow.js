import React from "react";
import EntityReportFlow from "./EntityReportFlow";

const ProgramReportFlow = ({ onClose, programId, userId }) => {
  return (
    <EntityReportFlow
      onClose={onClose}
      userId={userId}
      entityId={programId}
      entityKey="program"
      reasonsEndpoint="program-report-reasons"
      submitEndpoint="program-reports"
      titles={{
        step1: "What would you like to report about this program?",
        step2: "Select the specific issue:",
        thanks: "Thank you for your feedback",
      }}
    />
  );
};

export default ProgramReportFlow;


