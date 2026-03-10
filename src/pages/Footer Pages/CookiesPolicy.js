
import PageHeading from "../../components/Elements/PageHeading";
import PrivacyIcon from "../../images/icons/privacy.png";

function CookiesPolicy() {
    return (<>
        <PageHeading pageName="Cookies Policy" icon={PrivacyIcon} altName="Cookies Policy logo"/>
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">1. INTRODUCTION</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    (a) This document sets out the Cookies Policy of Students Choice Global (referred to in this cookies policy as 'we', 
                    'us', or 'our').
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    (b) This Cookies Policy applies when you use our website accessible at <a href="https://studentschoice.blog" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300">studentschoice.blog</a> ("Website") and describes 
                    the types of cookies we use on our Website, how we use them, and how you can control them.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    (c) We may update this Cookies Policy from time to time by posting an updated copy on our website and we encourage you 
                    to check our website regularly to ensure that you are aware of our most current Cookies Policy.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">2. TYPES OF COOKIES WE USE</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    A cookie is a small file that's stored on your computer or device when you visit a website that uses cookies. 
                    We may use several different cookies on our Website, for the purposes of website functionality, performance, 
                    advertising, and social media or content cookies. Cookies enhance your experience on our Website, as it allows 
                    us to recognise you, remember your details and preferences (for example, your log-in details), and provide us 
                    with information on when you've visited and how you've interacted with our Website.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    The below table sets out the type of cookies we may collect on our Website.
                </p>
                
                {/* Table of cookie types */}
                <div className="overflow-x-auto mb-6">
                    <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600">
                        <thead>
                            <tr className="bg-gray-100 dark:bg-gray-700">
                                <th className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-gray-800 dark:text-white">Cookie Type</th>
                                <th className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-left text-gray-800 dark:text-white">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">Strictly Necessary Cookies</td>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-justify">
                                    Certain cookies we use are essential for the proper functioning of our Website, 
                                    without which our Website won't work or certain features won't be accessible 
                                    to you. For example, we may need to remember data you've inputted from one 
                                    page to the next in a single session.
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">Performance Cookies</td>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-justify">
                                    Performance cookies collect information about your use of the Website to help 
                                    enhance the services we provide to you. We collect information about how you 
                                    interact with the Website, including the pages you visit and the frequency of 
                                    your visits. This information helps us identify patterns of usage on the site, 
                                    collect analytics data, identify issues you may have had on the Website, make 
                                    changes to enhance your browsing experience, and analyse if our marketing is 
                                    effective and relevant to you.
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">Functional Cookies</td>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-justify">
                                    We use functional cookies to improve your experience on our Website and 
                                    make things more convenient for you. These cookies personalise your 
                                    experience on our Website based on your preferences, by remembering your 
                                    details such as your login details or region.
                                    <br/><br/>
                                    Security cookies are a type of functional cookie, which assist with website and 
                                    user account security. Load balancing session cookies are used for the duration 
                                    of the session to distribute user requests across multiple servers to optimize 
                                    website speed and capacity. We may also use user interface customization 
                                    persistent cookies to store a user's preferred version of our Website, such as 
                                    font and language preferences.
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">Advertising cookies</td>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-justify">
                                    Advertising cookies are used on our Website to provide you with targeted 
                                    marketing materials in accordance with your interests and preferences. These 
                                    cookies remember that you visited our Website, and we may provide this 
                                    information to third-parties. These cookies usually cannot personally identify 
                                    you, so your anonymity is typically secured. These cookies ensure that 
                                    advertisements displayed to you are things that may be of interest to you.
                                </td>
                            </tr>
                            <tr>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 font-medium text-gray-700 dark:text-gray-300">Content cookies</td>
                                <td className="py-2 px-4 border-b border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-justify">
                                    Content cookies are placed by many social media plugins (like plugins that 
                                    allow you to share content on Facebook), and other tools to enhance the 
                                    content displayed on a website (for example, services that allow the playing of 
                                    video files). We integrate these plugins into our Website to improve usability 
                                    and customer experience. Some of these third party services may place cookies 
                                    that are also used for the purposes of behavioural advertising or market 
                                    analysis.
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">3. HOW LONG WILL COOKIES REMAIN ON MY DEVICE?</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    The amount of time that a cookie remains on your computer or device depends on the type of cookie – cookies are either 
                    "persistent" or "session" cookies. Persistent cookies last until they expire or are deleted, so they may remain on your 
                    device for as little as 10 minutes to several years. Session cookies last until you stop browsing, so just for the relevant session.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">4. HOW DO THIRD PARTIES USE COOKIES ON THE WEBSITE?</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    We may use third party analytics cookies to collect information about your interaction with our Website. 
                    We also may use Google Analytics and other third-party analytics providers to help process data. 
                    To find out more, see How Google uses data when you use our partners' sites or apps.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">5. HOW DO I CONTROL COOKIES?</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    Usually, you can control and manage cookies through your browser. You can control whether or not your browser accepts cookies, 
                    how to filter and manage cookies, and how to delete cookies at the end of a session.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    If you remove or block cookies, this may negatively impact your experience of our Website and you may not be able 
                    to access all parts of our Website.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    Many third party advertising services allow you to opt out of their tracking systems, by giving you the opportunity 
                    to opt out by way of a pop-up before downloading cookies to your device.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">CONTACT US</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    For further information about our Cookies Policy or practices, please contact us using the details set out below:
                </p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    <li>Name: [insert]</li>
                    <li>Email: [insert]</li>
                </ul>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    Our Cookies Policy was last updated on 10 October 2024.
                </p>
            </section>
        </div>
    </>)
}

export default CookiesPolicy;
