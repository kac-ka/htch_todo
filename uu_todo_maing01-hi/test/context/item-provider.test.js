import UU5 from "uu5g04";
import UuTodo from "uu_todo_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`UuTodo.Context.ItemProvider`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuTodo.Context.ItemProvider />);
    expect(wrapper).toMatchSnapshot();
  });
});
