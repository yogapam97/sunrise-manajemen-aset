import AuditColumn from "../audit/AuditColumn";
import AssignmentColumn from "../assignment/AssignmentListTable/AssignmentColumn";
import RelocationColumn from "../relocation/RelocationListTable/RelocationColumn";
import TransitionColumn from "../transition/TransitionListTable/TransitionColumn";

type OperationLogDetailProps = {
  operation_type: string;
  details: any;
  hide_old?: boolean;
};
export default function OperationLogDetail({
  operation_type,
  details,
  hide_old,
}: OperationLogDetailProps) {
  if (operation_type === "AUDIT") {
    if (details?.metric) {
      return <AuditColumn metric={details.metric} value={details.value} />;
    }
  }
  if (operation_type === "RELOCATION")
    return (
      <RelocationColumn
        hide_old={hide_old}
        old_location={details?.old?.location}
        new_location={details?.new?.location}
      />
    );
  if (operation_type === "ASSIGNMENT")
    return (
      <AssignmentColumn
        hide_old={hide_old}
        old_assignee={details?.old?.assignee}
        new_assignee={details?.new?.assignee}
      />
    );
  if (operation_type === "TRANSITION")
    return (
      <TransitionColumn
        hide_old={hide_old}
        old_lifecycle={details?.old?.lifecycle}
        new_lifecycle={details?.new?.lifecycle}
      />
    );
}
