import APIClient from "./APIClient"

export type CourseObject = {
    id: string;
    name: string;
    antirequisites: string[];
    ceab_eng_design: number;
    ceab_eng_sci: number;
    ceab_math: number;
    ceab_sci: number;
    code: string;
    course_id: string;
    cse_weight: number;
    department: string;
    description: string;
    description_abbreviated: string;
    prerequisites: string[];
    sections: object[];
    tags: string[];
}

export const getCourses = async(queryParams: string | null): Promise<CourseObject[]> => {
    // FIXME: this should be thrown into a try catch
    const { data } = await APIClient.get(`/courses${queryParams}`)
    return data;
}

export default { getCourses };