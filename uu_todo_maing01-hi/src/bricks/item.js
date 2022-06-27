//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef, useState } from "uu5g04-hooks";
import Config from "./config/config";
import "uu5g04-forms";
import ItemProvider from "../context/item-provider";
import Css from "./item.css";
import Lsi from "../config/lsi";
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
      props.onUpdate({id: props.data.id, text: item.value, oldText: props.data.text });
      setMode(Mode.READ);
    }

    function handleDelete(item) {
      props.onDelete({id: props.data.id, text: props.data.text});
      setMode(Mode.READ);
    }

    function handleCancel(item){
      setMode(Mode.READ);
    }

    function handleSetCompleted(){
      props.onSetState({id: props.data.id, state: "completed", text: props.data.text})
    }

    let isActive = props.data.state !== "active";
    const dynamicCss = {
      strike: isActive ? "line-through" : "none",
      color: isActive ? "#888888" : "black"
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
        return (
        <UU5.Bricks.Row className={Css.itemDiv()}>
          <UU5.Bricks.Div className={Css.item()} >
            <UU5.Forms.Checkbox className={Css.stateCheck()} value={props.data.state !== "active"} onChange={handleSetCompleted} bgStyleChecked="filled" size="m" colorSchema="grey" />
            <UU5.Bricks.Div className={Css.itemText(dynamicCss)}>{props.data.text}</UU5.Bricks.Div>
          </UU5.Bricks.Div>
          <UU5.Bricks.Div>
            <UU5.Bricks.Button bgStyle="transparent" disabled={props.data.state !== "active"} onClick={handleEditClick}><UU5.Bricks.Icon icon="plus4u5-pencil"/></UU5.Bricks.Button>
          </UU5.Bricks.Div>
        </UU5.Bricks.Row>
        )
      } else {
        return(
            <UU5.Bricks.Row>
              <UU5.Bricks.Column colWidth={{xs: 12}}>
                <UU5.Forms.TextButton
                  placeholder={<UU5.Bricks.Lsi lsi={Lsi.todo.item.textPlaceholder}/>}
                  value={props.data.text}
                  name="text"
                  inputAttrs={{ maxLength: 255 }}
                  buttons={[{
                      icon: "uu5-cross",
                      onClick: (opt) => {handleCancel(opt)}
                    },{
                      icon: "uu5-ok",
                      onClick: (opt) => {handleUpdate(opt)}
                    },{
                      icon: "plus4u5-trash-can",
                      onClick: (opt) => {handleDelete(opt)}
                    }
                  ]}
                  required
                />
              </UU5.Bricks.Column>
            </UU5.Bricks.Row>
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
