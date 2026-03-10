import PrivacyIcon from "../../images/icons/privacy.png"
import PageHeading from "../../components/Elements/PageHeading";

function PrivacyPolicy() {
    return (<>
        <PageHeading pageName="Privacy Policy" icon={PrivacyIcon} altName="Privacy Policy logo"/>
        
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">INTRODUCTION</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    This document sets out the privacy policy of Students Choice Global (referred to in this privacy policy as 'we', 'us', or 'our'). 
                    For the purposes of applicable data protection law, (in particular, the General Data Protection Regulation (EU) 2016/679 (the "GDPR") 
                    and the UK Data Protection Act 2018), your data will be controlled by us.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    This privacy policy applies whenever we collect your personal information and/or personal data (your personal data). 
                    This includes between you, the visitor to this website (whether directly as our customer or as personnel of our customer), 
                    and us, the owner and provider of this website and also where we are directed by a third party to process your personal data. 
                    This privacy policy applies to our use of any and all data collected by us or provided by you in relation to your use of the 
                    website and the provision of our services to you.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    We take our privacy obligations seriously. Please read this privacy policy carefully as it contains important information on who we are 
                    and how and why we collect, store, use and share your personal data in connection with your use of our website. It also explains your 
                    rights in relation to your personal data and how to contact us or a relevant regulator in the event you have a complaint.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">TYPES OF PERSONAL INFORMATION WE COLLECT</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">The personal data we collect may include the following:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    <li>name;</li>
                    <li>mailing or street address;</li>
                    <li>email address;</li>
                    <li>social media information;</li>
                    <li>telephone number and other contact details;</li>
                    <li>age;</li>
                    <li>date of birth;</li>
                    <li>credit card or other payment information;</li>
                    <li>information about your business or personal circumstances;</li>
                    <li>information in connection with any client surveys, questionnaires and promotions you participate in;</li>
                    <li>when we use analytical cookies, your device identity and type, I.P. address, geo-location information, page view statistics, advertising data and standard web log information;</li>
                    <li>information about third parties; and</li>
                    <li>any other information provided by you to us via this website, in the course of us providing services to you, or otherwise required by us or provided by you.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">HOW WE COLLECT PERSONAL INFORMATION</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    We endeavour to ensure that information we collect is complete, accurate, accessible and not subject to unauthorised access.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">We may collect personal data either directly from you, or from third parties, including where you:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    <li>contact us through on our website;</li>
                    <li>communicate with us via email, telephone, SMS, social applications (such as LinkedIn or Facebook) or otherwise;</li>
                    <li>engage us to perform services to you;</li>
                    <li>when you or your organisation offer to provide, or provides, services to us;</li>
                    <li>interact with our website, social applications, services, content and advertising; and</li>
                    <li>invest in our business or enquire as to a potential purchase in our business.</li>
                </ul>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    We may also collect personal data from you when you use or access our website or our social media pages. 
                    This may be done through use of web analytics tools, 'cookies' or other similar tracking technologies that allow us 
                    to track and analyse your website usage. For more information, please see our Cookie Policy.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">USE OF YOUR PERSONAL INFORMATION</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">We collect and use personal data for the following purposes:</p>
                <ul className="list-disc pl-6 mb-4 text-justify text-gray-700 dark:text-gray-300">
                    <li>to provide services or information to you;</li>
                    <li>for record keeping and administrative purposes;</li>
                    <li>to comply with our legal obligations, resolve disputes or enforce our agreements with third parties;</li>
                    <li>where we have your consent, including to send you marketing and promotional messages and other information that may be of interest to you. In this regard, we may use email, SMS, social media or mail to send you direct marketing communications. You can opt-out of receiving marketing materials from us by using the opt-out facility provided (e.g. an unsubscribe link);</li>
                    <li>for our legitimate interests including:
                        <ul className="list-circle pl-6 mt-2">
                            <li>to develop and carry out marketing activities and to conduct market research and analysis and develop statistics;</li>
                            <li>to improve and optimise our service offering and customer experience;</li>
                            <li>to send you administrative messages, reminders, notices, updates and other information requested by you;</li>
                            <li>to consider an application of employment from you; and</li>
                            <li>the delivery of our services.</li>
                        </ul>
                    </li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">SHARING YOUR DATA</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">We may share your personal data in certain circumstances, as follows:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    <li>where there is a change of control in our business or a sale or transfer of business assets, we reserve the right to transfer to the extent permissible at law our user databases, together with any personal data and non-personal data contained in those databases. This information may be disclosed to a potential purchaser under an agreement to maintain confidentiality. We would seek to only disclose information in good faith and where required by any of the above circumstances;</li>
                    <li>credit-checking agencies for credit control reasons;</li>
                    <li>disclosures required by law or regulation; and</li>
                    <li>service providers and other affiliated third parties to enable us to provide our services to you including other professional advisers such as accountants, disaster recovery service providers or auditors and/or overseas counsel.</li>
                </ul>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">SECURITY</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    We take reasonable steps to ensure your personal data is secure and protected from misuse or unauthorised access. 
                    Our information technology systems are password protected, and we use a range of administrative and technical measures 
                    to protect these systems. However, we cannot guarantee the security of your personal data.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">LINKS</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    Our website may contain links to other websites. Those links are provided for convenience and may not remain current or be maintained. 
                    We are not responsible for the privacy practices of those linked websites and we suggest you review the privacy policies of those 
                    websites before using them.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">YOUR RIGHTS</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">You have various rights with respect to our use of your personal data:</p>
                <ul className="list-disc pl-6 mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    <li><strong>Access:</strong> You have the right to obtain access to your information (if we're processing it) and certain other information (similar to that provided in this privacy notice). This is so that you're aware and can check that we're using your information in accordance with data protection law.</li>
                    <li><strong>Be informed:</strong> You have the right to be provided with clear, transparent and easily understandable information about how we use your information and your rights. This is why we're providing you with the information in this privacy policy.</li>
                    <li><strong>Rectification:</strong> We aim to keep your personal data accurate, current, and complete. We encourage you to contact us using our contact form to let us know if any of your personal data is not accurate or changes, so that we can keep your personal data up-to-date.</li>
                    <li><strong>Objecting:</strong> You also have the right to object to processing of your personal data in certain circumstances, including processing for direct marketing.</li>
                    <li><strong>Restricting:</strong> You have the right to 'block' or suppress further use of your information. When processing is restricted, we can still store your information, but may not use it further.</li>
                    <li><strong>Erasure:</strong> You have the right to ask us to erase your personal data when the personal data is no longer necessary for the purposes for which it was collected, or when, among other things, your personal data have been unlawfully processed.</li>
                    <li><strong>Portability:</strong> You have the right to request that some of your personal data is provided to you, or to another data controller, in a commonly used, machine-readable format.</li>
                    <li><strong>Complaints:</strong> If you believe that your data protection rights may have been breached, you have the right to lodge a complaint with the applicable supervisory authority. In the UK, the supervisory authority is the Information Commissioner's Office.</li>
                    <li><strong>Withdraw consent:</strong> If you have given your consent to anything we do with your personal data, you have the right to withdraw your consent at any time. This includes your right to withdraw consent to us using your personal data for marketing purposes.</li>
                </ul>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    You may, at any time, exercise any of the above rights, by contacting our email address provided below.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">HOW LONG WE KEEP DATA</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    We will only retain your personal data for as long as necessary to fulfil the purposes we collected it for, 
                    including for the purposes of satisfying any legal, accounting, or reporting requirements. We will securely 
                    destroy your personal data in accordance with applicable laws and regulations.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    If you would like further information about our specific retention periods for your personal data, 
                    please contact us using our email address provided below.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">TRANSFERS OUTSIDE THE EUROPEAN ECONOMIC AREA ('EEA')</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    To provide our services, we may transfer the personal data we collect to countries outside of the UK or EEA 
                    which do not provide the same level of data protection as the country in which you reside and are not 
                    recognised by the European Commission as providing an adequate level of data protection.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    When we do this, we will make sure that it is protected to the same extent as in the EEA and UK as we will 
                    put in place appropriate safeguards to protect your personal data, which may include standard contractual clauses.
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    For more information, please contact us at our email address provided below.
                </p>
            </section>

            <section className="mb-8">
                <h2 className="text-center text-2xl font-bold mb-4 text-gray-800 dark:text-white">CONTACT US</h2>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    For further information about our privacy policy or practices, or to access or correct your personal data, 
                    or make a complaint, please contact us using the details set out below:
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    Email: [insert]
                </p>
                <p className="mb-4 text-gray-700 dark:text-gray-300 text-justify">
                    We may change this privacy policy from time to time by posting an updated copy on our website and we encourage 
                    you to check our website regularly to ensure that you are aware of our most current privacy policy. 
                    Where we make any significant changes, we will endeavour to notify you by email.
                </p>
            </section>
        </div>
    </>)
}

export default PrivacyPolicy;