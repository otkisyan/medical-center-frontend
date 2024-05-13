import Spinner from "react-bootstrap/Spinner";

export default function SpinnerCenter() {
  return (
    <div className="d-flex justify-content-center">
      <Spinner animation="grow" role="status" variant="secondary">
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
}
