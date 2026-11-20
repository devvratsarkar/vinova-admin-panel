import React from "react";
import Select, { components } from "react-select";
import CreatableSelect from "react-select/creatable";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

/**
 * Custom ValueContainer that wraps multi-values in a Droppable area
 * and each MultiValue in a Draggable for reordering.
 */
const ValueContainer = ({ children, getValue, setValue, selectProps, ...props }) => {
    const childArray = React.Children.toArray(children);
    const input = childArray[childArray.length - 1];
    const multiValues = childArray.slice(0, -1);

    const onDragEnd = (result) => {
        if (!result.destination) return;
        const currentValues = getValue();
        if (!Array.isArray(currentValues) || currentValues.length === 0) return;

        const reordered = Array.from(currentValues);
        const [removed] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, removed);

        setValue(reordered, "set-value");
    };

    if (!selectProps.isMulti || multiValues.length <= 1) {
        return (
            <components.ValueContainer getValue={getValue} setValue={setValue} selectProps={selectProps} {...props}>
                {children}
            </components.ValueContainer>
        );
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="react-select-value-container" direction="horizontal">
                {(provided) => (
                    <components.ValueContainer
                        getValue={getValue}
                        setValue={setValue}
                        selectProps={selectProps}
                        {...props}
                    >
                        <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px", minHeight: "38px" }}
                        >
                            {multiValues.map((child, index) => {
                                const selectedOption = getValue()[index];
                                const draggableId = selectedOption?.value ?? `multi-value-${index}`;
                                return (
                                <Draggable key={draggableId} draggableId={String(draggableId)} index={index}>
                                    {(dragProvided) => (
                                        <div
                                            ref={dragProvided.innerRef}
                                            {...dragProvided.draggableProps}
                                            {...dragProvided.dragHandleProps}
                                            style={{
                                                ...dragProvided.draggableProps.style,
                                                display: "inline-flex",
                                            }}
                                        >
                                            {child}
                                        </div>
                                    )}
                                </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                        {input}
                    </components.ValueContainer>
                )}
            </Droppable>
        </DragDropContext>
    );
};

/**
 * SelectWithDragDrop - A react-select wrapper with drag-and-drop reordering for multi-select values.
 * Use as a drop-in replacement for Select when isMulti is true and order matters.
 *
 * Usage:
 *   <SelectWithDragDrop
 *     isMulti
 *     options={options}
 *     value={value}
 *     onChange={onChange}
 *     {...otherSelectProps}
 *   />
 */
const sharedComponents = {
    ValueContainer: (valueContainerProps) => <ValueContainer {...valueContainerProps} />,
};

const SelectWithDragDrop = ({ creatable = false, styles: userStyles, ...props }) => {
    const BaseSelect = creatable ? CreatableSelect : Select;
    return (
        <BaseSelect
            {...props}
            menuPortalTarget={document.body}
            menuPosition="fixed"
            styles={{
                menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                ...userStyles,
            }}
            components={{
                ...props.components,
                ...sharedComponents,
            }}
        />
    );
};

export default SelectWithDragDrop;
