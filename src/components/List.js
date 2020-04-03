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

    let orderedData = [];
    let draggedItemStyle = {
        position: "absolute",
        opacity: ".95",
        animation: "slideLeft 300ms forwards",
        top: offsetTop - relativeOffset + "px",
        transition: "0ms"
    }

    let hoveredItemStyle = {
        margin
    }

    const reorderList = (dragged, draggedOn) => {
        setReorder([dragged, draggedOn]);
    }

    const handleDragOver = (e) => {
        const touchedTarget = e.touches ? getTouchedTarget(e) : undefined;
        const key = parseInt(e.touches ? touchedTarget.dataset.key : e.target.dataset.key);

        if (typeof draggedItem === 'number' && !isNaN(key)) {
            draggedItem !== key && reorderList(draggedItem, key);
            const itemOffset = e.touches ? (touchedTarget.dataset.key ? touchedTarget.getBoundingClientRect().top : 0) : e.target.getBoundingClientRect().top;
            setMargin((itemOffset <= offsetTop) ? "34px 0 1px 0" : "1px 0 34px 0");
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

        newData.forEach((el, i) => {
            if (i >= reorder[1] && i !== reorder[0]) {
                el.order = i + 1;
            }
            if (i === reorder[0]) {
                el.order = reorder[0] > reorder[1] ? reorder[1] : reorder[1] + 2;
            }
            orderedData.push(el);
        });

        setReorder([null, null]);
        setDraggedItem(null);
        setDropped(reorder[1]);

        orderedData.sort((a, b) => a.order - b.order).forEach((el, i) => { el.order = i }); // sort by order, and recalculate new order values
        setNewData(orderedData);
    }

    const handleMouseDown = (item, e) => {
        const yOffset = e.touches ? e.touches[0].pageY : e.pageY;
        setRelativeOffset(yOffset - e.target.getBoundingClientRect().top);
        setDraggedItem(item);
        setOffsetTop(yOffset - 2); // -2 because of item border 1px
        setDropped(null);
    }

    useEffect(() => {
        window.addEventListener("mouseup", () => {
            setDraggedItem(null);
            setMargin("1px 0 1px 0");
        });
        window.addEventListener("touchend", () => {
            setDraggedItem(null);
            setMargin("1px 0 1px 0");
        });
        return () => {
            window.removeEventListener("mouseup", () => setDraggedItem(null));
            window.removeEventListener("touchend", () => setDraggedItem(null));
        }
    });

    useEffect(() => {
        const handleMouseMove = e => {
            setOffsetTop((e.touches ? e.touches[0].pageY : e.pageY));
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("touchmove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("touchmove", handleMouseMove);
        }
    });

    return (
        <ul className="list"
            onMouseUp={handleDrop}
            onTouchEnd={handleDrop}>
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
                        {((draggedItem === i && reorder[0] === null)) ? <li className="list__item dummy"></li> : undefined}
                    </React.Fragment>
                )
            })}
        </ul >
    )
}
export default List;