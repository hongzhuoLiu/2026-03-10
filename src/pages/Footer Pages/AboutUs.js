import { useEffect } from "react";
import PageHeading from "../../components/Elements/PageHeading";

// Import Memojis
import Xinwei from "../../images/memoji/Xinwei.png";
import Owen from "../../images/memoji/Owen.png";
import Si from "../../images/memoji/Si.png";
import Xingyu from "../../images/memoji/Xingyu.png";
import Lexie from "../../images/memoji/Lexie.png";
import Jack from "../../images/memoji/Jack.png";
import Sithum from "../../images/memoji/Sith.png";
import Will from "../../images/memoji/Will.png";
import Izak from "../../images/memoji/Izak.png";
import June from "../../images/memoji/June.png";
import WangLin from "../../images/memoji/Max.png";
import Louis from "../../images/memoji/Louis.png";
import Tashia from "../../images/memoji/Tashia.png";
import Devyani from "../../images/memoji/Devyani.png";
import About from "../../images/icons/about.png";

function AboutUs() {

    const aboutUsText = "Students Choice is an online platform designed to connect and inform upcoming and existing university students on the lifestyle, opportunities, culture and so much more of universities in order to help you find the perfect place to study."

    // Client-requested SEO title and description format
    const pageTitle = "About StudentsChoice | University Comparison Platform & Student Reviews";
    const pageDescription = "Global community for uni students. Free. Compare reviews. Make informed decisions. Discover StudentsChoice - the leading university comparison platform helping students find the perfect university. Compare programs, read real student reviews, explore campus life, and make informed decisions about your education.";

    useEffect(() => {
        const origin = window.location.origin;
        const canonicalUrl = `${origin}/aboutus`;

        const setOrCreateMetaByName = (name, content) => {
            let tag = document.querySelector(`meta[name="${name}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("name", name);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        const setOrCreateMetaByProperty = (property, content) => {
            let tag = document.querySelector(`meta[property="${property}"]`);
            if (!tag) {
                tag = document.createElement("meta");
                tag.setAttribute("property", property);
                document.head.appendChild(tag);
            }
            tag.setAttribute("content", content);
        };

        const setOrCreateLinkCanonical = (href) => {
            let link = document.querySelector('link[rel="canonical"]');
            if (!link) {
                link = document.createElement("link");
                link.setAttribute("rel", "canonical");
                document.head.appendChild(link);
            }
            link.setAttribute("href", href);
        };

        const setJsonLd = (id, json) => {
            let script = document.getElementById(id);
            if (!script) {
                script = document.createElement("script");
                script.type = "application/ld+json";
                script.id = id;
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(json);
        };

        // Title
        document.title = pageTitle;

        // Meta description and robots
        setOrCreateMetaByName("description", pageDescription);
        setOrCreateMetaByName("robots", "index,follow");

        // Canonical
        setOrCreateLinkCanonical(canonicalUrl);

        // Open Graph
        setOrCreateMetaByProperty("og:type", "website");
        setOrCreateMetaByProperty("og:site_name", "StudentsChoice");
        setOrCreateMetaByProperty("og:title", pageTitle);
        setOrCreateMetaByProperty("og:description", pageDescription);
        setOrCreateMetaByProperty("og:url", canonicalUrl);
        setOrCreateMetaByProperty("og:image", `${origin}/og.png`);

        // Twitter
        setOrCreateMetaByName("twitter:card", "summary_large_image");
        setOrCreateMetaByName("twitter:title", pageTitle);
        setOrCreateMetaByName("twitter:description", pageDescription);
        setOrCreateMetaByName("twitter:image", `${origin}/og.png`);
        setOrCreateMetaByName("twitter:image:alt", "StudentsChoice — leading university comparison platform with student reviews");

        // Enhanced JSON-LD: About Page + Organization + WebSite
        setJsonLd("seo-jsonld-about", {
            "@context": "https://schema.org",
            "@type": "AboutPage",
            "name": "About StudentsChoice",
            "url": canonicalUrl,
            "description": pageDescription,
            "isPartOf": {
                "@type": "WebSite",
                "name": "StudentsChoice",
                "url": origin,
                "description": "University comparison platform with student reviews and campus guides",
                "potentialAction": {
                    "@type": "SearchAction",
                    "target": `${origin}/universities`,
                    "query-input": "required name=search_term_string"
                }
            },
            "primaryImageOfPage": `${origin}/og.png`,
            "mainEntity": {
                "@type": "Organization",
                "name": "StudentsChoice",
                "description": "Leading platform for university comparison and student reviews",
                "url": origin,
                "sameAs": [
                    "https://frontend-dev.studentschoice.blog"
                ]
            }
        });

        return undefined;
    }, []);

    /**
     * List of developers with their icon IDs, names, gradient colors, and descriptions.
     *
     * Each item in the array contains the following properties:
     *
     * - `iconID`: The ID of the icon to display for the developer (from Strapi).
     * - `name`: The name of the developer.
     * - `gradient`: The CSS gradient style to apply to the name.
     * - `desc`: The description of the developer (e.g. their role).
     *
     * @type {Array<{iconID: number, name: string, gradient: string, desc: string}>}
     */
    const developers = [{
        img: Jack,
        name: "Jack",
        gradient: "bg-gradient-to-r from-blue-600 to-emerald-400",
        desc: "Front End Software Engineer"
    }, {
        img: Sithum,
        name: "Sithum",
        gradient: "bg-gradient-to-r from-purple-600 to-green-400",
        desc: "Full Stack Developer"
    }, {
        img: Will,
        name: "Will",
        gradient: "bg-gradient-to-r from-blue-600 to-indigo-400",
        desc: "Back End Software Engineer & Software Tester"
    }, {
        img: Izak,
        name: "Izak",
        gradient: "bg-gradient-to-r from-purple-600 to-rose-300",
        desc: "Front End Software Engineer"
    }, {
        img: June,
        name: "June",
        gradient: "bg-gradient-to-r from-fuchsia-600 to-rose-400",
        desc: "Full Stack Software Engineer"
    }, {
        img: WangLin,
        name: "WangLin",
        gradient: "bg-gradient-to-r from-cyan-700 to-orange-300",
        desc: "Back End Software Engineer"
    }, {
        img: Louis,
        name: "Louis",
        gradient: "bg-gradient-to-r from-sky-600 to-rose-300",
        desc: "Full Stack Software Engineer"
    }, {
        img: Tashia,
        name: "Tashia",
        gradient: "bg-gradient-to-r from-pink-700 to-green-300",
        desc: "Project Manager, Front End Software Engineer & Software Tester"
    }, {
        img: Xinwei,
        name: "Xinwei (Vivian) Li",
        gradient: "bg-gradient-to-r from-blue-600 to-emerald-400",
        desc: "Back End Software Engineer"
    }, {
        img: Owen,
        name: "Yuhua (Owen) Hong",
        gradient: "bg-gradient-to-r from-purple-600 to-green-400",
        desc: "Back End Software Engineer"
    }, {
        img: Si,
        name: "Si Chen",
        gradient: "bg-gradient-to-r from-blue-600 to-indigo-400",
        desc: "Front End Software Engineer"
    }, {
        img: Lexie,
        name: "Yuhan (Lexie) Xie",
        gradient: "bg-gradient-to-r from-purple-600 to-rose-300",
        desc: "Front End Software Engineer"
    }, {
        img: Xingyu,
        name: "Xingyu Du",
        gradient: "bg-gradient-to-r from-fuchsia-600 to-rose-400",
        desc: "Front End Software Engineer"
    }, {
        img: Devyani,
        name: "Devyani",
        gradient: "bg-gradient-to-r from-red-600 to-lime-400",
        desc: "Project manager"
    }];

    return (
        <>
            <PageHeading pageName="About Us" icon={About} altName="About us logo" />

            {/* Main content section with enhanced SEO structure */}
            <section className="mx-auto mt-12 text-center w-[75%] dark:text-white">
                <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">University Comparison Platform</h2>
                <p className="text-2xl text-gray-700 dark:text-white text-justify leading-relaxed">{aboutUsText}</p>
            </section>

            {/* University comparison benefits section */}
            <section className="mx-auto mt-12 text-center w-[75%] dark:text-white">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Compare Universities & Programs</h3>
                <p className="text-2xl text-gray-700 dark:text-white text-justify leading-relaxed">
                    We understand the stress and time-consuming experience of finding and comparing universities to pick the best one for you.
                    At <strong>StudentsChoice</strong>, our <strong>university comparison platform</strong> makes it easy to compare universities
                    and understand their key differences in culture and education. Start your search on our{' '}
                    <a href="/universities" className="font-bold text-blue-600 hover:text-blue-800 underline">Universities</a>,{' '}
                    <a href="/programs" className="font-bold text-blue-600 hover:text-blue-800 underline">Programs</a> or{' '}
                    <a href="/subjects" className="font-bold text-blue-600 hover:text-blue-800 underline">Subjects</a> pages
                    to find the perfect fit for your academic journey.
                </p>
            </section>

            {/* Student community and reviews section */}
            <section className="mx-auto mt-12 text-center w-[75%] dark:text-white">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Student Reviews & Campus Life</h3>
                <p className="text-2xl text-gray-700 dark:text-white text-justify leading-relaxed">
                    Connect with existing students to get real insights about <strong>campus life</strong> and <strong>university programs</strong>.
                    Chat with current students, ask questions, and explore what university life is really like through authentic
                    <strong>student reviews</strong> and posts. Follow universities, subjects, and programs to stay updated with current events.
                    Our platform is designed by and for <strong>university students</strong> - who better to guide you than someone
                    studying your dream degree?
                </p>
            </section>

            <section className="mx-auto mt-12 text-center w-[75%] dark:text-white">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Content Disclaimer</h3>
                <p className="text-2xl text-gray-700 dark:text-white text-justify leading-relaxed">
                    StudentsChoice is an open and collaborative platform where students and users contribute their own educational
                    insights, reviews, and experiences. While our team actively monitors content to ensure relevance and usefulness,
                    user-generated submissions may vary in accuracy or perspective. StudentsChoice does not independently verify every
                    submission and does not assume liability for the correctness of user-contributed material.
                </p>
            </section>

            {/* Development team section */}
            <section className="mx-auto mt-12 text-center w-[75%] dark:text-white">
                <h3 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">Our Development Team</h3>
                <p className="text-2xl text-gray-700 dark:text-white text-justify leading-relaxed">
                    <strong>StudentsChoice</strong> is developed by a passionate team of developers at the{' '}
                    <a href="/universities/2" className="font-bold text-blue-600 hover:text-blue-800 underline">
                        Australian National University (ANU)
                    </a> as part of the{' '}
                    <a href="https://comp.anu.edu.au/TechLauncher/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-blue-600 hover:text-blue-800 underline">
                        TechLauncher
                    </a> program, our developers have been working
                    on this <strong>university comparison platform</strong> for numerous semesters, creating a comprehensive
                    tool for <strong>higher education</strong> decision-making.
                </p>
            </section>

            {/* Team members section */}
            <section className="mx-auto mt-24 mb-12">
                <h3 className="text-2xl font-semibold mb-6 text-center text-gray-800 dark:text-white">Meet Our Team</h3>
                <div className="grid scale-125 items-center justify-center self-center xs:grid-cols-1">
                    <PersonalTable {...developers.find(developer => developer.name === 'Devyani')} />
                </div>
            </section>

            <section className="mx-auto mb-16">
                <div className="grid gap-x-6 gap-y-8 self-center xs:grid-cols-1 sm:w-[60%] md:grid-cols-2 lg:w-[45%] justify-start items-start sm:justify-center sm:items-center">
                    {developers.filter(developer => developer.name !== 'Devyani').map(developer =>
                        <div className="w-full" key={developer.name}>
                            <PersonalTable {...developer} />
                        </div>
                    )}
                </div>
            </section>
        </>
    )
}

export default AboutUs;

function PersonalTable({ img, name, gradient, desc }) {
    return (
        <div className="flex items-center justify-start sm:justify-start">
            <img className="w-32" src={img} alt={img} />
            <div>
                <p className={`text-2xl font-bold ${gradient} inline-block text-transparent bg-clip-text`}>{name}</p>
                <p className="text-gray-500 dark:text-gray-200">{desc}</p>
            </div>

        </div>
    );
}