import { useEffect } from "react";
import { useState } from "react";
import { FaRegTimesCircle } from "react-icons/fa";

const TagButton = ({
  tagName,
  setActiveFilters,
  activeTags,
  setActiveTags,
}) => {
  useEffect(() => {
    if (activeTags.length === 0) {
      setIsActive(false);
    }
  }, [activeTags]);
  const [isActive, setIsActive] = useState(false);

  const activateTag = (event) => {
    const target = event.target.textContent;
    setActiveFilters((prevFilter) =>
      prevFilter?.topics?.includes(target.toLowerCase().replace(/\s/g, "-"))
        ? {
            ...prevFilter,
            topics: prevFilter.topics.filter(
              (topic) => topic !== target.toLowerCase().replace(/\s/g, "-")
            ),
          }
        : {
            ...prevFilter,
            topics: [
              ...prevFilter.topics,
              target.toLowerCase().replace(/\s/g, "-"),
            ],
          }
    );
    setIsActive((prev) => !prev);
    const tagName = target.toLowerCase().replace(/\s/g, "-");
    const tag = (
      <div className="flex flex-row items-center gap-x-2 h-fit w-fit px-3 bg-accent4 rounded-xl">
        {target}
        <button className={tagName} onClick={deActivateTag}>
          <FaRegTimesCircle className="hover:text-accent1" />
        </button>
      </div>
    );
    const index = activeTags.filter(
      (tag) => tag?.props?.children[0] === target
    );
    if (index.length === 0) {
      setActiveTags((prevTags) => [...prevTags, tag]);
    }
    if (index.length === 1) {
      event.target.classList.add("bg-accent2");
      event.target.classList.remove("bg-accent1");
      setActiveTags((prevTags) =>
        prevTags.filter((tag) => tag?.props?.children[0] !== target)
      );
    }
  };

  const deActivateTag = (event) => {
    const target = event.currentTarget.classList;
    setActiveTags((prevTags) =>
      prevTags.filter((tag) => {
        const tagName = tag?.props?.children[0]
          .toLowerCase()
          .replace(/\s/g, "-");
        return tagName !== target[0];
      })
    );
    setActiveFilters((prevFilter) => {
      const newTopics = prevFilter.topics.filter(
        (topic) => topic !== target[0]
      );
      return {
        ...prevFilter,
        topics: newTopics,
      };
    });
    setIsActive((prev) => !prev);
  };
  return (
    <p
      className={`px-3 ${isActive ? "bg-accent1" : "bg-accent2"} rounded-xl`}
      onClick={activateTag}
    >
      {tagName}
    </p>
  );
};

export default TagButton;
