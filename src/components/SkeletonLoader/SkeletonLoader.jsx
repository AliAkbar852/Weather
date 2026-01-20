import './SkeletonLoader.css';

const SkeletonLoader = ({ type }) => {
    const classes = `skeleton ${type}`;
    return <div className={classes}></div>;
};

export default SkeletonLoader;
