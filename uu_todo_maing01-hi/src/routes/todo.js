//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponent, useRef, useState } from "uu5g04-hooks";
import Config from "./config/config";
import Lsi from "./todo.lsi";
import ConLsi from "../config/lsi";
import Css from "./todo.css";
import ItemProvider from "../context/item-provider";
import ListProvider from "../context/list-provider";
import ItemList from "../bricks/item-list";
import ListMenu from "../bricks/list-menu";
import ItemCreate from "../bricks/item-create";
import ListCreateForm from "../bricks/list-create-form";
import ListDeleteConfirm from "../bricks/list-delete-confirm";
import ItemDeleteConfirm from "../bricks/item-delete-confirm";
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

    const [selectedListId, setSelectedIdList] = useState();
    const [itemList, setItemList] = useState(null);
    const [listList, setListList] = useState(null);

    const createModalRef = useRef();
    const listDeleteConfirmRef = useRef();
    const itemDeleteConfirmRef = useRef();
    //@viewOff:hooks

    //@@viewOn:private

    function showError(lsi, params) {
      UU5.Environment.getPage()
        .getAlertBus()
        .addAlert({
          content: <UU5.Bricks.Lsi lsi={lsi} params={params} />,
          colorSchema: "red",
        });
    }

    function showErrorByCode(code, params) {
      switch (code) {
        case "uu-todo-main/list/delete/listContainsActiveItems":
          showError(Lsi.noDeleteWithActiveItems, [params]);
          break;
        case "uu-todo-main/item/setFinalState/itemIsNotInProperState":
          showError(Lsi.itemBadState, [params]);
      }
    }

    async function handleListItem(item) {
      setSelectedIdList(item.id);
      let data = await listItemRef.current({ listId: item.id });
      if (data.itemList.length > 0) {
        setItemList(data.itemList);
      } else {
        setItemList([]);
      }
    }

    async function handleListCreate(list) {
      let tmpList = {};
      tmpList.name = list.name;
      if (list.deadline) {
        tmpList.deadline = list.deadline;
      }
      if (list.description) {
        tmpList.description = list.description;
      }
      let newItem = {};
      try {
        newItem = await createListRef.current(tmpList);

        if (listList !== null && newItem.id !== undefined) {
          setListList([newItem, ...listList]);
        } else if (newItem.id !== undefined) {
          setListList([{ newItem }]);
        }
      } catch (error) {
        console.log(error);
        showError(Lsi.createListFailed, [list.name]);
      }
    }

    async function handleListUpdate(list) {
      let newItem = {};
      try {
        newItem = await updateListRef.current(list);
        if (listList !== null && newItem.id !== undefined) {
          setListList([newItem, ...listList.filter((l) => l.id !== list.id)]);
        }
      } catch (error) {
        console.log(error);
        showError(Lsi.updateListFailed, [list.oldName]);
      }
    }

    async function handleListDelete(list, forceDelete) {
      try {
        await deleteListRef.current({ id: list.id, forceDelete: forceDelete });
        if (listList !== null) {
          setListList([...listList.filter((l) => l.id !== list.id)]);
        }
      } catch (error) {
        showErrorByCode(error.code, list.name);
      }
    }

    async function handleItemCreate(item) {
      let newItem = {};
      try {
        newItem = await createItemRef.current(item);
      } catch (error) {
        showError(Lsi.createFailed, [item.text]);
      }

      if (itemList !== null && newItem.id !== undefined) {
        setItemList([newItem, ...itemList]);
      } else if (newItem.id !== undefined) {
        setItemList([{ newItem }]);
      }
    }

    async function handleItemUpdate(item) {
      let newItem = {};
      try {
        newItem = await updateItemRef.current(item);
      } catch (error) {
        showError(Lsi.updateFailed, [item.oldText]);
      }

      if (itemList !== null && newItem.id !== undefined) {
        setItemList([newItem, ...itemList.filter((i) => i.id !== item.id)]);
      }
    }

    async function handleItemDelete(item) {
      try {
        await deleteItemRef.current({ id: item.id });
      } catch (error) {
        showError(Lsi.deleteFailed, [item.text]);
      }

      if (itemList !== null) {
        setItemList([...itemList.filter((i) => i.id !== item.id)]);
      }
    }

    async function handleItemSetState(item) {
      let newItem = {};
      try {
        newItem = await setFinalStateItemRef.current(item);
      } catch (error) {
        showErrorByCode(error.code, item.text);
      }

      if (itemList !== null && newItem.id !== undefined) {
        setItemList([newItem, ...itemList.filter((i) => i.id !== item.id)]);
      }
    }

    function openDeleteListConfirm(list) {
      listDeleteConfirmRef.current.open(list);
    }

    function openDeleteItemConfirm(item) {
      itemDeleteConfirmRef.current.open(item);
    }
    //@@viewOff:private

    //@@viewOn:interface
    //@@viewOff:interface

    //@@viewOn:render

    function renderLoad() {
      return <UU5.Bricks.Loading />;
    }

    function renderReadyList(lists) {
      if (selectedListId === undefined) {
        let firstListId = lists[0].id;
        setSelectedIdList(firstListId);
      }

      if (listList === null) {
        setListList(lists);
      }

      return (
        <>
          <UU5.Bricks.Column className={Css.listListColumn()} colWidth={{ xs: 3 }}>
            <ListMenu
              lists={lists}
              onClick={handleListItem}
              onUpdate={handleListUpdate}
              onDelete={openDeleteListConfirm}
              selectedListId={selectedListId}
            />
            <hr className={Css.hr()} />
            <UU5.Bricks.Button
              className={Css.createButton()}
              onClick={OpenCreateModal}
              bgStyle="transparent"
              colorSchema="blue"
              size="l"
              displayBlock
            >
              <UU5.Bricks.Icon icon="uu5-plus" />
              <UU5.Bricks.Lsi lsi={ConLsi.todo.addList} />
            </UU5.Bricks.Button>
          </UU5.Bricks.Column>
          <ListCreateForm ref={createModalRef} onSave={handleListCreate} />
          <ListDeleteConfirm ref={listDeleteConfirmRef} onDelete={handleListDelete} />
        </>
      );
    }

    function renderReadyItem(items) {
      return (
        <>
          <UU5.Bricks.Column className={Css.itemListColumn()} colWidth={{ xs: 9 }}>
            <ItemCreate className={Css.itemCreate()} onCreate={handleItemCreate} selectedListId={selectedListId} />
            <ItemList
              items={items}
              onUpdate={handleItemUpdate}
              onDelete={openDeleteItemConfirm}
              onSetState={handleItemSetState}
            />
          </UU5.Bricks.Column>
          <ItemDeleteConfirm ref={itemDeleteConfirmRef} onDelete={handleItemDelete} />
        </>
      );
    }

    function renderError(errorData) {
      switch (errorData.operation) {
        case "load":
        case "loadNext":
        default:
          return (
            <UU5.Bricks.Error
              content={<UU5.Bricks.Lsi lsi={ConLsi.todo.errorHappend} />}
              error={errorData.error}
              errorData={errorData.data}
            />
          );
      }
    }

    function OpenCreateModal(item) {
      createModalRef.current.open(item);
    }

    const className = Config.Css.css``;
    const attrs = UU5.Common.VisualComponent.getAttrs(props, className);
    const currentNestingLevel = UU5.Utils.NestingLevel.getNestingLevel(props, STATICS);

    return currentNestingLevel ? (
      <div {...attrs} className={Css.h100p()}>
        <UU5.Bricks.Row className={Css.h100p()}>
          <ListProvider>
            {({ state, data, newData, errorData, pendingData, handlerMap }) => {
              createListRef.current = handlerMap.createList;
              deleteListRef.current = handlerMap.deleteList;
              updateListRef.current = handlerMap.updateList;
              listListRef.current = handlerMap.listList;

              const dataToRender = data && data.filter((d) => d !== undefined);

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
                  return renderReadyList(listList === null ? dataToRender.map((d) => d.data) : listList);
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

              const dataToRender = data && data.filter((d) => d !== undefined);

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
                  return renderReadyItem(itemList === null ? dataToRender.map((d) => d.data) : itemList);
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
