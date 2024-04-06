
export interface Project {
    processingStatus: string;
    thumbnail: string;
    id: string;
    title: string;
    description: string;
    creation_date: string;
}
let example: Project = {
    "id": "", 
    "thumbnail": 'https://hips.hearstapps.com/hmg-prod/images/dog-puppy-on-garden-royalty-free-image-1586966191.jpg?crop=1xw:0.74975xh;center,top&resize=1200:*', 
    "processingStatus": "completed",
    "title": "Title",
    "description":"This is a description",
    "creation_date": "4/6/24"
}
export const exampleProjects: Project[] = [example, example, example, example, example]