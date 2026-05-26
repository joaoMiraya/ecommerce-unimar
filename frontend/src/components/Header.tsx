import axios from "axios";

export const Header = () => {

    const req = () => {
        return axios.get("http://localhost:8000/").then(res => console.log(res)).catch((err) => {
            
            return err
        })
    };
    return (
        <>
        <button onClick={() => req()}>Make request</button>
        header
        </>
    )
}