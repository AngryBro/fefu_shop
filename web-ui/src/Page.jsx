import Header from "./Header";
import Footer from "./Footer";

const Page = ({Content}) => {
    return (
        <div>
            <Header></Header>
            <Content/>
            <Footer></Footer>
        </div>
    );
}
export default Page;