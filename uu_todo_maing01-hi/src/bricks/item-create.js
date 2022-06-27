//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef } from "uu5g04-hooks";
import Config from "./config/config";
import Lsi from "./item-create.lsi";
import "uu5g04-forms";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemCreate",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ItemCreate = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onCreate: UU5.PropTypes.func.isRequired,
    selectedListId: UU5.PropTypes.string.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onCreate: () => {},
  },
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:private
    function handleSave(item) {
      props.onCreate({ listId: props.selectedListId, text: item.value });
    }

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render
    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Forms.ContextSection>
          <UU5.Forms.ContextForm onSave={handleSave}>
            <UU5.Bricks.Row>
              <UU5.Bricks.Column colWidth={{ xs: 12 }}>
                <UU5.Forms.TextButton
                  placeholder={Lsi.text}
                  name="text"
                  inputAttrs={{ maxLength: 255 }}
                  required
                  buttons={[
                    {
                      icon: "uu5-ok",
                      onClick: (opt) => {
                        handleSave(opt);
                      },
                    },
                  ]}
                />
              </UU5.Bricks.Column>
            </UU5.Bricks.Row>
          </UU5.Forms.ContextForm>
        </UU5.Forms.ContextSection>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default ItemCreate;
