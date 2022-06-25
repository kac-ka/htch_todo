import UU5 from "uu5g04";
import UuTodo from "uu_todo_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`UuTodo.Bricks.ListMenu`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuTodo.Bricks.ListMenu />);
    expect(wrapper).toMatchSnapshot();
  });
});
