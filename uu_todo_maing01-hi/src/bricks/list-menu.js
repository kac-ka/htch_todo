//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent } from "uu5g04-hooks";
import Config from "./config/config";
import List from "./list";
import Lsi from "../config/lsi";
import Css from "./list-menu.css";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListMenu",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ListMenu = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    items: UU5.PropTypes.array.isRequired,
    selectedListId: UU5.PropTypes.string,
    onClick: UU5.PropTypes.func,
    onUpdate: UU5.PropTypes.func,
    onDelete: UU5.PropTypes.func,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    items: [],
    onClick: () => {},
    onDelete: () => {},
    onUpdate: () => {},
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
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    if (props.lists.length === 0) {
      return <UU5.Common.Error content={<UU5.Bricks.Lsi lsi={Lsi.todo.itemList.noItem} />} />;
    }

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Row>
          {props.lists.map((list) => {
            if (!list) return null;
            let isListSelected = list.id === props.selectedListId;

            return (
              <UU5.Bricks.Column key={list.id} className={Css.p0()}>
                <List
                  list={list}
                  onClick={props.onClick}
                  isActive={isListSelected}
                  onUpdate={props.onUpdate}
                  onDelete={props.onDelete}
                />
              </UU5.Bricks.Column>
            );
          })}
        </UU5.Bricks.Row>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ListMenu;
