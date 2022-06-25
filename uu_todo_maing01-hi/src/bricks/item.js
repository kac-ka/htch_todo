//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef, useState } from "uu5g04-hooks";
import Config from "./config/config";
import "uu5g04-forms";
import ItemProvider from "../context/item-provider";
import Css from "./item.css";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Item",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

const Mode = {
  READ: "READ",
  EDIT: "EDIT"
}

export const Item = createVisualComponent({
  ...STATICS,

  

  //@@viewOn:propTypes
  propTypes: {
    item: UU5.PropTypes.shape({
      id: UU5.PropTypes.string.isRequired,
      listId: UU5.PropTypes.string.isRequired,
      text: UU5.PropTypes.string.isRequired,
      highPriority: UU5.PropTypes.bool
    }),
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
    onSetState: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    item: null,
    onUpdate: () => {},
    onDelete: () => {},
    onSetState: () => {}
  },
  //@@viewOff:defaultProps

  render(props) {

    const [mode, setMode] = useState(Mode.READ);

    //@@viewOn:private
    function handleEditClick() {
      setMode(Mode.EDIT);
    }

    function handleUpdate(item) {
      item.values.id = props.data.id;
      props.onUpdate(item.values);
      setMode(Mode.READ);
    }

    function handleDelete(button) {
      props.onDelete({id: props.data.id});
      setMode(Mode.READ);
    }

    function handleCancel(){
      setMode(Mode.READ);
    }

    function handleSetCompleted(){
      props.onSetState({id: props.data.id, state: "completed"})
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
      props,
      STATICS
    );

    if(!props.data) {
      return "no data";
    }

    function renderItem(){
      if (mode === Mode.READ){
        return (<UU5.Bricks.Row>
          <UU5.Bricks.Column colWidth={{xs:9}}>
            <UU5.Bricks.Div className={Css.itemDiv()}>
              <UU5.Forms.Checkbox value={props.data.state !== "active"} onChange={handleSetCompleted} bgStyleChecked="filled" size="l" colorSchema="green" />
              {props.data.text}
            </UU5.Bricks.Div>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth={{xs:3}}>
            <UU5.Bricks.Button disabled={props.data.state !== "active"} onClick={handleEditClick}><UU5.Bricks.Icon icon="plus4u5-pencil"/></UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
        )
      } else {
        return(
        <UU5.Forms.ContextSection>
          <UU5.Forms.ContextForm onSave={handleUpdate} onCancel={handleCancel}>
            <UU5.Bricks.Row>
              <UU5.Bricks.Column colWidth={{xs: 9}}>
                <UU5.Forms.Text placeholder="insert new item text" value={props.data.text} name="text" inputAttrs={{ maxLength: 255 }} required  />
              </UU5.Bricks.Column>
              <UU5.Bricks.Column colWidth={{xs: 3}}>
                <UU5.Forms.ContextControls align = "left"
                  buttonCancelProps={{ content: <UU5.Bricks.Icon icon="uu5-cross" />, size: "s"}}
                  buttonSubmitProps={{ content: <UU5.Bricks.Icon icon="uu5-ok" />, size: "s"}}
                />
                <UU5.Bricks.Button onClick={handleDelete}><UU5.Bricks.Icon icon="plus4u5-trash-can"/></UU5.Bricks.Button>
              </UU5.Bricks.Column>
            </UU5.Bricks.Row>
          </UU5.Forms.ContextForm>
        </UU5.Forms.ContextSection>
        )
      }
    }

    return currentNestingLevel ? (
      <>
        {renderItem()}
      </>
    ) : null;
    //@@viewOff:render
  },
});

export default Item;
