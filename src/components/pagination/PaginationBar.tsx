import Pagination from "react-bootstrap/Pagination";

interface PaginationBarProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isFirst: boolean;
  isLast: boolean;
}

const PaginationBar: React.FC<PaginationBarProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  isFirst,
  isLast,
}) => {
  const handleFirstPage = () => onPageChange(0);
  const handlePrevPage = () => onPageChange(currentPage - 1);
  const handleNextPage = () => onPageChange(currentPage + 1);
  const handleLastPage = () => onPageChange(totalPages - 1);

  return (
    <Pagination className="d-flex justify-content-center">
      <Pagination.First onClick={handleFirstPage} disabled={isFirst} />
      <Pagination.Prev onClick={handlePrevPage} disabled={isFirst} />

      {[...Array(totalPages)].map((_, i) => {
        if (
          i === 0 ||
          i === totalPages - 1 ||
          (i >= currentPage - 2 && i <= currentPage + 2)
        ) {
          return (
            <Pagination.Item
              key={i}
              active={i === currentPage}
              onClick={() => onPageChange(i)}
            >
              {i + 1}
            </Pagination.Item>
          );
        } else if (i === currentPage - 3 || i === currentPage + 3) {
          return <Pagination.Ellipsis key={i} disabled />;
        }
        return null;
      })}

      <Pagination.Next onClick={handleNextPage} disabled={isLast} />
      <Pagination.Last onClick={handleLastPage} disabled={isLast} />
    </Pagination>
  );
};

export default PaginationBar;
