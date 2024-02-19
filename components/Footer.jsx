import {
  Facebook,
  Instagram,
  Pinterest,
  LocationOn,
  LocalPhone,
  Email,
} from "@mui/icons-material";
import "../styles/Footer.scss";
import Link from "next/link";
import Logo_footer from "@components/Logo_footer";

const Footer = () => {
  return (
    <div className="footer">
      <div className="footer_left">
        <Link href="/">
          <Logo_footer />
        </Link>

        <div className="footer_left_socials">
          <div className="footer_left_socials_icon">
            <Facebook />
          </div>
          <div className="footer_left_socials_icon">
            <Instagram />
          </div>
          <div className="footer_left_socials_icon">
            <Pinterest />
          </div>
        </div>
      </div>

      <div className="footer_right">
        <h3>Contact</h3>
        <div className="footer_right_info">
          <LocationOn />
          <p>139 Victoria Park Ave</p>
        </div>
        <div className="footer_right_info">
          <LocalPhone />
          <p>+1 649-391-287</p>
        </div>
        <div className="footer_right_info">
          <Email />
          <p>support@mimarket.com.ng</p>
        </div>
      </div>
    </div>
  );
};

export default Footer;
