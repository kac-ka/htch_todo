//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Uu5Tiles from "uu5tilesg02";
import Config from "./config/config";
import Item from "./item";
import Lsi from "../config/lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemList",
  //@@viewOff:statics
};

export const ItemList = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array.isRequired,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
    onSetState: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    items: [],
    onUpdate: () => {},
    onDelete: () => {},
    onSetState: () => {}
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
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

    if (props.items.length === 0) {
      return <UU5.Common.Error content={<UU5.Bricks.Lsi lsi={Lsi.todo.itemList.noItem}/>} />;
    }

    return currentNestingLevel ? (
      <div {...attrs}>
        <Uu5Tiles.ControllerProvider data={props.items}>
          <Uu5Tiles.Grid tileHeight={"auto"} rowSpacing={5} height={"100%"} passAllTileProps>
            <Item onDelete={props.onDelete} onUpdate={props.onUpdate} onSetState={props.onSetState}/>
          </Uu5Tiles.Grid>
        </Uu5Tiles.ControllerProvider>

      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ItemList;
