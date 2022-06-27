//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent, useDataList } from "uu5g04-hooks";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

// const ItemDataContext = UU5.Common.Context.create();

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ItemProvider",
  //@@viewOff:statics
};

export const ItemProvider = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({ children }) {
    //@@viewOn:private
    let itemListResult = useDataList({
      pageSize: 20,
      handlerMap: {
        load: (dtoIn) => Calls.listItem(dtoIn),
        createItem: (dtoIn) => Calls.createItem(dtoIn),
        deleteItem: (dtoIn) => Calls.deleteItem(dtoIn),
        setFinalStateItem: (dtoIn) => Calls.setFinalStateItem(dtoIn),
        updateItem: (dtoIn) => Calls.updateItem(dtoIn),
        listItem: (dtoIn) => Calls.listItem(dtoIn),
      },
    });

    let { state, data, newData, errorData, pendingData, handlerMap } = itemListResult;
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    return children({
      state,
      data,
      newData,
      errorData,
      pendingData,
      handlerMap,
    });
    //@@viewOff:render
  },
});

export default ItemProvider;
// export {ItemDataContext};
