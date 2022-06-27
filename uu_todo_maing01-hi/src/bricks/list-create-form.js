//@@viewOn:imports
import UU5 from "uu5g04";
import { createVisualComponentWithRef, useRef, useImperativeHandle } from "uu5g04-hooks";
import Config from "./config/config";
import Lsi from "./list-create-form.lsi";
//@@viewOff:imports

const STATICS = {
  //@@viewOn:statics
  displayName: Config.TAG + "ListCreateForm",
  nestingLevel: "bigBoxCollection",
  //@@viewOff:statics
};

export const ListCreateForm = createVisualComponentWithRef({
  ...STATICS,

  //@@viewOn:propTypes
  propTypes: {
    onSave: UU5.PropTypes.func
  },
  //@@viewOff:propTypes

  //@@viewOn:defaultProps
  defaultProps: {
    onSave: ()=>{}
  },
  //@@viewOff:defaultProps

  render(props, ref) {

    const listRef = useRef();
    const modalRef = useRef();
    useImperativeHandle(ref, () => ({
      open: list => {
        listRef.current = list;
        modalRef.current.open({
          header: renderHeader(),
          content: renderForm(list),
          footer: renderControls()
        });
      }
    }));

    //@@viewOn:private

    function handleSave(opt){
      props.onSave(opt.values)
    }
    //@@viewOff:private

    //@@viewOn:interface
    function validateDate(opt){
      let result;
      if (opt.value && new Date(opt.value) < new Date()){
        result = {
          feedback: "error", 
          message: "Value is in the past!",
          value: opt.value
        };
      } else if (opt.value) {
        result = {
          feedback: "success", 
          value: opt.value
        };
      } else {
        result = {
          feedback: "initial",
          value: opt.value
        };
      }
      opt.component.setFeedback(result.feedback, result.message);
      return result
    }

    function handleSave(opt) {
      modalRef.current.close(true, () => {
        props.onSave(opt.values);
      });
    }

    function handleCancel() {
      modalRef.current.close();
    }
    //@@viewOff:interface

    //@@viewOn:render
    

    

    function renderHeader() {
      return (
        <UU5.Forms.ContextHeader
          content={<UU5.Bricks.Lsi lsi={Lsi.header} />}
        />
      );
    }

    function renderForm(list) {
      return (
        <UU5.Forms.ContextForm onSave={handleSave} onCancel={handleCancel}>
          <UU5.Forms.Text
            label = {<UU5.Bricks.Lsi lsi = {Lsi.nameLabel} />}
            name = "name"
            value = {list.name}
            inputAttrs = {{ maxLength: 255 }}
            // buttons={[{
            //     icon: "uu5-cross",
            //     onClick: reset()
            // }]}
            controlled = {false}
            required
          />

          <UU5.Forms.DatePicker 
            label = {<UU5.Bricks.Lsi lsi = {Lsi.dateLabel} />}
            name = "deadline"
            valueType = "iso"
            onValidate = {validateDate}
            value = {list.deadline}
            controlled = {false}
          />

          <UU5.Forms.TextArea
            label={<UU5.Bricks.Lsi lsi = {Lsi.descLabel} />}
            name = "description"
            value = {list.description}
            inputAttrs = {{ maxLength: 4000 }}
            controlled = {false}
            autoResize
          />
        </UU5.Forms.ContextForm>
      );
    }

    function renderControls() {
      return (
        <UU5.Forms.ContextControls
          buttonSubmitProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.create} /> }}
          buttonCancelProps={{ content: <UU5.Bricks.Lsi lsi={Lsi.cancel} /> }}
        />
      );
    }

    return <UU5.Forms.ContextModal ref_={modalRef} overflow />;
    //@@viewOff:render
  },
});

export default ListCreateForm;
