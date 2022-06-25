//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef, useState } from "uu5g04-hooks";
import Item from "../bricks/item";
import List from "../bricks/list";
import Config from "./config/config";
import ItemProvider from "../context/item-provider";
import ListProvider from "../context/list-provider";
import ItemList from "../bricks/item-list";
import ListMenu from "../bricks/list-menu";
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

    const[itemList, setItemList] = useState(null);
    //@viewOff:hooks

    //@@viewOn:private
    async function handleListItem(item){
      let data = await listItemRef.current({listId: item.id});
      setItemList(data.itemList);
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
        
        {/* <p>{lists.map((d => <p>{JSON.stringify(d.data.name)}</p>))}</p> */}
        <UU5.Bricks.Column colWidth={{xs: 3}}>
          <ListMenu lists={lists} onClick={handleListItem} />
        </UU5.Bricks.Column>
        </>
      );
    }

    function renderReadyItem(items) {
      return (
        <>
        {/* <p>{items.map((d => <p>{JSON.stringify(d.data.text)}</p>))}</p> */}
          {/*
          {() => {
            <Item></Item>
            }}
           <JokesTitle jokes={jokes} />
          <JokeCreate onCreate={handleCreateJoke} /> */}
          <UU5.Bricks.Column colWidth={{xs: 9}}>
            <ItemList items={items}  />
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
              deleteItemRef.current = handlerMap.deletItem;
              getItemRef.current = handlerMap.getItem;
              setFinalStateItemRef.current = handlerMap.setFinalStateItem;
              updateItemRef.current = handlerMap.updateItem;
              listItemRef.current = handlerMap.listItem;

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
                  return renderReadyItem(itemList === null ? data.map(d => d.data) : itemList);
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
