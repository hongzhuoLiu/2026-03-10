import { useEffect } from "react";
import FieldsSelection from "../../components/ProgramsAndSubjectsLoad/FieldsSelection";
import GraduationLevelSelection from "../../components/ProgramsAndSubjectsLoad/GraduationLevelSelection";
import UniversitiesSelection from "../../components/ProgramsAndSubjectsLoad/UniversitiesSelection";
import ShowResults from "../../components/ProgramsAndSubjectsLoad/ShowResults";
import Book from "../../images/icons/writeCol.png";
import PageHeading from "../../components/Elements/PageHeading";
import {useDispatch} from "react-redux";
import {setDefaultSelected} from "../../app/features/filteringSubjectsAndPrograms/filteringSubjectsAndProgramsReducer";

function Subjects() {
    const dispatch = useDispatch();
    dispatch(setDefaultSelected());

    useEffect(() => {
        const pageTitle = "Explore Subjects at your University | Explore Academic Fields & Study Areas | StudentsChoice";
        const pageDescription = "Discover university subjects and academic fields. Filter by subject area, graduation level, and university to find the perfect academic path for your studies.";
        const origin = window.location.origin;
        const canonicalUrl = `${origin}/subjects`;

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
        setOrCreateMetaByName("twitter:image:alt", "StudentsChoice — discover and compare universities and subjects");

        // JSON-LD: CollectionPage for Subjects
        setJsonLd("seo-jsonld-subjects", {
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Subjects at StudentsChoice",
            "url": canonicalUrl,
            "description": pageDescription,
            "isPartOf": {
                "@type": "WebSite",
                "name": "StudentsChoice",
                "url": origin
            }
        });

        return undefined;
    }, []);

    return (
        <>
            <PageHeading pageName="Subjects" icon={Book}/>

            <FieldsSelection pageType={"subject"}/>

            <GraduationLevelSelection/>

            <UniversitiesSelection/>

            <ShowResults pageType={"subject"}/>
        </>
    )
}

export default Subjects;