//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef, useState } from "uu5g04-hooks";
import Item from "../bricks/item";
import List from "../bricks/list";
import Config from "./config/config";
import Lsi from "./todo.lsi";
import ItemProvider from "../context/item-provider";
import ListProvider from "../context/list-provider";
import ItemList from "../bricks/item-list";
import ListMenu from "../bricks/list-menu";
import ItemCreate from "../bricks/item-create";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "Todo",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const Todo = createVisualComponent({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {},
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {},
  //@@viewOff:defaultProps

  render(props) {
    //@@viewOn:hooks
    const createListRef = useRef();
    const deleteListRef = useRef();
    const updateListRef = useRef();
    const listListRef = useRef();  

    const createItemRef = useRef();
    const deleteItemRef = useRef();
    const getItemRef = useRef();
    const setFinalStateItemRef = useRef();
    const updateItemRef = useRef();
    const listItemRef = useRef();

    const[selectedList, setSelectedList] = useState();
    const[itemList, setItemList] = useState(null);
    //@viewOff:hooks

    //@@viewOn:private

    function showError(lsi, params) {
      UU5.Environment.getPage()
        .getAlertBus()
        .addAlert({
          content: <UU5.Bricks.Lsi lsi={lsi} params={params} />,
          colorSchema: "red"
        });
    }

    async function handleListItem(item){
      setSelectedList(item.id);
      let data = await listItemRef.current({listId: item.id});
      if (data.itemList.length > 0){
        setItemList(data.itemList);
      } else {
        setItemList([]);
      }
    }

    async function handleItemCreate(item){
      let newItem = {};
      try {
        newItem = await createItemRef.current(item);
      } catch (error) {
        showError(Lsi.createFailed, [item.text]);
      }

      if (itemList !== null && newItem.id !== undefined){
        setItemList([newItem, ...itemList]);
      }
      else if (newItem.id !== undefined){
        setItemList([{newItem}]);
      }
    }

    async function handleItemUpdate(item){
      let newItem ={};
      try {
        newItem = await updateItemRef.current(item);
      } catch (error) {
        showError(Lsi.updateFailed, [item.id]);
      }

      if (itemList !== null && newItem.id !== undefined){
        setItemList([newItem, ...itemList.filter(i => i.id !== item.id)]);
      }
      
    }

    async function handleItemDelete(item){
      try {
        await deleteItemRef.current({id: item.id});
      } catch (error) {
        showError(Lsi.deleteFailed, [item.id]);
      }

      if (itemList !== null){
        setItemList([...itemList.filter(i => i.id !== item.id)]);
      }
    }

    async function handleItemSetState(item){
      let newItem ={};
      try {
        newItem = await setFinalStateItemRef.current(item);
      } catch (error) {
        showError(Lsi.setStateFailed, [item.id]);
      }

      if (itemList !== null && newItem.id !== undefined){
        setItemList([newItem, ...itemList.filter(i => i.id !== item.id)]);
      }
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    function renderLoad() {
      return <UU5.Bricks.Loading />;
    }

    function renderReadyList(lists) {
      return (
        <>
        <UU5.Bricks.Column colWidth={{xs: 3}}>
          <ListMenu lists={lists} onClick={handleListItem} />
        </UU5.Bricks.Column>   
        </>
      );
    }

    function renderReadyItem(items) {
      return (
        <>
          <UU5.Bricks.Column colWidth={{xs: 9}}>
            <ItemCreate onCreate={handleItemCreate} selectedListId={selectedList}/>
            <ItemList items={items} onUpdate={handleItemUpdate} onDelete={handleItemDelete} onSetState={handleItemSetState}/>
          </UU5.Bricks.Column>
        </>
      );
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return <UU5.Bricks.Error content="Error happened!" error={errorData.error} errorData={errorData.data} />;
      }
    }

    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(
      props,
      STATICS
    );

    return currentNestingLevel ? (
      <div {...attrs}>
        <UU5.Bricks.Row>
          <ListProvider>
            {({ state, data, newData, errorData, pendingData, handlerMap }) => {
              createListRef.current = handlerMap.createList;
              deleteListRef.current = handlerMap.deleteList;
              updateListRef.current = handlerMap.updateList;
              listListRef.current = handlerMap.listList;

              switch (state) {
                case "pending":
                case "pendingNoData":
                  return renderLoad();
                case "error":
                case "errorNoData":
                  return renderError(errorData);
                case "itemPending":
                case "ready":
                case "readyNoData":
                default:
                  return renderReadyList(data);
              }
            }}
          </ListProvider>
          
          <ItemProvider>
            {({ state, data, newData, errorData, pendingData, handlerMap }) => {
              createItemRef.current = handlerMap.createItem;
              deleteItemRef.current = handlerMap.deleteItem;
              getItemRef.current = handlerMap.getItem;
              setFinalStateItemRef.current = handlerMap.setFinalStateItem;
              updateItemRef.current = handlerMap.updateItem;
              listItemRef.current = handlerMap.listItem;
              
              const dataToRender = data && data.filter(d => d !== undefined);

              switch (state) {
                case "pending":
                case "pendingNoData":
                  return renderLoad();
                case "error":
                case "errorNoData":
                  return renderError(errorData);
                case "itemPending":
                case "ready":
                case "readyNoData":
                default:
                  return renderReadyItem(itemList === null ? dataToRender.map(d => d.data) : itemList);
              }
            }}
          </ItemProvider>
        </UU5.Bricks.Row>
      </div>
    ) : null;
    //@@viewOff:render
  },
});

export default Todo;
