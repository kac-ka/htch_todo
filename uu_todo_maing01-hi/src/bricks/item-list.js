//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent } from "uu5g04-hooks";
import Uu5Tiles from "uu5tilesg02";
import Config from "./config/config";
import Item from "./item";
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
    items: UU5.PropTypes.array.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    items: []
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
      return <UU5.Common.Error content="No item!" />;
    }

    return currentNestingLevel ? (
      <div {...attrs}>
        {/* <UU5.Bricks.Row>
          {props.items.map(item => {
            if (!item) return null;

            return (
              <UU5.Bricks.Column key={item.data.id} colWidth="xs-12 m-6 l-4 xl-3">
                <Item item={item.data} />
              </UU5.Bricks.Column>
            );
          })}
        </UU5.Bricks.Row> */}
        <Uu5Tiles.ControllerProvider data={props.items}>
          <Uu5Tiles.Grid tileHeight={"auto"} rowSpacing={5} height={250} passAllTileProps>
            <Item />
          </Uu5Tiles.Grid>
        </Uu5Tiles.ControllerProvider>

      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ItemList;
