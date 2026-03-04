// placeholder shimmer card shown while data is loading
export default function SkeletonCard({ lines = 3, height = 20 }) {
  return (
    <div className="skeleton-card p-4">
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="skeleton-line"
          style={{
            height,
            width: i === 0 ? '60%' : i === lines - 1 ? '40%' : '100%',
            marginBottom: i < lines - 1 ? 12 : 0,
          }}
        />
      ))}
    </div>
  );
}
