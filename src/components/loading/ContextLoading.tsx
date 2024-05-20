import { Col, Container, ProgressBar, Row } from "react-bootstrap";
import SpinnerCenter from "./spinner/SpinnerCenter";
import Wrapper from "../layout/Wrapper";
import Image from "next/image";

export default function ContextLoading() {
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
              Зачекайте, завантаження може тривати довше ніж звичайно...
            </p>
          </Wrapper>
        </Col>
      </Row>
    </Container>
  );
}
