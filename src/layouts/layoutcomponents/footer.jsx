
import { Link } from "react-router-dom"
import { Row, Col } from "react-bootstrap"
const Footer = () => {
	return (
		<div className="footer">
			<div className="container">
				<Row className="align-items-center flex-row-reverse">
					<Col className="text-center" sm={12} md={12} lg={12}>
						Vinova © Copyright {new Date().getFullYear()} | Developed By - <Link to="https://bytelogicindia.com/">Bytelogic Technologies</Link>
					</Col>
				</Row>
			</div>
		</div>

	);
}

export default Footer;
