import {useDispatch, useSelector} from "react-redux";
import {
    setGraduationLevelSelected
} from "../../app/features/filteringSubjectsAndPrograms/filteringSubjectsAndProgramsReducer";

function GraduationLevelSelection() {
    const graduationLevelTitle = "Graduation level";

    const dispatch = useDispatch();
    const graduationLevelSelected  = useSelector(state => state.filteringSubjectsAndPrograms.graduationLevelSelected);

    const handleButtonClick = (level) => {
        if (level === graduationLevelSelected) {
            dispatch(setGraduationLevelSelected(""));
        } else {
            dispatch(setGraduationLevelSelected(level));
        }
    };

    return (<div className="primaryPageSizing">
        <h2 className="titleTextSecondary">{graduationLevelTitle}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3">
            {["Undergraduate", "Postgraduate", "Research"].map(level => (
                <GradLevelBtn
                    key={level}
                    text={level}
                    isSelected={level === graduationLevelSelected}
                    onClick={() => handleButtonClick(level)}
                />
            ))}
        </div>
    </div>)
}

function GradLevelBtn({ text, isSelected, onClick }) {
    return (
        <div
            onClick={onClick}
            className={isSelected ? "fieldSelectedStyling" : "fieldStyling"}
            id={text.toLowerCase()}
        >
            {text}
        </div>
    );
}

export default GraduationLevelSelection;