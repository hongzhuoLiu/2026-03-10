import SCLogoWhite from '../../images/logos/SCLogoWhiteBG.png';
import {Link} from "react-router-dom";

function Footer() {
    return (
        <div className="w-full bg-gray-100 dark:bg-gray-800">
            <div className="block sm:flex w-full justify-between py-5 px-[5%] text-center sm:text-left">
                <img src={SCLogoWhite} className="hidden sm:block h-[75px]" alt="Students Choice Logo"/>
                <div>
                    <FooterTopLink text="QUICK LINKS"/>
                    <FooterSecondaryLink text="Home" link="/"/>
                    <FooterSecondaryLink text="Universities" link="/universities"/>
                    <FooterSecondaryLink text="Programs" link="/programs"/>
                    <FooterSecondaryLink text="Subjects" link="/subjects"/>
                </div>
                
                <div>
                    <FooterTopLink text="RESOURCES" />
                    <FooterSecondaryLink text="About Us" link="/aboutus" />
                    <FooterSecondaryLink text="Privacy Policy" link="privacy" />
                    <FooterSecondaryLink text="Cookies Policy" link="cookies" />
                    <FooterSecondaryLink text="Terms & Conditions" link="termsandconditions" />
                
                </div>
                
                <div>
                    <FooterTopLink text="CONTACT" />
                    <FooterSecondaryLink text="Contact Us" link="contactus" />
                    <FooterSecondaryLink text="Request Addition" link="add" />
                </div>
                
            </div>
        </div>
    );
}

export default Footer;

function FooterSecondaryLink( {link, text} ) {
    return (
        <Link to={link} className="relative group block" style={{textDecoration: 'none'}}>
            <p className="text-lg text-gray-400 dark:text-gray-300">
                <span className="relative after:absolute after:left-0 after:bottom-0 after:w-full after:h-0.5 after:bg-gray-400 after:scale-x-0 group-hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-left">
                    {text}
                </span>
            </p>
        </Link>
    );
}

function FooterTopLink( {text} ) {
    return (
        <p className="font-bold text-2xl text-gray-500 dark:text-gray-200">{text}</p>
    );
}