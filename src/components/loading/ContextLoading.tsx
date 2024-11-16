import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import Wrapper from "../layout/Wrapper";
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function ContextLoading() {
  const tContextLoading = useTranslations("ContextLoading");
  return (
    <Container className="d-flex align-items-center justify-content-center min-vh-100">
      <Row>
        <Col className="text-center">
          <Wrapper>
            <Image
              src="/pharmacy.png"
              alt="pharmacy"
              width={400}
              height={400}
              style={{ opacity: 0.2 }}
            />
            <ProgressBar
              animated
              now={100}
              className="text-center mx-auto"
              style={{ marginTop: "40px" }}
            />
            <p className="text-center mx-auto" style={{ marginTop: "20px" }}>
              {tContextLoading("loading_notice")}
            </p>
          </Wrapper>
        </Col>
      </Row>
    </Container>
  );
}
