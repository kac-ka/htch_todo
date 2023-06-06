//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponentWithRef, useRef, useImperativeHandle } from "uu5g04-hooks";
import Config from "./config/config";
import Lsi from "./list-delete-confirm.lsi";
import Css from "./list-delete-confirm.css";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListDeleteConfirm",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ListDeleteConfirm = createVisualComponentWithRef({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onDelete: UU5.PropTypes.func.isRequired,
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onDelete: () => {},
  },
  //@@viewOff:defaultProps

  render(props, ref) {
    const modalRef = useRef();
    const listRef = useRef();

    useImperativeHandle(ref, () => ({
      open: (list) => {
        listRef.current = list;
        modalRef.current.open({
          header: <UU5.Bricks.Lsi lsi={Lsi.header} />,
          content: <UU5.Bricks.Lsi lsi={Lsi.content} />,
          footer: renderButtons(),
        });
      },
    }));

    //@@viewOn:private

    function handleCancel() {
      modalRef.current.close();
    }

    function handleDelete(forceDelete) {
      modalRef.current.close(true, () => {
        props.onDelete(listRef.current, forceDelete);
      });
    }

    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    function renderButtons() {
      return (
        <UU5.Bricks.Div className={Css.footer()}>
          <UU5.Bricks.Button onClick={handleCancel}>
            <UU5.Bricks.Lsi lsi={Lsi.cancel} />
          </UU5.Bricks.Button>
          <UU5.Bricks.Button colorSchema="danger" onClick={() => handleDelete(true)} icon="plus4u5-trash-can">
            <UU5.Bricks.Lsi lsi={Lsi.forceDelete} />
          </UU5.Bricks.Button>
          <UU5.Bricks.Button colorSchema="danger" onClick={() => handleDelete(false)} icon="plus4u5-trash-can">
            <UU5.Bricks.Lsi lsi={Lsi.delete} />
          </UU5.Bricks.Button>
        </UU5.Bricks.Div>
      );
    }
    return <UU5.Bricks.Modal ref_={modalRef} />;
    //@@viewOff:render
  },
});

export default ListDeleteConfirm;
