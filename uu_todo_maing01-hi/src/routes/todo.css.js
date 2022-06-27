import Config from "./config/config";

const itemListColumn = () => Config.Css.css`
  height: 100%;
  padding: 0 20px;
  background-color: #01294A;
`;

const listListColumn = () => Config.Css.css`
  height: 100%;
  padding: 0;
`;

const hr = () => Config.Css.css`
border: 4px solid #9E9E9E;
`;

const createButton = () => Config.Css.css`
text-align: left;
`;

const itemCreate = () => Config.Css.css`
margin: 10px 0 20px 0;
`;

const h100p = () => Config.Css.css`
height: 100%`;

export default {
  itemListColumn,
  hr,
  createButton,
  itemCreate,
  listListColumn,
  h100p,
};
