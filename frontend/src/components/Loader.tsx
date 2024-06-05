const Loader = () => {
  return <div>Loading ...</div>;
};

interface SkeletonProps {
  width?: string;
  length?: number;
}

export const SkelatonLoader = ({
  width = "unset",
  length = 3,
}: SkeletonProps) => {
  const skeletonDiv = Array.from({ length }, (_, index) => (
    <div className="skeleton-shape" key={index}></div>
  ));
  return (
    <div className="skeleton-loader" style={{ width }}>
      {skeletonDiv}
    </div>
  );
};

export default Loader;
