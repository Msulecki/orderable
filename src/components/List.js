import React, { useState, useEffect } from 'react';
import '../styles/List.scss';
import Icon from '../assets/icon.svg';

function List(props) {
    const { newData, setNewData } = props
    const [draggedItem, setDraggedItem] = useState(null);
    const [dropped, setDropped] = useState(null);
    const [reorder, setReorder] = useState([null, null]);
    const [offsetTop, setOffsetTop] = useState(null);
    const [margin, setMargin] = useState("1px 0 1px 0");
    const [relativeOffset, setRelativeOffset] = useState(null);
    const [touchT, setTouchT] = useState(null);

    let orderedData = [];
    let draggedItemStyle = {
        position: "absolute",
        opacity: ".95",
        animation: "slideLeft 300ms forwards",
        top: offsetTop - relativeOffset + "px",
        transition: "0ms"
    }


    let hoveredItemStyle = {
        backgroundColor: "hsl(100,30%,80%)",
        margin
    }

    const reorderList = (dragged, draggedOn) => {
        setReorder([dragged, draggedOn]);
    }

    const handleDragOver = (e) => {
        const touchedTarget = e.touches ? getTouchedTarget(e).dataset.key : undefined;
        const key = parseInt(touchedTarget || e.target.dataset.key);
        if (typeof draggedItem === 'number' && !isNaN(key)) {
            reorderList(draggedItem, key);
            const target = e.target || touchedTarget;
            (touchedTarget !== undefined) && console.log(touchedTarget);
            setMargin((target.getBoundingClientRect().top <= offsetTop) ? "34px 0 1px 0" : "1px 0 34px 0")
            // TODO: handle mobile
        }
    }

    function getTouchedTarget(e) {
        const x = e.touches[0].pageX;
        const y = e.touches[0].pageY;
        const target = document.elementFromPoint(x, y);
        document.body.style.touchAction = "none"; // disable screen scrolling when dragging item on mobile
        return target.dataset ? target : undefined;
    }

    const handleDrop = () => {
        const droppedItem = reorder[1];
        setReorder([null, null]);
        setDraggedItem(null);

        // TODO: rewrite item placing

        newData.forEach((el, i) => {
            if (i >= reorder[1] && i !== reorder[0]) {
                el.order = i + 1;
            }
            if (i === reorder[0]) {
                el.order = reorder[0] > reorder[1] ? reorder[1] : reorder[1] + 2;
            }
            orderedData.push(el);
        });

        orderedData.sort((a, b) => a.order - b.order).forEach((el, i) => { el.order = i }); // sort by order, and recalculate new order values

        setNewData(orderedData);
        setDropped(droppedItem);
    }

    const handleMouseDown = (item, e) => {
        const yOffset = e.touches ? e.touches[0].pageY : e.pageY;
        setRelativeOffset(yOffset - e.target.getBoundingClientRect().top);
        setDraggedItem(item);
        setOffsetTop(yOffset - 1); // -1 because of item border
        setDropped(null);
    }

    useEffect(() => {
        window.addEventListener("mouseup", () => setDraggedItem(null));
        window.addEventListener("touchend", () => setDraggedItem(null));
        return () => {
            window.removeEventListener("mouseup", () => setDraggedItem(null));
            window.removeEventListener("touchend", () => setDraggedItem(null));
        }
    });
    useEffect(() => {
        const handleMouseMove = e => setOffsetTop((e.touches ? e.touches[0].pageY : e.pageY) - 1);

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleMouseMove);
        }
    });

    return (
        <ul className="list">
            {newData.map((el, i) => {
                return (
                    <React.Fragment key={i}>
                        <li
                            className={`list__item ${dropped === i ? 'slideRight' : ''} `}
                            style={draggedItem === i ?
                                draggedItemStyle : (draggedItem !== null && reorder[1] === i) ?
                                    hoveredItemStyle : undefined}
                            onMouseOver={handleDragOver}
                            onTouchMove={handleDragOver}
                            onMouseUp={handleDrop}
                            onTouchEnd={handleDrop}

                        >
                            <img className="list__item-icon" src={Icon} alt="icon" />
                            <div className="list__item-title">
                                <h1>{el.title}</h1>
                                <span>order: {el.order}</span>
                            </div>
                            <div
                                data-key={i}
                                className="list__item-grab"
                                onMouseDown={handleMouseDown.bind(this, i)}
                                onTouchStart={handleMouseDown.bind(this, i)}
                            >
                            </div>
                        </li>
                        {/* {((draggedItem && reorder[1] === i)) ? <li className="list__item dummy"></li> : undefined} */}
                    </React.Fragment>
                )
            })}
        </ul >
    )
}
export default List;