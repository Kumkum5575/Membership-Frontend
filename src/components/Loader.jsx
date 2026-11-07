import "./Loader.css";

export default function Loader({ text = "Loading..." }) {
    return (
        <div className="loader-wrap">
            <span className="spinner"></span>
            <p>{text}</p>
        </div>
    );
}