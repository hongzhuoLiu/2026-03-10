import EmailIcon from "../../images/icons/EmailIcon.png"
import DiscordLogo from "../../images/icons/DiscordLogo.png";
import XLogo from "../../images/icons/XLogo.png";
import InstagramLogo from "../../images/icons/InstagramLogo.png";
import FacebookLogo from "../../images/icons/FacebookLogo.png";
import LinkedInLogo from "../../images/icons/LinkedInLogo.png";
import ContactIcon from "../../images/icons/contact.png"

import PageHeading from "../../components/Elements/PageHeading";

function ContactUs() {

    /**
     * List of platforms with their image URLs, alt text, and links.
     *
     * Each item in the array contains the following properties:
     * - `alt`: The alt text for the image.
     * - `img`: The URL of the image.
     * - `link`: The link to the platform.
     *
     * @type {Array<{alt: string, img: string, link: string}>}
     */
    const platforms = [{
        alt: "email", img: EmailIcon, link: "mailto:email@studentschoice.blog"
    }, {
        alt: "discord", img: DiscordLogo, link: "https://discord.com/"
    }, {
        alt: "x", img: XLogo, link: "https://x.com"
    }, {
        alt: "instagram", img: InstagramLogo, link: "https://www.instagram.com"
    }, {
        alt: "facebook", img: FacebookLogo, link: "https://www.facebook.com"
    }, {
        alt: "linkedin", img: LinkedInLogo, link: "https://www.linkedin.com"
    }];

    const reportIssueLink = platforms.find(platform => platform.alt === "email").link;
    const ideaSuggestionLink = "add"

    const contactUsText = "Feel free to get in touch with us! Here are our contact options below:"
    const leaveFeedbackText = (<>
        We're always looking to improve, so let us know if{' '}
        <u>
            <b>
                <a
                    href={reportIssueLink}
                    target="_blank"
                    rel="noreferrer"
                >
                    something isn't working right
                </a>
            </b>
        </u>
        , or if you have an{' '}
        <u>
            <b>
                <a
                    href={ideaSuggestionLink}
                    target="_blank"
                    rel="noreferrer"
                >
                    awesome idea
                </a>
            </b>
        </u>
        {' '}you'd like for us to implement!
    </>);

    return (<>
        <PageHeading pageName="Contact Us" icon={ContactIcon} altName="Contact Us icon"/>

        <p className="mx-auto mt-12 mb-12 text-center text-xl text-white w-[80%]">{contactUsText}</p>

        <div
            className="mx-auto grid grid-cols-2 gap-x-4 gap-y-6 pr-12 pl-12 w-[66vw] md:w-[50vw] md:grid-cols-3 md:grid-rows-2">
            {platforms.map(({img, link, alt}, index) => <div key={index}
                                                             className="flex items-center justify-center md:row-span-1">
                <a href={link} target="_blank" rel="noreferrer"
                   className="underline">
                    <img
                        src={img}
                        alt={alt}
                        className="h-auto w-auto object-contain max-h-[125px] md:max-h-[200px] md:max-w-full"/>
                </a>
            </div>)}
        </div>

        <p className="mx-auto mt-16 mb-12 text-center text-xl text-white w-[80%]">{leaveFeedbackText}</p>

    </>)
}

export default ContactUs;