import './css/ProductSkeleton.css';
import './css/Skeleton.css';

const ProductSkeleton = () => {
    return (
        <div className="ProductSkeleton">
            <div className="image skeletonBg"></div>
            <div className="name skeletonBg"></div>
            <div className="price skeletonBg"></div>
        </div>
    );
}

export default ProductSkeleton;