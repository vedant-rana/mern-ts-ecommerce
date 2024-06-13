const Loader = () => {
  return (
    <div className="lds-ring">
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
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
