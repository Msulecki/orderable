import React, { useState, useEffect } from 'react';
import '../styles/List.scss';
import Icon from '../assets/icon.svg';

function List(props) {
    const { newData, setNewData } = props
    const [dragOverItem, setDragOverItem] = useState(null);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dropped, setDropped] = useState(null);
    const [reorder, setReorder] = useState([null, null]);
    const [offsetTop, setOffsetTop] = useState(null);
    const [relativeOffset, setRelativeOffset] = useState(null);

    let data = [];
    let draggable = {
        position: "absolute",
        opacity: ".95",
        animation: "slideLeft 300ms forwards",
        top: offsetTop - relativeOffset + "px"
    }

    const handleDragOver = (e) => {
        if (e.target.dataset.key !== dragOverItem && typeof e.target.dataset.key !== 'undefined' && draggedItem !== null) {
            setDragOverItem(e.target.dataset.key);
            dragOverItem && reorderList(draggedItem, parseInt(e.target.dataset.key));
        }
    }

    function reorderList(dragged, dragOn) {
        setReorder([dragged, dragOn]);
    }

    const handleDrop = () => {
        const droppedItem = reorder[1];
        setReorder([null, null]);
        setDraggedItem(null);

        newData.forEach((el, i) => {
            if (i >= reorder[1] && i !== reorder[0]) {
                el.order = i + 1
            }
            if (i === reorder[0]) {
                el.order = reorder[0] > reorder[1] ? reorder[1] : reorder[1] + 2;
            }
            data.push(el);
        });

        data.sort((a, b) => a.order - b.order).forEach((el, i) => {
            el.order = i;
        });

        setNewData(data);
        setDropped(droppedItem);
    }

    const handleMouseDown = (item, e) => {
        setRelativeOffset(e.pageY - e.target.getBoundingClientRect().top);
        setDraggedItem(item);
        setOffsetTop(e.pageY - 1);
        setDropped(null);
    }

    useEffect(() => {
        window.addEventListener("mouseup", () => setDraggedItem(null));
        return () => window.removeEventListener("mouseup", () => setDraggedItem(null));
    });

    useEffect(() => {
        const handleMouseMove = e => draggedItem >= 0 && setOffsetTop(e.pageY - 1);
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }
    });

    return (
        <ul className="list">
            {newData.sort((a, b) => (a.order - b.order)).map((el, i) => {
                return (
                    <>
                        <li
                            key={i}
                            className={`list__item ${dropped === i ? 'slideRight' : ''} ${dragOverItem === i ? 'hidden' : ''}`}
                            style={draggedItem === i ? draggable : undefined}
                            onMouseOver={handleDragOver}
                            onMouseUp={handleDrop}
                        >
                            <img className="list__item-icon" src={Icon} alt="icon" />
                            <div className="list__item-title"><h1>{el.title}</h1> <span>order: {el.order}</span></div>
                            <div
                                data-key={i}
                                className="list__item-grab"
                                onMouseDown={handleMouseDown.bind(this, i)}>
                            </div>
                        </li>
                        {draggedItem === i ? <li key={`dummy_${i}`} className="list__item dummy"></li> : undefined}
                    </>
                )
            })}
        </ul >
    )
}
export default List;