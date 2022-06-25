import UU5 from "uu5g04";
import UuTodo from "uu_todo_maing01-hi";

const { shallow } = UU5.Test.Tools;

describe(`UuTodo.Bricks.ItemCreate`, () => {
  it(`default props`, () => {
    const wrapper = shallow(<UuTodo.Bricks.ItemCreate />);
    expect(wrapper).toMatchSnapshot();
  });
});
