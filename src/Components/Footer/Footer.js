import "./Footer.css";
import { Link } from "react-router-dom";
import logo from "./assets/be10x-icon.png";

export default function Footer(props) {
  return (
    <>
      <div className="footer">
        <div className="company-details">
          <div className="footer-logo-cont">
            {/* <img className="footer-logo" src={logo} /> */}
            App by
            <img src={logo}></img>
              Mutual
          </div>
        </div>

        <div className="company-policy">
          {/* <p className="policy-title">POLICY</p>
          <a
            href="https://sites.google.com/view/grabnedit-terms-of-use/home"
            target="_blank"
          >
            <p>Terms & Conditions</p>
          </a>
          <a
            href="https://sites.google.com/view/grabnedit-privacy-policy/home"
            target="_blank"
          >
            <p>Privacy Policy</p>
          </a> */}

          <p className="company-policy-p1">© 2024 Mutual. All Rights Reserved</p>
          {/* <p className="">Address: D-78, Sector-x, Bangalore - 2000012</p> */}
          <p className="company-policy-p2">Email: support@mutualapps.com</p>
        </div>
      </div>
    </>
  );
}
