//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
import ItemProvider from "../context/item-provider";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "List",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

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
    onClick: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    list: null,
    onClick: () => {}
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function handleClick(){
      props.onClick(props.list)
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

    return currentNestingLevel ? (
      <div {...attrs}>
        <>
        {/* <UU5.Bricks.Row>
          <UU5.Bricks.Column onClick={{}} colWidth={{xs: 9}}>
            <p>list name: {props.list.name}</p>
          </UU5.Bricks.Column>
          <UU5.Bricks.Column colWidth={{xs: 3}}>
            <UU5.Bricks.Button><UU5.Bricks.Icon icon="plus4u5-pencil"/></UU5.Bricks.Button>
            <UU5.Bricks.Button><UU5.Bricks.Icon icon="plus4u5-trash-can"/></UU5.Bricks.Button>
          </UU5.Bricks.Column>
        </UU5.Bricks.Row> */}
        <UU5.Bricks.Button onClick={handleClick} colorSchema="blue" bgStyle="transparent" displayBlock>
          <p>list name: {props.list.name}</p>
          <UU5.Bricks.Div><UU5.Bricks.Icon icon="plus4u5-pencil"/></UU5.Bricks.Div>
          <UU5.Bricks.Div><UU5.Bricks.Icon icon="plus4u5-trash-can"/></UU5.Bricks.Div>
        </UU5.Bricks.Button>
        </>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default List;
