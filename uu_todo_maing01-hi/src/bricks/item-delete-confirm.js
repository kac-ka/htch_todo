//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponentWithRef, useRef, useImperativeHandle } from "uu5g04-hooks";
import Config from "./config/config";
import Lsi from "./item-delete-confirm.lsi";
import Css from "./list-delete-confirm.css";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemDeleteConfirm",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ItemDeleteConfirm = createVisualComponentWithRef({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onDelete: UU5.PropTypes.func.isRequired
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onDelete: () => {},
  },
  //@@viewOff:defaultProps

  render(props, ref) {

    const modalRef = useRef();
    const itemRef = useRef();

    useImperativeHandle(ref, () => ({
      open: item => {
        itemRef.current = item;
        modalRef.current.open({
          header: <UU5.Bricks.Lsi lsi={Lsi.header}/>,
          content: <UU5.Bricks.Lsi lsi={Lsi.content}/>,
          footer: renderButtons()
        });
      }
    }));

    //@@viewOn:private
    

    function handleCancel() {
      modalRef.current.close();
    }

    function handleDelete(){
      modalRef.current.close(true, () => {
        props.onDelete(itemRef.current);
      });
    }

    
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    function renderButtons(){
      return(
        <UU5.Bricks.Div className={Css.footer()}>
          <UU5.Bricks.Button onClick={handleCancel}><UU5.Bricks.Lsi lsi={Lsi.no}/></UU5.Bricks.Button>
          <UU5.Bricks.Button colorSchema="danger" onClick={handleDelete}><UU5.Bricks.Lsi lsi={Lsi.yes}/></UU5.Bricks.Button>
        </UU5.Bricks.Div>
      );
    }
    return <UU5.Bricks.Modal ref_={modalRef}/>
    //@@viewOff:render
  }
});

export default ItemDeleteConfirm;
