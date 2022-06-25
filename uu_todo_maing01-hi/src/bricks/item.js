//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef } from "uu5g04-hooks";
import Config from "./config/config";
import ItemProvider from "../context/item-provider";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Item",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

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
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    item: null
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

    if(!props.data) {
      return "no data";
    }

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Row>
          <UU5.Bricks.Column colWidth={{xs:9}}>
            <UU5.Bricks.Div>text: {props.data.text};</UU5.Bricks.Div><UU5.Bricks.Div> listId: {props.data.listId}</UU5.Bricks.Div>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth={{xs:3}}>
          <UU5.Bricks.Button><UU5.Bricks.Icon icon="plus4u5-pencil"/></UU5.Bricks.Button>
            <UU5.Bricks.Button><UU5.Bricks.Icon icon="plus4u5-trash-can"/></UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Row>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default Item;
