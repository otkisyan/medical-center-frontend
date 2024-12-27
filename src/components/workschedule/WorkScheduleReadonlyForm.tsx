import { dayOfWeekMap } from "@/i18n/day-of-week-map";
import { WorkScheduleResponse } from "@/shared/interface/work-schedule/work-schedule-interface";
import { formatTimeSecondsToTime } from "@/shared/utils/date-utils";
import { useTranslations } from "next-intl";
import { Form, Table } from "react-bootstrap";

interface WorkScheduleReadonlyProps {
  doctorWorkSchedules: WorkScheduleResponse[];
}

const WorkScheduleReadonlyForm: React.FC<WorkScheduleReadonlyProps> = ({
  doctorWorkSchedules,
}) => {
  const tWorkSchedule = useTranslations("WorkSchedule");

  return (
    <Table responsive>
      <thead>
        <tr>
          <th>{tWorkSchedule("weekday")}</th>
          <th>{tWorkSchedule("worktime_start")}</th>
          <th>{tWorkSchedule("worktime_end")}</th>
        </tr>
      </thead>
      <tbody>
        {doctorWorkSchedules.map((workSchedule, i) => (
          <tr key={i}>
            <td>
              {tWorkSchedule(
                dayOfWeekMap[workSchedule.dayOfWeekResponseDto.name]
              )}
            </td>
            <td>
              <Form.Group controlId={`workTimeStart${i}`}>
                <Form.Control
                  disabled
                  type="time"
                  value={
                    workSchedule.workTimeStart
                      ? formatTimeSecondsToTime(workSchedule.workTimeStart)
                      : ""
                  }
                />
              </Form.Group>
              <br></br>
            </td>
            <td>
              <Form.Group controlId={`workTimeEnd${i}`}>
                <Form.Control
                  disabled
                  type="time"
                  value={
                    workSchedule.workTimeEnd
                      ? formatTimeSecondsToTime(workSchedule.workTimeEnd)
                      : ""
                  }
                />
              </Form.Group>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default WorkScheduleReadonlyForm;
