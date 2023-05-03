import { FaCaretUp } from "react-icons/fa";

const ReturnToTop = (props) => {
  return (
    <button
      className="absolute bottom-10 right-10 w-10 h-10 flex flex-row items-center justify-center bg-accent3 rounded-full"
      onClick={() =>
        document.getElementById("top").scrollIntoView({ behavior: "smooth" })
      }
    >
      <FaCaretUp className="text-white text-3xl" />
    </button>
  );
};

export default ReturnToTop;
