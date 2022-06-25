//@@viewOn:imports
import UU5 from "uu5g04";
import { createComponent, useDataList } from "uu5g04-hooks";
import Config from "./config/config";
import Calls from "calls";
//@@viewOff:imports

const ListDataContext = UU5.Common.Context.create();

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListProvider",
  //@@viewOff:statics
};

export const ListProvider = createComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render({children}) {
    //@@viewOn:private
    const itemListResult = useDataList({
      pageSize: 5, 
      handlerMap: {
        load: (dtoIn) => Calls.listList(dtoIn),
        createList: (dtoIn) => Calls.createList(dtoIn),
        deleteList: (dtoIn) => Calls.deleteList(dtoIn),
        updateList: (dtoIn) => Calls.updateList(dtoIn),
        // load: Calls.listItem,
        // createList: Calls.createList,
        // updateList: Calls.updateList,
        // deleteList: Calls.deleteList
      },
   });

   let {state, data, newData, errorData, pendingData, handlerMap} = itemListResult;
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
      handlerMap
    });
    //<ListDataContext.Provider>{children}</ListDataContext.Provider>

    //@@viewOff:render
  },
});

export default ListProvider;
// export {ListDataContext};
