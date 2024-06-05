const Loader = () => {
  return <div>Loading ...</div>;
};

export const SkelatonLoader = () => (
  <div className="skeleton-loader">
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
    <div className="skeleton-shape"></div>
  </div>
);

export default Loader;
