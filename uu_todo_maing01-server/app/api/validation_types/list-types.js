/* eslint-disable */
const toDoCreateList = shape({
    name: string(1, 30).isRequired(),
    description: uu5String(4000),
    deadline: date()
  });

  const toDoGetList = shape({
    name: id().isRequired()
  });