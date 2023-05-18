export class LoadData {
    static get = async (file: string) => 
        await fetch(file)
            .then((response) => response.json())
            .then((data) => data);   
}