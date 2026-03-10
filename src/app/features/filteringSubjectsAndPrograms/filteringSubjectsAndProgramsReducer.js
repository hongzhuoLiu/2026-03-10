import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    fieldSelected: "",
    graduationLevelSelected: "",
    universitySelected: "",
};

const filteringSubjectsAndProgramsSlice = createSlice({
    name: 'filteringSubjectsAndPrograms',
    initialState,
    reducers: {
        setFieldSelected: (state, action) => {
            state.fieldSelected = action.payload;
        },
        setGraduationLevelSelected: (state, action) => {
            state.graduationLevelSelected = action.payload;
        },
        setUniversitySelected: (state, action) => {
            state.universitySelected = action.payload;
        },
        setDefaultSelected: () => initialState
    },
});

export const {
    setFieldSelected,
    setGraduationLevelSelected,
    setUniversitySelected,
    setDefaultSelected
} = filteringSubjectsAndProgramsSlice.actions;

export default filteringSubjectsAndProgramsSlice.reducer;
