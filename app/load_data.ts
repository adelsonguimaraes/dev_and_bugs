export class LoadData {
    static get = async ({file}) => 
        await fetch(file)
            .then((response) => response.json())
            .then((data) => data);   
}