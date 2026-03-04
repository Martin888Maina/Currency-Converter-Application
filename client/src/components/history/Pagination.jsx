import { Pagination as BsPagination } from 'react-bootstrap';

export default function Pagination({ pagination, onPageChange }) {
  const { page, totalPages } = pagination;
  if (totalPages <= 1) return null;

  // show at most 5 page buttons centered around current page
  const range = [];
  const delta = 2;
  const left = Math.max(1, page - delta);
  const right = Math.min(totalPages, page + delta);
  for (let i = left; i <= right; i++) range.push(i);

  return (
    <BsPagination className="mb-0 justify-content-center">
      <BsPagination.Prev disabled={page === 1} onClick={() => onPageChange(page - 1)} />

      {left > 1 && (
        <>
          <BsPagination.Item onClick={() => onPageChange(1)}>1</BsPagination.Item>
          {left > 2 && <BsPagination.Ellipsis disabled />}
        </>
      )}

      {range.map((p) => (
        <BsPagination.Item key={p} active={p === page} onClick={() => onPageChange(p)}>
          {p}
        </BsPagination.Item>
      ))}

      {right < totalPages && (
        <>
          {right < totalPages - 1 && <BsPagination.Ellipsis disabled />}
          <BsPagination.Item onClick={() => onPageChange(totalPages)}>{totalPages}</BsPagination.Item>
        </>
      )}

      <BsPagination.Next disabled={page === totalPages} onClick={() => onPageChange(page + 1)} />
    </BsPagination>
  );
}
