"use client";
import { Locale } from "@/i18n/config";
import { setUserLocale } from "@/shared/service/locale-service";
import { Col, Form, Row } from "react-bootstrap";

type Props = {
  defaultValue: string;
  items: Array<{ value: string; label: string }>;
  label: string;
};

export default function LocaleSwitcherSelect({
  defaultValue,
  items,
  label,
}: Props) {
  function onChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const locale = event.target.value as Locale;
    setUserLocale(locale);
  }

  return (
    <>
      <Row>
        <Form.Group className="mb-3" controlId="settings.language">
          <Form.Label>{label}</Form.Label>
          <Form.Select
            id="locale-switcher"
            defaultValue={defaultValue}
            onChange={onChange}
          >
            {items.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Row>
    </>
  );
}
