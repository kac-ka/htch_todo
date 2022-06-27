//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useState } from "uu5g04-hooks";
import Config from "./config/config";
import ItemProvider from "../context/item-provider";
import Css from "./list.css";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

const Mode = {
  READ: "READ",
  EDIT: "EDIT"
}

export const List = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    list: UU5.PropTypes.shape({
      id: UU5.PropTypes.string.isRequired,
      name: UU5.PropTypes.string.isRequired,
      description: UU5.PropTypes.string,
      deadline: UU5.PropTypes.string      
    }),
    onClick: UU5.PropTypes.func,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
    isActive: UU5.PropTypes.bool
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    list: null,
    onClick: () => {},
    onUpdate: () => {},
    onDelete: () => {},
    isActive: false
  },
  //@@viewOff:defaultProps

  render(props) {

    const [mode, setMode] = useState(Mode.READ);

    //@@viewOn:private
    function handleClick(){
      props.onClick(props.list)
    }

    function handleUpdate(listName){
      props.onUpdate({id: props.list.id, name: listName.value, oldName: props.list.name});
      setMode(Mode.READ);
    }

    function handleDelete(listName){
      props.onDelete({id: props.list.id, name: listName.value});
      setMode(Mode.READ);
    }

    function handleEditClick(){
      setMode(Mode.EDIT);
    }

    const dynamicCss ={
      bgcolor: props.isActive ? "#2196F3" : "white",
      color: props.isActive ? "white" : "black"
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

    function renderList(){
      if (mode == Mode.READ){
        return (
          <div onClick={handleClick} className={Css.listDiv(dynamicCss)}>
            <div>{props.list.name}</div>
            <div>
              <UU5.Bricks.Button onClick={handleEditClick} bgStyle = "transparent" colorSchema = "white"><UU5.Bricks.Icon icon="plus4u5-pencil"/></UU5.Bricks.Button>
            </div>
          </div>
        );
      }
      else{
        return (
          <div className={Css.listDiv(dynamicCss)}>
            <UU5.Forms.TextButton
              placeholder={<UU5.Bricks.Lsi lsi={Lsi.todo.list.textPlaceholder}/>}
              value={props.list.name}
              name="name"
              inputAttrs={{ maxLength: 255 }}
              buttons={[{
                  icon: "uu5-ok",
                  onClick: (opt) => {handleUpdate(opt)}
                },{
                  icon: "plus4u5-trash-can",
                  onClick: (opt) => {handleDelete(opt)}
                }
              ]}
              required
            />
          </div>
        );
      }
    }

    return (
      <>
      {renderList()}
      </>
    );
    //@@viewOff:render
  },
});

export default List;
