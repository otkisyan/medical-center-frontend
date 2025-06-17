import { dayOfWeekMap } from "@/i18n/day-of-week-map";
import {
  WorkScheduleRequest,
  WorkScheduleResponse,
} from "@/shared/interface/work-schedule/work-schedule-interface";
import { formatTimeSecondsToTime } from "@/shared/utils/date-utils";
import { useTranslations } from "next-intl";
import { Alert, Button, Form, Table } from "react-bootstrap";
import { WorkScheduleField } from "./WorkScheduleField";

interface WorkScheduleUpdateFormProps {
  showWorkScheduleValidationError: boolean;
  doctorWorkSchedules: WorkScheduleResponse[];
  editedDoctorWorkSchedules: WorkScheduleRequest[] | null;
  handleWorkScheduleChange: (
    index: number,
    field: WorkScheduleField,
    value: any
  ) => void;
  editingWorkSchedules: boolean;
  handleEditWorkSchedules: () => void;
  handleEditWorkSchedulesFormSubmit: React.FormEventHandler<HTMLFormElement>;
  handleCancelEditWorkSchedules: () => void;
}

const WorkScheduleUpdateForm: React.FC<WorkScheduleUpdateFormProps> = ({
  showWorkScheduleValidationError,
  editedDoctorWorkSchedules,
  handleWorkScheduleChange,
  doctorWorkSchedules,
  editingWorkSchedules,
  handleEditWorkSchedules,
  handleEditWorkSchedulesFormSubmit,
  handleCancelEditWorkSchedules,
}) => {
  const tWorkSchedule = useTranslations("WorkSchedule");
  const tCommon = useTranslations("Common");

  return (
    <Form onSubmit={handleEditWorkSchedulesFormSubmit}>
      {showWorkScheduleValidationError && (
        <Alert variant="danger">
          <Alert.Heading>
            {tWorkSchedule("alerts.time_validation_error.heading")}
          </Alert.Heading>
          <p>
            {tWorkSchedule("alerts.time_validation_error.text")}
            <br></br>
            {tWorkSchedule("alerts.time_validation_error.tip")}
          </p>
        </Alert>
      )}
      <Table responsive>
        <thead>
          <tr>
            <th>{tWorkSchedule("weekday")}</th>
            <th>{tWorkSchedule("worktime_start")}</th>
            <th>{tWorkSchedule("worktime_end")}</th>
          </tr>
        </thead>
        <tbody>
          {editedDoctorWorkSchedules !== null &&
            editedDoctorWorkSchedules.map((workSchedule, i) => (
              <tr key={i}>
                <td>
                  {tWorkSchedule(
                    dayOfWeekMap[
                      doctorWorkSchedules[i].dayOfWeekResponseDto.name
                    ]
                  )}
                </td>
                <td>
                  <Form.Group controlId={`workTimeStart${i}`}>
                    <Form.Control
                      disabled={!editingWorkSchedules}
                      type="time"
                      value={
                        workSchedule.workTimeStart
                          ? formatTimeSecondsToTime(workSchedule.workTimeStart)
                          : ""
                      }
                      onChange={(e) => {
                        handleWorkScheduleChange(
                          i,
                          "workTimeStart",
                          e.target.value
                        );
                      }}
                    />
                  </Form.Group>
                  <br></br>
                </td>
                <td>
                  <Form.Group controlId={`workTimeEnd${i}`}>
                    <Form.Control
                      disabled={!editingWorkSchedules}
                      type="time"
                      value={
                        workSchedule.workTimeEnd
                          ? formatTimeSecondsToTime(workSchedule.workTimeEnd)
                          : ""
                      }
                      onChange={(e) => {
                        handleWorkScheduleChange(
                          i,
                          "workTimeEnd",
                          e.target.value
                        );
                      }}
                    />
                  </Form.Group>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
      <Button
        variant="primary"
        type="button"
        className="me-2"
        hidden={editingWorkSchedules}
        onClick={handleEditWorkSchedules}
      >
        <i className="bi bi-pencil-square" id="editButton"></i>
      </Button>
      <Button
        variant="primary"
        type="submit"
        className="me-2"
        hidden={!editingWorkSchedules}
        id="confirmEdit"
      >
        {tCommon("action_save_button_label")}
      </Button>
      <Button
        variant="secondary"
        type="button"
        id="cancelButton"
        hidden={!editingWorkSchedules}
        onClick={handleCancelEditWorkSchedules}
      >
        {tCommon("action_cancel_button_label")}
      </Button>
    </Form>
  );
};

export default WorkScheduleUpdateForm;
