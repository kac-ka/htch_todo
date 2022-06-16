/* eslint-disable */
const toDoCreateList = shape({
    name: string(1, 30).isRequired(),
    description: uu5String(4000),
    deadline: date()
  });

  const toDoGetList = shape({
    id: id().isRequired()
  });

  const toDoUpdateList = shape({
    id: id().isRequired(),
    name: string(1, 30),
    description: uu5String(),
    deadline: date()
  });

  const toDoDeleteList = shape({
    id: id().isRequired(),
    forceDelete: boolean()
  });

  const listListDtoInType = shape({
    pageInfo: shape({
      pageIndex: integer(),
      pageSize: integer()
    })
  });