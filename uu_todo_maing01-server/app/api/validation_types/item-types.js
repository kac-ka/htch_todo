/* eslint-disable */

const itemCreateDtoInType = shape({
    listId: id().isRequired(),
    text: string(1,1000).isRequired(),
    highPriority: boolean()
  });

  const itemGetDtoInType = shape({
    id: id().isRequired()
  });